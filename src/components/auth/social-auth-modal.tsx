'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { handleSocialLogin, handleDirectOAuth, AUTH0_CONNECTIONS } from '@/utils/auth';

interface SocialAuthModalProps {
  open: boolean;
  onClose: () => void;
  provider: string; // 'google' | 'linkedin' | 'facebook' | 'instagram'
  isSignUp?: boolean;
  defaultEmail?: string;
  defaultName?: string;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

const PROVIDER_METADATA: Record<
  string,
  {
    name: string;
    brandColor: string;
    iconColor: string;
    borderColor?: string;
    svgPath: React.ReactNode;
  }
> = {
  google: {
    name: 'Google',
    brandColor: '#ffffff',
    iconColor: '#4285F4',
    borderColor: '#e0e0e0',
    svgPath: (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  linkedin: {
    name: 'LinkedIn',
    brandColor: '#0077b5',
    iconColor: '#ffffff',
    svgPath: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0077b5">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  facebook: {
    name: 'Facebook',
    brandColor: '#1877f2',
    iconColor: '#ffffff',
    svgPath: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  instagram: {
    name: 'Instagram',
    brandColor: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    iconColor: '#ffffff',
    svgPath: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#e1306c">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
      </svg>
    ),
  },
};

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  open,
  onClose,
  provider,
  isSignUp = false,
  defaultEmail = '',
  defaultName = '',
  onSuccess,
  onError,
}) => {
  const providerLower = (provider || 'google').toLowerCase();
  const meta = PROVIDER_METADATA[providerLower] || PROVIDER_METADATA.google;

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (open) {
      if (defaultEmail) setEmail(defaultEmail);
      if (defaultName) setName(defaultName);
      setInputError('');
      setLoading(false);
    }
  }, [open, defaultEmail, defaultName]);

  const handleInstantSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setInputError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setInputError('');

    try {
      await handleSocialLogin(providerLower, {
        email: email.trim(),
        name: name.trim() || email.split('@')[0],
        isSignUp,
        onSuccess: (msg) => {
          if (onSuccess) onSuccess(msg);
          onClose();
        },
        onError: (err) => {
          setInputError(err);
          if (onError) onError(err);
          setLoading(false);
        },
      });
    } catch (err: any) {
      setInputError(err?.formattedMessage || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuthRedirect = () => {
    setLoading(true);
    handleDirectOAuth(providerLower, '/profile');
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1.5,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: '#f5f5f5',
              border: '1px solid #e5e7eb',
            }}
          >
            {meta.svgPath}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>
              {isSignUp ? `Sign up with ${meta.name}` : `Continue with ${meta.name}`}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: -0.5 }}>
              EnviroJunction Social Access
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{ color: '#9ca3af', '&:hover': { color: '#111827' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleInstantSignIn}>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <Typography variant="body2" sx={{ color: '#4b5563', mb: 2.5, lineHeight: 1.5 }}>
            Sign in or create your profile using your {meta.name} identity to access environmental jobs, tenders, and professional connections.
          </Typography>

          {inputError && (
            <Box
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 1.5,
                bgcolor: '#fee2e2',
                color: '#991b1b',
                fontSize: '0.85rem',
                border: '1px solid #fecaca',
              }}
            >
              {inputError}
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              size="small"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Alex Morgan"
              disabled={loading}
              helperText="Optional (defaults to your email username)"
            />

            <TextField
              label="Email Address"
              variant="outlined"
              size="small"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (inputError) setInputError('');
              }}
              placeholder={`e.g. you@${providerLower === 'google' ? 'gmail.com' : 'example.com'}`}
              disabled={loading}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: '#1e6b52',
              color: 'white',
              py: 1.3,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#154d3b', boxShadow: 'none' },
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                <span>Connecting...</span>
              </Box>
            ) : isSignUp ? (
              `Sign Up with ${meta.name}`
            ) : (
              `Continue with ${meta.name}`
            )}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 0.5 }}>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e5e7eb' }} />
            <Typography sx={{ px: 1.5, color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              or OAuth redirect
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#e5e7eb' }} />
          </Box>

          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={handleOAuthRedirect}
            disabled={loading}
            sx={{
              borderColor: '#d1d5db',
              color: '#374151',
              py: 1.1,
              borderRadius: 2,
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' },
            }}
          >
            Authenticate via {meta.name} OAuth
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
