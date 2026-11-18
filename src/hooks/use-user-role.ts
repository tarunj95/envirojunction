"use client";

import { useState, useEffect } from "react";

export type UserRole = "user" | "organisation" | "admin";

export interface UserSession {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  avatar?: string;
  organisationDetails?: {
    companyName?: string;
    expertise?: string[];
    companySize?: string;
    primaryUseCase?: string;
    website?: string;
    linkedin?: string;
    about?: string;
    logo?: string;
    gstNumber?: string;
    cinNumber?: string;
  };
  [key: string]: any;
}

export function useUserRole() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const role: UserRole = user?.role || "user";
  const isOrganisation = role === "organisation";
  const isAdmin = role === "admin";
  const isIndividual = role === "user";

  return {
    user,
    role,
    loading,
    isOrganisation,
    isAdmin,
    isIndividual,
    // Privileges
    canPostJobs: isOrganisation || isAdmin,
    canPostTenders: isOrganisation || isAdmin,
    canManageUsers: isAdmin,
    canManageAllContent: isAdmin,
    badgeText: isOrganisation ? "Organisation" : isAdmin ? "Admin" : "Individual",
    badgeColor: isOrganisation ? "#1e6b52" : isAdmin ? "#7c3aed" : "#64748b",
  };
}
