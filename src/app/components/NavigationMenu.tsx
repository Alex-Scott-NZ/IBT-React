"use client";

import React, { useState, useRef } from 'react';
import { Menu, MenuItem, Box, Divider, Button } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Link from 'next/link'; 
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/system';

// Custom styled component to apply pointer-events
const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    pointerEvents: 'auto',
  },
});

const NavigationMenu: React.FC = () => {
  let timeoutId: NodeJS.Timeout | null = null;
  const [anchorElJournal, setAnchorElJournal] = useState<null | HTMLElement>(null);
  const [anchorElCollection, setAnchorElCollection] = useState<null | HTMLElement>(null);

  const handleOpen = (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => {
    timeoutId = setTimeout(() => {
      setAnchorEl(null);
    }, 50);
  };

  const handleMenuEnter = () => {
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const linkStyle = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    letterSpacing: '0.03em',
    textTransform: 'none', 
    padding: 0,   
    lineHeight: '1.5rem',
  };

  const separatorProps = {
    orientation: 'vertical' as const,
    flexItem: true,
    sx: {
      mx: 2,
      borderRightWidth: 2,
    },
    className: 'border-communist-red',
  };

  const menuProps = {
    anchorOrigin: {
      vertical: 'bottom' as const,
      horizontal: 'left' as const,
    },
    transformOrigin: {
      vertical: 'top' as const,
      horizontal: 'left' as const,
    },
    sx: {
      '& .MuiPaper-root': {
        minWidth: '250px',
        pointerEvents: 'auto', // Ensures you can interact with the menu
      },
    },
  };

  return (
    <nav className="bg-custom-bg p-4">
      <Box display="flex" alignItems="center" className="font-cambay">
        <Link href="/" passHref>
          <Button className="text-communist-red font-cambay" sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1, textTransform: 'none' }}>
            home
          </Button>
        </Link>

        <Divider {...separatorProps} />

        <Button
         className="text-communist-red font-cambay" sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1 }}
          onMouseEnter={handleOpen(setAnchorElJournal)}
          onMouseLeave={handleClose(setAnchorElJournal)}
        >
          1917 journal
          <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0 }} />
        </Button>
        <StyledMenu
          anchorEl={anchorElJournal}
          open={Boolean(anchorElJournal)}
          onClose={handleClose(setAnchorElJournal)}
          {...menuProps}
          MenuListProps={{
            onMouseEnter: handleMenuEnter,
            onMouseLeave: handleClose(setAnchorElJournal),
          }}
        >
          <MenuItem onClick={handleClose(setAnchorElJournal)}>Issue 1</MenuItem>
          <MenuItem onClick={handleClose(setAnchorElJournal)}>Issue 2</MenuItem>
        </StyledMenu>

        <Divider {...separatorProps} />

        <Link href="/books" passHref>
          <Button className="text-communist-red font-cambay" sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1 }}>
            books
          </Button>
        </Link>

        <Divider {...separatorProps} />

        <Button
        className="text-communist-red font-cambay"
          sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1 }}
          onMouseEnter={handleOpen(setAnchorElCollection)}
          onMouseLeave={handleClose(setAnchorElCollection)}
        >
          collection
          <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0 }} />
        </Button>
        <StyledMenu
          anchorEl={anchorElCollection}
          open={Boolean(anchorElCollection)}
          onClose={handleClose(setAnchorElCollection)}
          {...menuProps}
          MenuListProps={{
            onMouseEnter: handleMenuEnter,
            onMouseLeave: handleClose(setAnchorElCollection),
          }}
        >
          <MenuItem onClick={handleClose(setAnchorElCollection)}>Item 1</MenuItem>
          <MenuItem onClick={handleClose(setAnchorElCollection)}>Item 2</MenuItem>
        </StyledMenu>

        <Divider {...separatorProps} />

        <Link href="/marxist-archives" passHref>
          <Button className="text-communist-red font-cambay" sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1 }}>
            marxist archives
          </Button>
        </Link>

        <Divider {...separatorProps} />

        <Link href="/about" passHref>
          <Button className="text-communist-red font-cambay" sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1 }}>
            about
          </Button>
        </Link>

        <Divider {...separatorProps} />

        <Link href="/donate" passHref>
          <Button className="text-communist-red font-cambay" sx={{ ...linkStyle, zIndex: (theme) => theme.zIndex.modal + 1 }}>
            donate
          </Button>
        </Link>

        <Box
          ml="auto"
          display="flex"
          alignItems="center"
          sx={{ gap: 2, height: '100%' }}
        >
          <Link href="https://www.facebook.com/Bolsheviks" passHref target="_blank">
            <FacebookIcon
              className="text-communist-red hover:text-communist-red"
              sx={{ fontSize: 32, display: 'block', margin: 'auto' }}
            />
          </Link>
          <Link href="https://www.youtube.com/user/ibt1917" passHref target="_blank">
            <YouTubeIcon
              className="text-communist-red hover:text-communist-red"
              sx={{ fontSize: 32, display: 'block', margin: 'auto' }}
            />
          </Link>
          <Link href="https://www.twitter.com/IBT1917" passHref target="_blank">
            <TwitterIcon
              className="text-communist-red hover:text-communist-red"
              sx={{ fontSize: 32, display: 'block', margin: 'auto' }}
            />
          </Link>
          <Link href="mailto:ibt@bolshevik.org" passHref>
            <EmailIcon
              className="text-communist-red hover:text-communist-red"
              sx={{ fontSize: 32, display: 'block', margin: 'auto' }}
            />
          </Link>
        </Box>
      </Box>
    </nav>
  );
};

export default NavigationMenu;
