'use client';
import { useState, useCallback, useMemo } from 'react';
import useSWR from 'swr';
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

// Constants
const SOCIAL_LINKS = [
  { Icon: FacebookIcon, href: 'https://www.facebook.com/Bolsheviks' },
  { Icon: YouTubeIcon, href: 'https://www.youtube.com/user/ibt1917' },
  { Icon: TwitterIcon, href: 'https://www.twitter.com/IBT1917' },
  { Icon: EmailIcon, href: 'mailto:ibt@bolshevik.org' },
] as const;

const COLLECTION_ITEMS = [
  { label: 'Item 1', href: '#' },
  { label: 'Item 2', href: '#' },
] as const;

// Fetcher for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch journal issues');
  const data = await response.json();
  return Array.isArray(data) 
    ? data.sort((a, b) => b.slug.localeCompare(a.slug))
    : [];
};

const NavigationMenu = () => {
  // State management
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElJournal, setAnchorElJournal] = useState<null | HTMLElement>(null);
  const [anchorElCollection, setAnchorElCollection] = useState<null | HTMLElement>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  // SWR for data fetching
  const { data: journalIssues = [], error, isLoading } = useSWR<JournalIssueNode[]>(
    '/api/journal-issues',
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000,
      dedupingInterval: 60000, // Add this to prevent duplicate requests
    }
  );

  // Memoized handlers
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleMenuOpen = useCallback(
    (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      },
    []
  );

  const handleMenuClose = useCallback(
    (setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
      () => {
        setAnchorEl(null);
      },
    []
  );

  const handleNestedListToggle = useCallback(
    (setState: React.Dispatch<React.SetStateAction<boolean>>) =>
      (event: React.MouseEvent) => {
        event.stopPropagation();
        setState(prev => !prev);
      },
    []
  );

  // Memoized drawer content
  const drawer = useMemo(() => (
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
            {isLoading ? (
              <ListItemButton disabled sx={{ pl: 6 }}>
                <ListItemText primary="Loading..." />
              </ListItemButton>
            ) : (
              journalIssues.map((issue) => (
                <ListItemButton
                  key={issue.slug}
                  component={Link}
                  href={`/journal/${issue.slug}`}
                  sx={{ pl: 6 }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemText primary={issue.title} />
                </ListItemButton>
              ))
            )}
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
            {COLLECTION_ITEMS.map(({ label, href }) => (
              <ListItemButton
                key={label}
                component={Link}
                href={href}
                sx={{ pl: 4 }}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
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
  ), [journalIssues, journalOpen, collectionOpen, isLoading, handleDrawerToggle, handleNestedListToggle]);
  

  // Memoized social icons
  const socialIcons = useMemo(() => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1',
        '& .MuiIconButton-root': { fontSize: '2rem' },
      }}
    >
      {SOCIAL_LINKS.map(({ Icon, href }, index) => (
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
  ), []);

  // Error handling
  if (error) {
    console.error('Failed to load journal issues:', error);
  }

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
                disableScrollLock={true}
              >
                <MenuItem
                  onClick={handleMenuClose(setAnchorElJournal)}
                  component={Link}
                  href="/journal"
                >
                  journal home
                </MenuItem>
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  journalIssues.map((issue) => (
                    <MenuItem
                      key={issue.slug}
                      onClick={handleMenuClose(setAnchorElJournal)}
                      component={Link}
                      href={`/journal/${issue.slug}`}
                      sx={{ pl: 6 }}
                    >
                      {issue.title}
                    </MenuItem>
                  ))
                )}
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
                disableScrollLock={true}
              >
                {COLLECTION_ITEMS.map(({ label, href }) => (
                  <MenuItem
                    key={label}
                    onClick={handleMenuClose(setAnchorElCollection)}
                    component={Link}
                    href={href}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
              <Button component={Link} href="/about">
                about
              </Button>
              <Button component={Link} href="/donate">
                donate
              </Button>
            </ButtonGroup>
          </Box>
          {socialIcons}
        </Toolbar>
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
