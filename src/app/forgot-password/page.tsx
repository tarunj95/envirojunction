"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  BusinessCenter,
  Business,
} from '@mui/icons-material';
import api from "@/utils/api";
import AuthLeftPanel from '../components/AuthLeftPanel';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token || user) {
      if (token) document.cookie = `token=${token}; path=/; max-age=2592000`;
      if (user) document.cookie = `user_exists=true; path=/; max-age=2592000`;
      router.push('/profile');
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Mocking API call for sending OTP
        // const response = await api.post('/auth/forgot-password', values);
        setTimeout(() => {
          setIsOtpSent(true);
          setIsLoading(false);
          setSnackbar({
            open: true,
            message: 'OTP sent to your email.'
          });
        }, 1000);
      } catch (error: any) {
        console.error('Forgot password error:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to send OTP. Please try again.'
        });
        setIsLoading(false);
      }
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input automatically
    if (value !== '' && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0 && otpRefs.current[index - 1]) {
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setSnackbar({ open: true, message: 'Please enter a valid 6-digit OTP' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Mock verify OTP endpoint
      setTimeout(() => {
        setSnackbar({ open: true, message: 'OTP verified successfully!' });
        setIsLoading(false);
        // Normally redirect to reset password here
      }, 1000);
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Invalid OTP. Please try again.' });
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (formik.submitCount > 0 && !formik.isValid) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly.'
      });
    }
  }, [formik.submitCount]);

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      position: 'relative',
      bgcolor: 'white',
      overflow: 'hidden'
    }}>
      <AuthLeftPanel />

        {/* Right Section - White space */}
        <Box sx={{
          flex: 490,
          bgcolor: 'white',
          height: '100%'
        }} />

        {/* Centered Form Card */}
        <Paper
          elevation={10}
          sx={{
            position: 'absolute',
            left: { xs: '50%', lg: '72%' },
            top: { xs: '50%', lg: '50%' },
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', lg: '540px' },
            p: { xs: 4, lg: 6 },
            borderRadius: '40px',
            zIndex: 2,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Be Vietnam Pro", sans-serif',
              fontWeight: 700,
              fontSize: '28px',
              lineHeight: '40px',
              letterSpacing: '0%',
              mb: 1,
              color: '#1a1a1a'
            }}
          >
            {isOtpSent ? 'Verify OTP' : 'Forgot Password'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4, fontSize: '0.9rem' }}>
            {isOtpSent 
              ? 'Please enter the 6-digit code sent to your email address.' 
              : 'Enter the email address associated with your account, and we will send you a code to reset your password.'}
          </Typography>

          {!isOtpSent ? (
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email address"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: '#f8f9fa',
                      '& fieldset': { borderColor: '#eee' },
                      '&:hover fieldset': { borderColor: '#ccc' },
                      '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                    }
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    bgcolor: '#1e6b52',
                    color: 'white',
                    py: 1.8,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#154d3b', boxShadow: 'none' }
                  }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Remember your password?{' '}
                    <Link href="/signin" style={{ color: '#1e6b52', fontWeight: 600, textDecoration: 'none' }}>
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </form>
          ) : (
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (otpRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e as any)}
                    slotProps={{ htmlInput: {
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }
                    } }}
                    sx={{
                      width: { xs: '2.5rem', sm: '3.5rem' },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderColor: '#eee' },
                        '&:hover fieldset': { borderColor: '#ccc' },
                        '&.Mui-focused fieldset': { borderColor: '#1e6b52' },
                        p: 0,
                      },
                      '& .MuiInputBase-input': {
                        height: { xs: '2.5rem', sm: '3.5rem' },
                        p: 0,
                      }
                    }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                sx={{
                  bgcolor: '#1e6b52',
                  color: 'white',
                  py: 1.8,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#154d3b', boxShadow: 'none' }
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>
                  Didn't receive the code?{' '}
                  <Typography
                    component="span"
                    onClick={() => {
                        // Reset OTP state to resend
                        setOtp(['', '', '', '', '', '']);
                        formik.handleSubmit();
                    }}
                    sx={{ color: '#1e6b52', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Resend OTP
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    <span 
                      style={{ color: '#1e6b52', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => setIsOtpSent(false)}
                    >
                      Change Email Address
                    </span>
                  </Typography>
              </Box>
            </Stack>
          )}
        </Paper>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          key="bottom-right"
        />
      </Box>
    );
}
