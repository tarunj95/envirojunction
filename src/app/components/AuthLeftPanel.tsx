"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Box, Typography, Stack } from '@mui/material';
import { BusinessCenter, Business } from '@mui/icons-material';
import useEmblaCarousel from 'embla-carousel-react';

export const slides = [
  {
    image: "/news.jpg",
    title: "Stay Informed on Critical Climate Insights",
    description: "Get real-time updates on environmental news, conservation efforts, global warming reports, and national policy changes."
  },
  {
    image: "/opportunity.jpg",
    title: "Empower Your Career in Sustainability",
    description: "Connect with top-tier organizations and explore thousands of expert vacancies and opportunities in the environmental sector."
  },
  {
    image: "/services.jpg",
    title: "Discover Environmental Services & Solutions",
    description: "Explore comprehensive services, consultancy, and technical solutions tailored for sustainable development and impact."
  },
  {
    image: "/tenders.jpg",
    title: "Global Environmental Tenders at Your Fingertips",
    description: "Access a curated database of high-impact green projects and bidding opportunities across Pan India."
  }
];

export default function AuthLeftPanel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

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
        <Link href="/" style={{ marginBottom: '24px' }}>
          <img src="/Enviro%20Logo%20Green%20option.svg" alt="EnviroJunction" style={{ height: '44px', width: 'auto' }} />
        </Link>
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

      {/* Left Section - Carousel & Background Images */}
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
          bgcolor: '#0d6648' // Fallback color
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: selectedIndex === index ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: 0
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, rgba(13, 102, 72, 1) 0%, rgba(255, 255, 255, 0) 45%)',
                zIndex: 1
              }}
            />
          </Box>
        ))}

        {/* Content Layer */}
        <Box sx={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ mb: 8 }}>
              <Link href="/" className="flex items-center gap-2 mr-8">
                <img src="/Enviro Logo Green option ( Horizontal ) (1).svg" alt="EnviroJunction Logo" className="h-[1.5rem] w-auto" />
              </Link>
            </Box>

            {/* Carousel Container */}
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
                        color: '#0d6648',
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
                        color: '#0d6648',
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
          </Box>

          <Box>
            {/* Stats Stack */}
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
    </>
  );
}
