"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import api from "@/utils/api";
import { handleSocialLogin, setAuthCookies } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import AuthLeftPanel from '../../components/AuthLeftPanel';

const ALL_EXPERTISE_OPTIONS = [
  "Wildlife Protection & Management",
  "Reforestation & Afforestation",
  "Marine & Coastal Conservation",
  "Invasive Species Control",
  "Ecosystem Restoration",
  "Renewable Energy & Solar",
  "Waste Management & Circular Economy",
  "Environmental Impact Assessment (EIA)",
  "Water Resource & Watershed Management",
  "Climate Change Mitigation & ESG",
  "Pollution Control & Air Quality",
  "Sustainable Agriculture & Agroforestry"
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees"
];

const PRIMARY_USE_CASES = [
  "Post Environmental Jobs & Hire Talent",
  "Publish Tenders & RFPs",
  "Find Environmental Consultants & Experts",
  "Collaborate on Conservation Projects",
  "Access Environmental Insights & Network"
];

export default function OrganisationSignupPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSsoConfigDialog, setShowSsoConfigDialog] = useState(false);

  // Logo upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpertiseMenuOpen, setIsExpertiseMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'sso_not_configured') {
        setShowSsoConfigDialog(true);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token || user) {
      setAuthCookies(token || undefined);
      router.push('/profile');
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      // Step 1
      companyName: '',
      workEmail: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,

      // Step 2
      expertise: [
        "Wildlife Protection & Management",
        "Reforestation & Afforestation",
        "Marine & Coastal Conservation",
        "Invasive Species Control",
        "Ecosystem Restoration"
      ],
      companySize: '',
      primaryUseCase: '',

      // Step 3
      websiteLink: '',
      linkedin: '',
      aboutCompany: '',
      gstNumber: '',
      cinNumber: '',
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required('Company name is required'),
      workEmail: Yup.string().email('Invalid email address').required('Work email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm password is required'),
      agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms of service'),
    }),
    onSubmit: async (values) => {
      await handleCompleteRegistration(values);
    },
  });

  const handleStep1Next = async () => {
    formik.setFieldTouched('companyName', true);
    formik.setFieldTouched('workEmail', true);
    formik.setFieldTouched('password', true);
    formik.setFieldTouched('confirmPassword', true);
    formik.setFieldTouched('agreeTerms', true);

    const step1Errors = await formik.validateForm();
    if (
      step1Errors.companyName ||
      step1Errors.workEmail ||
      step1Errors.password ||
      step1Errors.confirmPassword ||
      !formik.values.agreeTerms
    ) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: !formik.values.agreeTerms
          ? "Please agree to the Terms of Services to continue."
          : "Please fill in all mandatory details correctly.",
      });
      return;
    }

    setStep(2);
  };

  const handleStep2Next = () => {
    if (formik.values.expertise.length === 0) {
      toast({
        variant: "destructive",
        title: "Expertise Required",
        description: "Please select at least one area of expertise.",
      });
      return;
    }
    setStep(3);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeLogo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLogoFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleExpertise = (item: string) => {
    const current = formik.values.expertise;
    if (current.includes(item)) {
      formik.setFieldValue('expertise', current.filter((x) => x !== item));
    } else {
      formik.setFieldValue('expertise', [...current, item]);
    }
  };

  const handleCompleteRegistration = async (values = formik.values) => {
    setIsLoading(true);
    try {
      const orgDetails = {
        companyName: values.companyName.trim(),
        expertise: values.expertise,
        companySize: values.companySize,
        primaryUseCase: values.primaryUseCase,
        website: values.websiteLink.trim(),
        linkedin: values.linkedin.trim(),
        about: values.aboutCompany.trim(),
        gstNumber: values.gstNumber.trim(),
        cinNumber: values.cinNumber.trim(),
      };

      const payload = {
        name: values.companyName.trim(),
        email: values.workEmail.trim(),
        password: values.password,
        role: 'organisation',
        expertise: values.expertise,
        companySize: values.companySize,
        primaryUseCase: values.primaryUseCase,
        website: values.websiteLink.trim(),
        linkedin: values.linkedin.trim(),
        about: values.aboutCompany.trim(),
        gstNumber: values.gstNumber.trim(),
        cinNumber: values.cinNumber.trim(),
        organisationDetails: orgDetails,
      };

      let resultData: any = null;

      // 1. Try Next.js API route first (handles local backend or remote safely)
      try {
        const res = await fetch('/api/auth/signup/organisation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const resJson = await res.json().catch(() => ({}));

        if (res.ok) {
          resultData = resJson;
        } else if (res.status === 400 && resJson?.message) {
          const errMsg = Array.isArray(resJson.message) ? resJson.message.join(', ') : resJson.message;
          throw new Error(errMsg);
        }
      } catch (proxyErr: any) {
        if (proxyErr?.message && (proxyErr.message.includes('already exists') || proxyErr.message.includes('must be') || proxyErr.message.includes('Password'))) {
          throw proxyErr;
        }
        console.warn('Proxy route error, falling back to direct API client:', proxyErr?.message);
      }

      // 2. If proxy route didn't return data, try direct backend api call
      if (!resultData) {
        try {
          const directResponse = await api.post('/auth/signup/organisation', payload);
          resultData = directResponse.data;
        } catch (directErr: any) {
          console.warn('Direct organisation signup endpoint unrouted, falling back to standard /auth/signup:', directErr?.message);
          // Fallback to standard /auth/signup strictly with { name, email, password } so strict backend pipes don't reject
          const fallbackResponse = await api.post('/auth/signup', {
            name: values.companyName.trim(),
            email: values.workEmail.trim(),
            password: values.password,
          });
          resultData = fallbackResponse.data;
        }
      }

      if (!resultData) {
        throw new Error('Registration could not be completed. Please try again.');
      }

      const { token, user, message } = resultData;
      if (token) {
        localStorage.setItem('token', token);
      }

      const registeredUser = {
        ...(user || {}),
        name: values.companyName.trim(),
        email: values.workEmail.trim(),
        role: 'organisation',
        organisationDetails: orgDetails,
      };

      localStorage.setItem('user', JSON.stringify(registeredUser));
      setAuthCookies(token);

      toast({
        variant: "success",
        title: "Organisation Account Created",
        description: message || "Your organisation account has been created successfully! Welcome to EnviroJunction.",
      });

      setTimeout(() => {
        router.push('/profile');
      }, 500);
    } catch (error: any) {
      console.error('Organisation registration error:', error);
      const errorMessage =
        error.message ||
        error.formattedMessage ||
        (Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join(', ')
          : error.response?.data?.message) ||
        error.response?.data?.error ||
        'Registration failed. Please check your details and try again.';

      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = async (provider: string) => {
    setIsLoading(true);
    try {
      await handleSocialLogin(provider, {
        email: formik.values.workEmail,
        name: formik.values.companyName,
        isSignUp: true,
        onSuccess: (msg) => {
          toast({
            variant: "success",
            title: "Sign Up Successful",
            description: msg,
          });
        },
        onError: (msg) => {
          toast({
            variant: "destructive",
            title: "Social Sign Up Failed",
            description: msg,
          });
          setIsLoading(false);
          setShowSsoConfigDialog(true);
        },
      });
    } catch {
      setIsLoading(false);
      setShowSsoConfigDialog(true);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
      minHeight: '100vh',
      position: 'relative',
      bgcolor: { xs: '#f8faf9', lg: 'white' },
      overflowY: 'auto',
      overflowX: 'hidden',
      justifyContent: { xs: 'center', lg: 'initial' },
      alignItems: { xs: 'center', lg: 'initial' },
      py: { xs: 4, lg: 0 },
      px: { xs: 2, sm: 3, lg: 0 }
    }}>
      <AuthLeftPanel />

      {/* Right Section - White space */}
      <Box sx={{
        flex: 490,
        bgcolor: 'white',
        height: '100%',
        display: { xs: 'none', lg: 'block' }
      }} />

      {/* Centered Form Card */}
      <Paper
        elevation={10}
        sx={{
          position: { xs: 'relative', lg: 'absolute' },
          left: { xs: 'auto', lg: '72%' },
          top: { xs: 'auto', lg: '50%' },
          transform: { xs: 'none', lg: 'translate(-50%, -50%)' },
          width: { xs: '100%', sm: '480px', lg: '540px' },
          maxWidth: '100%',
          p: { xs: 3, sm: 4, lg: 6 },
          borderRadius: { xs: '24px', sm: '32px', lg: '40px' },
          zIndex: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          my: { xs: 'auto', lg: 0 },
          maxHeight: { lg: '94vh' },
          overflowY: { lg: 'auto' },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#e2e8f0',
            borderRadius: '4px',
          }
        }}
      >
        {/* Mobile Logo */}
        <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center', mb: 2 }}>
          <Link href="/">
            <img src="/Enviro%20Logo%20Green%20option.svg" alt="EnviroJunction" style={{ height: '36px', width: 'auto' }} />
          </Link>
        </Box>

        {/* Back Navigation Button */}
        <Box sx={{ mb: 2 }}>
          {step === 1 ? (
            <Link href="/signin" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  color: '#555',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  py: 0.6,
                  px: 1.4,
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  bgcolor: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#1e6b52',
                    borderColor: '#1e6b52',
                    bgcolor: '#f0fdf4',
                    transform: 'translateX(-2px)'
                  }
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
                <span>Back to Sign In</span>
              </Box>
            </Link>
          ) : (
            <Box
              onClick={() => setStep((prev) => (prev === 3 ? 2 : 1))}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                color: '#555',
                fontSize: '0.85rem',
                fontWeight: 600,
                py: 0.6,
                px: 1.4,
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                bgcolor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#1e6b52',
                  borderColor: '#1e6b52',
                  bgcolor: '#f0fdf4',
                  transform: 'translateX(-2px)'
                }
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              <span>Back to Step {step - 1}</span>
            </Box>
          )}
        </Box>

        {/* Form Title */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Be Vietnam Pro", sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            lineHeight: '36px',
            letterSpacing: '-0.02em',
            mb: 0.5,
            color: '#111827'
          }}
        >
          Sign up as an Organisation
        </Typography>

        {/* Dynamic Subtitle */}
        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.92rem', mb: 2 }}>
          {step === 1 && "To create an account, kindly share the necessary details."}
          {step === 2 && "Please select one or more areas of expertise"}
          {step === 3 && "Company Details"}
        </Typography>

        {/* Step Indicator & Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: '#4b5563',
              fontWeight: 500,
              mb: 0.75
            }}
          >
            Step {step}/3
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '5px',
              bgcolor: '#e5e7eb',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                height: '100%',
                bgcolor: '#1e6b52',
                borderRadius: '999px',
                width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%',
                transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </Box>
        </Box>

        {/* ================= STEP 1/3 ================= */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleStep1Next(); }}>
            <Stack spacing={2.2}>
              <TextField
                fullWidth
                id="companyName"
                name="companyName"
                placeholder="Company Name"
                variant="outlined"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}
              />

              <TextField
                fullWidth
                id="workEmail"
                name="workEmail"
                placeholder="Work Email"
                type="email"
                variant="outlined"
                value={formik.values.workEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.workEmail && Boolean(formik.errors.workEmail)}
                helperText={formik.touched.workEmail && formik.errors.workEmail}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}
              />

              <FormControl fullWidth variant="outlined" error={formik.touched.password && Boolean(formik.errors.password)}>
                <OutlinedInput
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'hide password' : 'show password'}
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: '#6b7280' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error sx={{ mx: 0 }}>{formik.errors.password}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth variant="outlined" error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'hide confirm password' : 'show confirm password'}
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        sx={{ color: '#6b7280' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <FormHelperText error sx={{ mx: 0 }}>{formik.errors.confirmPassword}</FormHelperText>
                )}
              </FormControl>

              {/* Terms Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formik.values.agreeTerms}
                    onChange={formik.handleChange}
                    sx={{
                      color: '#9ca3af',
                      '&.Mui-checked': { color: '#1e6b52' }
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    I've read and agree with your{' '}
                    <span style={{ color: '#1e6b52', fontWeight: 600 }}>
                      Terms of Services
                    </span>
                  </Typography>
                }
                sx={{ alignItems: 'center', ml: -0.5, mt: -0.5 }}
              />

              {/* Create An Account Button */}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  bgcolor: '#1e6b52',
                  color: 'white',
                  py: 1.6,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#154d3b', boxShadow: 'none' }
                }}
              >
                Create An Account
              </Button>

              {/* or divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#f0f0f0' }} />
                <Typography sx={{ px: 2, color: '#6b7280', fontSize: '0.85rem' }}>or</Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#f0f0f0' }} />
              </Box>

              {/* Social Login Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1.5,
                  width: '100%',
                }}
              >
                {[
                  { name: 'linkedin', color: '#0077b5', iconColor: 'white' },
                  { name: 'google', color: '#ffffff', border: '#e5e7eb', iconColor: 'none' },
                  { name: 'facebook', color: '#1877f2', iconColor: 'white' },
                  { name: 'instagram', color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', iconColor: 'white' }
                ].map((social) => (
                  <IconButton
                    key={social.name}
                    onClick={() => handleSocialClick(social.name)}
                    disabled={isLoading}
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
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
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

              {/* Bottom Navigation to Individual Signup */}
              <Box sx={{ pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="body2" align="center" sx={{ color: '#4a4a4a', fontWeight: 600, fontSize: '0.95rem' }}>
                  Sign up as a{' '}
                  <Link
                    href="/signup"
                    style={{
                      color: '#1e6b52',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px'
                    }}
                  >
                    Individual
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        )}

        {/* ================= STEP 2/3 ================= */}
        {step === 2 && (
          <Box>
            <Stack spacing={2.5}>
              {/* Area of Expertise Box matching Image 2 */}
              <Box
                sx={{
                  position: 'relative',
                  border: '1.5px solid #2d6a4f',
                  borderRadius: '10px',
                  p: 2,
                  pt: 2.2,
                  bgcolor: '#ffffff'
                }}
              >
                {/* Outlined Legend Header */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -11,
                    left: 12,
                    bgcolor: '#ffffff',
                    px: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4
                  }}
                >
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f2937' }}>
                    Area of Expertise
                  </Typography>
                  <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>*</Typography>
                </Box>

                {/* Chevron icon toggling dropdown */}
                <IconButton
                  size="small"
                  onClick={() => setIsExpertiseMenuOpen(!isExpertiseMenuOpen)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 14,
                    color: '#1e6b52'
                  }}
                >
                  <ChevronDownIcon
                    sx={{
                      transform: isExpertiseMenuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </IconButton>

                {/* Selected Expertise Badges */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pr: 4 }}>
                  {formik.values.expertise.map((item) => {
                    const isOrange = item === "Invasive Species Control";
                    return (
                      <Chip
                        key={item}
                        label={item}
                        onDelete={() => handleToggleExpertise(item)}
                        sx={{
                          borderRadius: '16px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          bgcolor: isOrange ? '#fef3c7' : '#e6f4ea',
                          color: isOrange ? '#b45309' : '#135341',
                          border: isOrange ? '1px solid #fde68a' : '1px solid #c7eed8',
                          height: 'auto',
                          py: 0.5,
                          '& .MuiChip-label': {
                            px: 1.2,
                          },
                          '& .MuiChip-deleteIcon': {
                            color: isOrange ? '#b45309' : '#135341',
                            fontSize: '16px',
                            '&:hover': {
                              color: isOrange ? '#92400e' : '#04422b',
                            }
                          }
                        }}
                      />
                    );
                  })}
                  {formik.values.expertise.length === 0 && (
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', py: 0.5 }}>
                      Click the arrow on the right to select areas of expertise...
                    </Typography>
                  )}
                </Box>

                {/* Dropdown Options List */}
                {isExpertiseMenuOpen && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 1.5,
                      borderTop: '1px solid #f1f5f9',
                      maxHeight: '160px',
                      overflowY: 'auto'
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', mb: 1, textTransform: 'uppercase' }}>
                      Choose or remove expertise:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                      {ALL_EXPERTISE_OPTIONS.map((opt) => {
                        const isSelected = formik.values.expertise.includes(opt);
                        return (
                          <Chip
                            key={opt}
                            label={opt}
                            clickable
                            onClick={() => handleToggleExpertise(opt)}
                            variant={isSelected ? "filled" : "outlined"}
                            icon={isSelected ? <CheckIcon sx={{ fontSize: '14px !important' }} /> : undefined}
                            sx={{
                              borderRadius: '16px',
                              fontSize: '0.78rem',
                              bgcolor: isSelected ? '#1e6b52' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#374151',
                              borderColor: isSelected ? '#1e6b52' : '#cbd5e1',
                              '&:hover': {
                                bgcolor: isSelected ? '#154d3b' : '#f8fafc'
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Company Size Select */}
              <FormControl fullWidth variant="outlined">
                <Select
                  id="companySize"
                  name="companySize"
                  value={formik.values.companySize}
                  onChange={formik.handleChange}
                  displayEmpty
                  IconComponent={ChevronDownIcon}
                  sx={{
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' },
                    '& .MuiSelect-icon': { color: '#1e6b52' }
                  }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: '#9ca3af' }}>Company Size</span>
                  </MenuItem>
                  {COMPANY_SIZES.map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Primary Use Case Select */}
              <FormControl fullWidth variant="outlined">
                <Select
                  id="primaryUseCase"
                  name="primaryUseCase"
                  value={formik.values.primaryUseCase}
                  onChange={formik.handleChange}
                  displayEmpty
                  IconComponent={ChevronDownIcon}
                  sx={{
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' },
                    '& .MuiSelect-icon': { color: '#1e6b52' }
                  }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: '#9ca3af' }}>Primary Use Case</span>
                  </MenuItem>
                  {PRIMARY_USE_CASES.map((useCase) => (
                    <MenuItem key={useCase} value={useCase}>{useCase}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Next Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleStep2Next}
                sx={{
                  bgcolor: '#1e6b52',
                  color: 'white',
                  py: 1.6,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  mt: 2,
                  '&:hover': { bgcolor: '#154d3b', boxShadow: 'none' }
                }}
              >
                Next
              </Button>
            </Stack>
          </Box>
        )}

        {/* ================= STEP 3/3 ================= */}
        {step === 3 && (
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2.2}>
              {/* Website Link */}
              <TextField
                fullWidth
                id="websiteLink"
                name="websiteLink"
                placeholder="Website Link"
                variant="outlined"
                value={formik.values.websiteLink}
                onChange={formik.handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}
              />

              {/* Linked in ( Optional ) */}
              <TextField
                fullWidth
                id="linkedin"
                name="linkedin"
                placeholder="Linked in ( Optional )"
                variant="outlined"
                value={formik.values.linkedin}
                onChange={formik.handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}
              />

              {/* About Company */}
              <TextField
                fullWidth
                id="aboutCompany"
                name="aboutCompany"
                placeholder="About Company"
                multiline
                rows={3}
                variant="outlined"
                value={formik.values.aboutCompany}
                onChange={formik.handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#ffffff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                  }
                }}
              />

              {/* Company Logo Upload Box matching Image 3 */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>
                      Company Logo
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Add your documents here, and you can upload up to 5 files max
                    </Typography>
                  </Box>
                  {logoPreview && (
                    <IconButton size="small" onClick={removeLogo} sx={{ color: '#6b7280' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png,image/jpeg,image/svg+xml"
                  style={{ display: 'none' }}
                />

                <Box
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: '1.5px dashed #2d6a4f',
                    borderRadius: '12px',
                    p: 2.5,
                    textAlign: 'center',
                    bgcolor: isDragging ? '#f0fdf4' : '#fafdfb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#f0fdf4',
                      borderColor: '#1e6b52'
                    }
                  }}
                >
                  {logoPreview ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e6b52' }}>
                          {logoFile?.name || "logo.png"}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Click to change file
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.75 }}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1e6b52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                          <path d="M12 12v9" />
                          <path d="m16 16-4-4-4 4" />
                        </svg>
                      </Box>
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151', mb: 0.25 }}>
                        Drag your file(s) or{' '}
                        <span style={{ color: '#1e6b52', fontWeight: 600, textDecoration: 'underline' }}>
                          browse
                        </span>
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        jpg, png, or svg
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              {/* Side by side: GST Number & CIN Number */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <TextField
                  fullWidth
                  id="gstNumber"
                  name="gstNumber"
                  placeholder="GST Number ( Optional )"
                  variant="outlined"
                  value={formik.values.gstNumber}
                  onChange={formik.handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#ffffff',
                      '& fieldset': { borderColor: '#e5e7eb' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  id="cinNumber"
                  name="cinNumber"
                  placeholder="CIN Number ( Optional )"
                  variant="outlined"
                  value={formik.values.cinNumber}
                  onChange={formik.handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#ffffff',
                      '& fieldset': { borderColor: '#e5e7eb' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#1e6b52' }
                    }
                  }}
                />
              </Box>

              {/* Finish Button */}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                  bgcolor: '#1e6b52',
                  color: 'white',
                  py: 1.6,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  mt: 1,
                  '&:hover': { bgcolor: '#154d3b', boxShadow: 'none' }
                }}
              >
                {isLoading ? 'Creating Organisation...' : 'Finish'}
              </Button>

              {/* Skip Link */}
              <Box sx={{ textAlign: 'center', pt: 0.5 }}>
                <Typography
                  component="button"
                  type="button"
                  onClick={() => handleCompleteRegistration()}
                  disabled={isLoading}
                  sx={{
                    color: '#111827',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    fontSize: '0.95rem',
                    bgcolor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: '#1e6b52' }
                  }}
                >
                  Skip
                </Typography>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>

      {/* Single Sign-On (SSO) & OAuth Setup Guidance Dialog */}
      <Dialog
        open={showSsoConfigDialog}
        onClose={() => setShowSsoConfigDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockPersonOutlinedIcon sx={{ color: '#1e6b52' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem' }}>
              OAuth Single Sign-On (SSO) Setup
            </Typography>
          </Box>
          <IconButton onClick={() => setShowSsoConfigDialog(false)} size="small" aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: '#4b5563', mb: 2 }}>
            To sign up using OAuth SSO (Google, LinkedIn, Facebook, Instagram), please configure your OAuth credentials in <code>.env.local</code>.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
