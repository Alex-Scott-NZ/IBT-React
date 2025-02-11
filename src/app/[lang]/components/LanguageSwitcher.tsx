// /app/[lang]/components/LanguageSwitcher.tsx
'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';
import { SxProps, Theme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check'

interface LanguageSwitcherProps {
  currentLang: string;
  sx?: SxProps<Theme>;
  isMobile?: boolean;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' }
] as const;

const LanguageSwitcher = ({ currentLang, sx, isMobile = false }: LanguageSwitcherProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];

  return (
    <div style={{ width: isMobile ? '100%' : 'auto' }}>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        size="small"
        sx={{
          color: 'text.primary',
          textTransform: 'none',
          fontSize: isMobile ? '0.813rem' : '0.875rem',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'flex-start' : 'center',
          py: isMobile ? 1.5 : 1,
          px: isMobile ? 2 : 1,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          ...sx
        }}
      >
        {currentLanguage.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock={true}
        sx={{
          ...(isMobile && {
            '& .MuiMenu-paper': {
              width: '240px', // Match drawer width
              left: '0px !important',
              maxWidth: '100%',
            },
            '& .MuiList-root': {
              padding: 0,
            }
          })
        }}
        MenuListProps={{
          sx: {
            ...(isMobile && {
              padding: 0,
            })
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'left' : 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'left' : 'center',
        }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem
          key={language.code}
          component={Link}
          href={`/${language.code}`}
          onClick={handleClose}
          selected={currentLang === language.code}
          sx={{
            justifyContent: 'space-between', // Changed to space-between for icon placement
            py: isMobile ? 1.5 : 1,
            width: '100%',
            fontSize: isMobile ? '0.813rem' : '0.875rem', // Matching button text size
            backgroundColor: currentLang === language.code ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            '&:hover': {
              backgroundColor: currentLang === language.code 
                ? 'rgba(0, 0, 0, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {language.label}
          {currentLang === language.code && (
            <CheckIcon 
              sx={{ 
                ml: 1, 
                fontSize: isMobile ? '0.875rem' : '1rem'
              }} 
            />
          )}
        </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;