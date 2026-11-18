"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { syncSocialUserWithBackend, setAuthCookies } from "@/utils/auth";
import { CircularProgress, Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function SsoCallbackPage() {
  const router = useRouter();
  const [returnTo, setReturnTo] = useState<string>("/profile");

  const [status, setStatus] = useState<"loading" | "syncing" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const target = params.get("returnTo") || "/profile";
      setReturnTo(target);
    }

    async function completeSSO() {
      try {
        setStatus("loading");

        // 1. Fetch authenticated user profile from Auth0 session route
        let profile: any = null;
        let attempts = 0;
        const maxAttempts = 6;

        while (attempts < maxAttempts && !profile && !isCancelled) {
          attempts++;
          try {
            const res = await fetch("/auth/profile");
            if (res.ok) {
              profile = await res.json();
              break;
            }
          } catch (_) {}
          // Wait 500ms between attempts if session is still settling
          if (!profile && attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }

        if (isCancelled) return;

        if (!profile || !profile.email) {
          setStatus("error");
          setErrorMessage(
            "No authenticated SSO session found. Please verify your Auth0 application credentials and Allowed Callback URLs (http://localhost:9002/auth/callback)."
          );
          return;
        }

        // 2. Sync verified profile with the backend
        setStatus("syncing");
        const authResponse = await syncSocialUserWithBackend(profile);

        if (isCancelled) return;

        if (authResponse?.token) {
          localStorage.setItem("token", authResponse.token);
          setAuthCookies(authResponse.token);
        }
        if (authResponse?.user) {
          const userWithPic = {
            ...authResponse.user,
            avatar: authResponse.user.avatar || profile.picture,
            picture: authResponse.user.picture || profile.picture,
          };
          localStorage.setItem("user", JSON.stringify(userWithPic));
        } else if (profile) {
          const initialUser = {
            name: profile.name,
            email: profile.email,
            avatar: profile.picture,
            picture: profile.picture,
          };
          localStorage.setItem("user", JSON.stringify(initialUser));
        }

        setStatus("success");

        // 3. Redirect to destination
        setTimeout(() => {
          if (!isCancelled) {
            router.push(returnTo);
          }
        }, 800);
      } catch (err: any) {
        if (!isCancelled) {
          console.error("SSO Callback Error:", err);
          setStatus("error");
          setErrorMessage(
            err.formattedMessage ||
              err.message ||
              "Failed to complete Single Sign-On. Please try signing in again."
          );
        }
      }
    }

    completeSSO();

    return () => {
      isCancelled = true;
    };
  }, [router, returnTo]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f8f9fa",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          maxWidth: 480,
          width: "100%",
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {status === "loading" || status === "syncing" ? (
          <>
            <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
              <CircularProgress size={64} sx={{ color: "#1e6b52" }} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockOutlinedIcon sx={{ color: "#1e6b52", fontSize: 24 }} />
              </Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
              {status === "loading" ? "Verifying SSO Session..." : "Connecting Your Profile..."}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Please wait while we complete your Single Sign-On and synchronize with EnviroJunction.
            </Typography>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircleIcon sx={{ color: "#1e6b52", fontSize: 64, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
              Sign-In Successful!
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Redirecting you to your account...
            </Typography>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ color: "#d32f2f", fontSize: 64, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
              SSO Sign-In Notice
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/signin")}
              sx={{
                bgcolor: "#1e6b52",
                color: "white",
                py: 1.2,
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#154d3b" },
              }}
            >
              Return to Sign In
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
