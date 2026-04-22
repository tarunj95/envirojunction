"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import slideImage from "../../../public/signin_bg_carousel.png";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Stack,
  Snackbar,
  useMediaQuery,
  useTheme,
  FormHelperText
} from '@mui/material';
import {
  BusinessCenter,
  Business,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { Eye, EyeOff } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import api from "@/utils/api";
import { handleSocialLogin } from "@/utils/auth";

export default function SignupPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await api.post('/auth/register', values);
        const { token, user } = response.data;
        if (token) localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/';
      } catch (error: any) {
        console.error('Signup error:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Registration failed. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Show snackbar if validation fails on submit attempt
  React.useEffect(() => {
    if (formik.submitCount > 0 && !formik.isValid) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly.'
      });
    }
  }, [formik.submitCount]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides = [
    {
      title: "Global Environmental Tenders at Your Fingertips",
      description: "Access a curated database of high-impact green projects and bidding opportunities across Pan India."
    },
    {
      title: "Stay Informed on Critical Climate Insights",
      description: "Get real-time updates on wildlife conservation, global warming reports, and national policy changes."
    },
    {
      title: "Empower Your Career in Sustainability",
      description: "Connect with top-tier organizations and explore thousands of expert vacancies in the environmental sector."
    }
  ];

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);

    // Auto-play interval
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      {/* Mobile/Tablet Block Overlay */}
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'white',
          zIndex: 10000,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
            fontFamily: '"Be Vietnam Pro", sans-serif'
          }}
        >
          View in Desktop View Only
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            maxWidth: '280px',
            lineHeight: 1.6
          }}
        >
          For the best experience, please access EnviroJunction on a desktop or laptop computer.
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        bgcolor: 'white',
        overflow: 'hidden'
      }}>
        {/* Left Section - Carousel & Background */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            flex: 790,
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 6,
            color: 'white',
            overflow: 'hidden',
            bgcolor: '#207055' // Fallback color
          }}
        >
          {/* Background Animation & Gradient Layer */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(0deg, #D9D9D9, #D9D9D9),
                linear-gradient(180deg, rgba(32, 112, 85, 0.4) 0%, #113227f5 62.36%),
                url(${slideImage.src})
              `,
              backgroundBlendMode: 'overlay, normal, normal',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />

          {/* Content Layer */}
          <Box sx={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ mb: 8 }}>
                <img src="/logo.png" alt="EnviroJunction" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
              </Box>
            </Box>

            <Box>
              {/* Carousel Container - Moved here to be just above icons */}
              <Box ref={emblaRef} sx={{ overflow: 'hidden', mb: 2 }}>
                <Box sx={{ display: 'flex' }}>
                  {slides.map((slide, index) => (
                    <Box key={index} sx={{ flex: '0 0 100%', minWidth: 0 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 700,
                          fontSize: '42px',
                          lineHeight: '48px',
                          letterSpacing: '0%',
                          mb: 2,
                          maxWidth: '550px'
                        }}
                      >
                        {slide.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0%',
                          opacity: 0.9,
                          mb: 4,
                          maxWidth: '520px'
                        }}
                      >
                        {slide.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Stack direction="row" spacing={4} sx={{ mb: 6 }}>
                {[
                  { icon: <BusinessCenter />, value: '1,75,324', label: 'Live Job' },
                  { icon: <Business />, value: '97,354', label: 'Companies' },
                  { icon: <BusinessCenter />, value: '7,532', label: 'New Jobs' }
                ].map((stat, idx) => (
                  <Stack key={idx} spacing={1}>
                    <Box sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {stat.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Pagination Indicators */}
              <Stack direction="row" spacing={1}>
                {slides.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    sx={{
                      width: selectedIndex === index ? 40 : 40,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: selectedIndex === index ? 'white' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

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
            height: { xs: 'auto', lg: 'auto' },
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
            Sign up
          </Typography>


          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First name"
                  variant="outlined"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
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
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  variant="outlined"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
              </Box>
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
              <FormControl fullWidth variant="outlined"
                error={formik.touched.password && Boolean(formik.errors.password)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    '& fieldset': { borderColor: '#eee' },
                    '&:hover fieldset': { borderColor: '#ccc' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        sx={{
                          color: '#999',
                          '&:hover': { color: '#1e6b52' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error id="password-error" sx={{ mx: 0 }}>
                    {formik.errors.password}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined"
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    '& fieldset': { borderColor: '#eee' },
                    '&:hover fieldset': { borderColor: '#ccc' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}>
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        sx={{
                          color: '#999',
                          '&:hover': { color: '#1e6b52' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <FormHelperText error id="confirmPassword-error" sx={{ mx: 0 }}>
                    {formik.errors.confirmPassword}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Replaced remember me / forgot for signup */}

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
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#f0f0f0' }} />
                <Typography sx={{ px: 2, color: '#999', fontSize: '0.85rem' }}>or</Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#f0f0f0' }} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1.5,
                  width: '100%',
                  mt: 1
                }}
              >
                {[
                  { name: 'linkedin', color: '#0077b5', iconColor: 'white' },
                  { name: 'google', color: '#ffffff', border: '#eee', iconColor: 'none' },
                  { name: 'facebook', color: '#1877f2', iconColor: 'white' },
                  { name: 'instagram', color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', iconColor: 'white' }
                ].map((social) => (
                  <IconButton
                    key={social.name}
                    onClick={() => handleSocialLogin(social.name)}
                    sx={{
                      background: social.color,
                      border: social.border ? `1px solid ${social.border}` : 'none',
                      color: social.iconColor,
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        opacity: 0.9,
                        transform: 'translateY(-2px)'
                      },
                      '& .social-icon': {
                        width: 20,
                        height: 20
                      }
                    }}
                  >
                    {social.name === 'google' ? (
                      <svg className="social-icon" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    ) : social.name === 'linkedin' ? (
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    ) : social.name === 'facebook' ? (
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    ) : (
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                    )}
                  </IconButton>
                ))}
              </Box>

              <Typography variant="body2" align="center" sx={{ color: '#666', mt: 2 }}>
                Already have an Account?{' '}
                <Link href="/signin" style={{ color: '#1e6b52', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </form>
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
    </>
  );
}
