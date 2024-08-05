"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Sidebar from './Sidebar';
import { pink } from '@mui/material/colors';
import Link from 'next/link'
import { Avatar, Button, Slide, Snackbar, useScrollTrigger } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { useContextProvider } from '../context/ContextProvider';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}


function Header(props: Props) {
  const { showSnackbar, snackbarMessage, setShowSnackbar } = useContextProvider()
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    setIsInstalled(isAppInstalled());
    console.log('isInstalled : '+ isInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleSnackbarClose = () => {
    setShowSnackbar(false)
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const isAppInstalled = (): boolean => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIosStandalone = (window.navigator as any).standalone;
    return isStandalone || isIosStandalone || document.referrer.startsWith('android-app://');
  };

  function HideOnScroll(props: Props) {
    const { children, window } = props;
  
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }
  

  return (
    <Box>
      <AppBar position="fixed" sx={{ height: 38, zIndex: {md: 2000} }} elevation={0} className='appBar'>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 38, alignItems: 'center' }} className='appToolbar'>
            <Link href="/">
              <Avatar variant="square" sx={{ width: '100%' }} className='logo' alt='Myanmar Books' src='/static/small-logo.png' />
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}></Box>
            {/* {
              !isInstalled && (
                <IconButton color='success' onClick={handleInstallClick} sx={{ textTransform: 'capitalize' }}>
                  <DownloadIcon />
                </IconButton>
              )
            } */}

            <Box sx={{ flexGrow: 0 }}>
              <Link href={`/`}>
                <IconButton color='success'>
                  <Search />
                </IconButton>
              </Link>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, ml: 1 }}
              >
                <MenuIcon sx={{ color: pink[300] }} />
              </IconButton>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Sidebar mobileOpen={mobileOpen} sendSidebarStatus={handleDrawerToggle} />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        key={'center'}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
export default Header;