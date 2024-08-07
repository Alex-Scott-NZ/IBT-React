'use client';

import React, { useState, useRef } from 'react';
import { Menu, MenuItem, Box, Divider } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Link from 'next/link'; // Import Next.js's Link

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
              <Link href="/" passHref>
                  <Box
                      component="span"
                      className="text-communist-red hover:text-communist-red"
                      sx={linkStyle}
                  >
                      home
                  </Box>
              </Link>

              <Divider {...separatorProps} />

              {/* Journal Dropdown */}
              <Box
                  ref={journalRef}
                  onMouseLeave={handleMouseLeave(setAnchorElJournal)}
              >
                  <Link href="#" passHref>
                      <Box
                          component="span"
                          className="text-communist-red hover:text-communist-red flex items-center"
                          sx={linkStyle}
                          onMouseEnter={handleMouseEnter(setAnchorElJournal, journalRef)}
                      >
                          1917 journal
                          <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0 }} />
                      </Box>
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
              <Link href="/books" passHref>
                  <Box
                      component="span"
                      className="text-communist-red hover:text-communist-red"
                      sx={linkStyle}
                  >
                      books
                  </Box>
              </Link>

              <Divider {...separatorProps} />

              {/* Collection Dropdown */}
              <Box
                  ref={collectionRef}
                  onMouseLeave={handleMouseLeave(setAnchorElCollection)}
              >
                  <Link href="#" passHref>
                      <Box
                          component="span"
                          className="text-communist-red hover:text-communist-red flex items-center"
                          sx={linkStyle}
                          onMouseEnter={handleMouseEnter(setAnchorElCollection, collectionRef)}
                      >
                          collection
                          <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0 }} />
                      </Box>
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
              <Link href="/marxist-archives" passHref>
                  <Box
                      component="span"
                      className="text-communist-red hover:text-communist-red"
                      sx={linkStyle}
                  >
                      marxist archives
                  </Box>
              </Link>

              <Divider {...separatorProps} />

              {/* About Link */}
              <Link href="/about" passHref>
                  <Box
                      component="span"
                      className="text-communist-red hover:text-communist-red"
                      sx={linkStyle}
                  >
                      about
                  </Box>
              </Link>

              <Divider {...separatorProps} />

              {/* Donate Link */}
              <Link href="/donate" passHref>
                  <Box
                      component="span"
                      className="text-communist-red hover:text-communist-red"
                      sx={linkStyle}
                  >
                      donate
                  </Box>
              </Link>
          </Box>
      </nav>
  );
};

export default NavigationMenu;
