'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  ButtonGroup,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme'; // Import your reusable theme
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import { JournalIssueNode } from '../types/Article';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

export const revalidate = 60;

const NavigationMenu: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElJournal, setAnchorElJournal] = useState<null | HTMLElement>(null);
  const [anchorElCollection, setAnchorElCollection] = useState<null | HTMLElement>(null);
  const [journalIssues, setJournalIssues] = useState<JournalIssueNode[]>([]);
  const [journalOpen, setJournalOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  useEffect(() => {
    const fetchJournalIssues = async () => {
      try {
        const response = await fetch('/api/journal-issues');
        if (!response.ok) throw new Error('Failed to fetch journal issues');
        const data: JournalIssueNode[] = await response.json();
        if (Array.isArray(data)) {
          const sortedIssues = data.sort((a, b) =>
            b.slug.localeCompare(a.slug)
          );
          setJournalIssues(sortedIssues);
        } else {
          console.error('Unexpected data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching journal issues:', error);
      }
    };

    fetchJournalIssues();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen =
    (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };

  const handleMenuClose =
    (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
      () => {
        setAnchorEl(null);
      };

  const handleNestedListToggle =
    (setState: React.Dispatch<React.SetStateAction<boolean>>) =>
      (event: React.MouseEvent) => {
        event.stopPropagation();
        setState((prev) => !prev);
      };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <List>
        <ListItemButton component={Link} href="/" onClick={handleDrawerToggle}>
          <ListItemText primary="home" />
        </ListItemButton>

        <ListItemButton onClick={handleNestedListToggle(setJournalOpen)}>
          <ListItemText primary="1917 journal" />
          {journalOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={journalOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              href="/journal"
              sx={{ pl: 4 }}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="journal home" />
            </ListItemButton>
            {journalIssues.map((issue) => (
              <ListItemButton
                key={issue.slug}
                component={Link}
                href={`/journal/${issue.slug}`}
                sx={{ pl: 6 }}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={issue.title} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItemButton
          component={Link}
          href="/book"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="books" />
        </ListItemButton>

        <ListItemButton onClick={handleNestedListToggle(setCollectionOpen)}>
          <ListItemText primary="collection" />
          {collectionOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={collectionOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemText primary="Item 1" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleDrawerToggle}>
              <ListItemText primary="Item 2" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          component={Link}
          href="/marxist-archives"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="marxist archives" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/about"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="about" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/donate"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="donate" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default" component="nav">
        <Toolbar
          sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
          className="-ml-2 mt-4"
          disableGutters
          variant="dense"
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            // edge="start"
            size="large"
            className="p-1"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: 'none' },
              fontSize: 'large',
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              alignItems: 'center',
            }}
          >
            <ButtonGroup variant="text" aria-label="text button group">
              <Button component={Link} href="/">
                home
              </Button>
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  handleMenuOpen(setAnchorElJournal)(
                    event as React.MouseEvent<HTMLButtonElement>
                  );
                }}
                endIcon={<KeyboardArrowDownIcon />}
              >
                1917 journal
              </Button>
              <Menu
                anchorEl={anchorElJournal}
                open={Boolean(anchorElJournal)}
                onClose={handleMenuClose(setAnchorElJournal)}
              >
                <MenuItem
                  onClick={handleMenuClose(setAnchorElJournal)}
                  component={Link}
                  href="/journal"
                >
                  journal home
                </MenuItem>
                {journalIssues.map((issue) => (
                  <MenuItem
                    key={issue.slug}
                    onClick={handleMenuClose(setAnchorElJournal)}
                    component={Link}
                    href={`/journal/${issue.slug}`}
                    sx={{ pl: 6 }} // Add padding here
                  >
                    {issue.title}
                  </MenuItem>
                ))}
              </Menu>

              <Button component={Link} href="/book">
                books
              </Button>
              <Button component={Link} href="/marxist-archives">
                marxist archives
              </Button>
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  handleMenuOpen(setAnchorElCollection)(
                    event as React.MouseEvent<HTMLButtonElement>
                  );
                }}
                endIcon={<KeyboardArrowDownIcon />}
              >
                collection
              </Button>
              <Menu
                anchorEl={anchorElCollection}
                open={Boolean(anchorElCollection)}
                onClose={handleMenuClose(setAnchorElCollection)}
              >
                <MenuItem onClick={handleMenuClose(setAnchorElCollection)}>
                  Item 1
                </MenuItem>
                <MenuItem onClick={handleMenuClose(setAnchorElCollection)}>
                  Item 2
                </MenuItem>
              </Menu>
              <Button component={Link} href="/about">
                about
              </Button>
              <Button component={Link} href="/donate">
                donate
              </Button>
            </ButtonGroup>
          </Box>
          {/* Social media icons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1',
              '& .MuiIconButton-root': {
                fontSize: '2rem',
              },
            }}
          >
            {[
              {
                Icon: FacebookIcon,
                href: 'https://www.facebook.com/Bolsheviks',
              },
              {
                Icon: YouTubeIcon,
                href: 'https://www.youtube.com/user/ibt1917',
              },
              { Icon: TwitterIcon, href: 'https://www.twitter.com/IBT1917' },
              { Icon: EmailIcon, href: 'mailto:ibt@bolshevik.org' },
            ].map(({ Icon, href }, index) => (
              <IconButton
                key={index}
                color="inherit"
                component={Link}
                href={href}
                target="_blank"
              >
                <Icon fontSize="inherit" />
              </IconButton>
            ))}
          </Box>
        </Toolbar>
        {/* Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavigationMenu;
