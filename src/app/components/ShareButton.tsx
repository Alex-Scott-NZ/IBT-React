"use client";
import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton, Typography, Button
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
    handleShareClose();
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
    window.location.href = mailtoLink;
    handleShareClose();
  };

  return (
    <div className="flex justify-end">
      <Button
        onClick={handleShareClick}
        startIcon={<ShareIcon />}
        sx={{
          border: '1px solid #B00909',
          color: '#B00909',
          backgroundColor: '#EAEAE2',
          borderRadius: '9999px', // This makes it very rounded
          '&:hover': {
            backgroundColor: '#B00909',
            color: '#EAEAE2',
            border: '1px solid #B00909',
          },
          textTransform: 'none',
          padding: '6px 16px',
        }}
      >
        Share
      </Button>
      
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
    </div>
  );
};

export default ShareButton;
