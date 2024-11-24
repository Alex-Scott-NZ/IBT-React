"use client";
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const ShareButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = () => {
    handleShareClose(); // Close the menu first
    window.print();
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
    handleShareClose();
  };

  const handleShareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
    handleShareClose();
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent('Check out this page');
    const body = encodeURIComponent(
      `I thought you might find this interesting:\n\n${window.location.href}`
    );

    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink; // Opens the user's email client
    handleShareClose();
  };

  return (
    <>
      <Tooltip title="Share">
        <IconButton color="inherit" onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleShareClose}
      >
        <MenuItem onClick={handlePrint}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Print" />
        </MenuItem>

        <MenuItem onClick={handleShareToTwitter}>
          <ListItemIcon>
            <TwitterIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Twitter" />
        </MenuItem>

        <MenuItem onClick={handleShareToFacebook}>
          <ListItemIcon>
            <FacebookIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Facebook" />
        </MenuItem>

        <MenuItem onClick={handleShareViaEmail}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Email" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ShareButton;
