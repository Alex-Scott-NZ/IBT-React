'use client';
import React, { useState, useRef } from 'react';
import { Menu, MenuItem, Link, Box, Divider } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const NavigationMenu: React.FC = () => {
    const [anchorElJournal, setAnchorElJournal] = useState<null | HTMLElement>(null);
    const [anchorElCollection, setAnchorElCollection] = useState<null | HTMLElement>(null);
    const journalRef = useRef<HTMLDivElement>(null);
    const collectionRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>, ref: React.RefObject<HTMLDivElement>) => () => {
      if (ref.current) {
        setAnchorEl(ref.current);
      }
    };

    const handleMouseLeave = (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () => {
      setAnchorEl(null);
    };

    const linkStyle = {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      letterSpacing: '0.03em',
    };

    const separatorProps = {
      orientation: "vertical" as const,
      flexItem: true,
      sx: { 
        mx: 2, 
        borderRightWidth: 2 
      },
      className: "border-communist-red"
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
        }
      },
    };

    return (
      <nav className="bg-custom-bg p-4">
        <Box display="flex" alignItems="center" className="font-cambay">
          {/* Home Link */}
          <Box display="flex" alignItems="center">
            <Link
              href="/home"
              underline="none"
              className="text-communist-red hover:text-communist-red"
              sx={linkStyle}
            >
              home
            </Link>
          </Box>

          <Divider {...separatorProps} />

          {/* Journal Dropdown */}
          <Box
            ref={journalRef}
            onMouseLeave={handleMouseLeave(setAnchorElJournal)}
          >
            <Link
              href="#"
              underline="none"
              className="text-communist-red hover:text-communist-red flex items-center"
              sx={linkStyle}
              onMouseEnter={handleMouseEnter(setAnchorElJournal, journalRef)}
            >
              1917 journal
              <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0 }} />
            </Link>
            <Menu
              anchorEl={anchorElJournal}
              open={Boolean(anchorElJournal)}
              onClose={handleMouseLeave(setAnchorElJournal)}
              {...menuProps}
              MenuListProps={{
                onMouseEnter: handleMouseEnter(setAnchorElJournal, journalRef),
                onMouseLeave: handleMouseLeave(setAnchorElJournal)
              }}
            >
              <MenuItem onClick={handleMouseLeave(setAnchorElJournal)}>Issue 1</MenuItem>
              <MenuItem onClick={handleMouseLeave(setAnchorElJournal)}>Issue 2</MenuItem>
            </Menu>
          </Box>

          <Divider {...separatorProps} />

          {/* Books Link */}
          <Box display="flex" alignItems="center">
            <Link
              href="/books"
              underline="none"
              className="text-communist-red hover:text-communist-red"
              sx={linkStyle}
            >
              books
            </Link>
          </Box>

          <Divider {...separatorProps} />

          {/* Collection Dropdown */}
          <Box
            ref={collectionRef}
            onMouseLeave={handleMouseLeave(setAnchorElCollection)}
          >
            <Link
              href="#"
              underline="none"
              className="text-communist-red hover:text-communist-red flex items-center"
              sx={linkStyle}
              onMouseEnter={handleMouseEnter(setAnchorElCollection, collectionRef)}
            >
              collection
              <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0 }} />
            </Link>
            <Menu
              anchorEl={anchorElCollection}
              open={Boolean(anchorElCollection)}
              onClose={handleMouseLeave(setAnchorElCollection)}
              {...menuProps}
              MenuListProps={{
                onMouseEnter: handleMouseEnter(setAnchorElCollection, collectionRef),
                onMouseLeave: handleMouseLeave(setAnchorElCollection)
              }}
            >
              <MenuItem onClick={handleMouseLeave(setAnchorElCollection)}>Item 1</MenuItem>
              <MenuItem onClick={handleMouseLeave(setAnchorElCollection)}>Item 2</MenuItem>
            </Menu>
          </Box>

          <Divider {...separatorProps} />

          {/* Marxist Archives Link */}
          <Box display="flex" alignItems="center">
            <Link
              href="/marxist-archives"
              underline="none"
              className="text-communist-red hover:text-communist-red"
              sx={linkStyle}
            >
              marxist archives
            </Link>
          </Box>

          <Divider {...separatorProps} />

          {/* About Link */}
          <Box display="flex" alignItems="center">
            <Link
              href="/about"
              underline="none"
              className="text-communist-red hover:text-communist-red"
              sx={linkStyle}
            >
              about
            </Link>
          </Box>

          <Divider {...separatorProps} />

          {/* Donate Link */}
          <Box display="flex" alignItems="center">
            <Link
              href="/donate"
              underline="none"
              className="text-communist-red hover:text-communist-red"
              sx={linkStyle}
            >
              donate
            </Link>
          </Box>
        </Box>
      </nav>
    );
};

export default NavigationMenu;