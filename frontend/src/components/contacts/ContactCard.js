import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { useContacts } from '../../hooks/useContacts';

const ContactCard = ({ contact, onEdit }) => {
  const { removeContact } = useContacts();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    onEdit(contact);
  };

  const handleDeleteClick = async () => {
    handleMenuClose();
    setIsDeleting(true);
    
    try {
      await removeContact(contact.id);
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate avatar color based on contact name
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: stringToColor(contact.full_name),
                mr: 2,
              }}
            >
              {contact.first_name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {contact.full_name}
              </Typography>
              {contact.job_title && (
                <Typography variant="body2" color="text.secondary">
                  {contact.job_title}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton
            aria-label="contact menu"
            onClick={handleMenuOpen}
            disabled={isDeleting}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`contact-menu-${contact.id}`}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleEditClick}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="inherit" color="error">
                Delete
              </Typography>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ mb: 2 }}>
          {contact.company && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{contact.company}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{contact.email}</Typography>
          </Box>
          {contact.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{contact.phone}</Typography>
            </Box>
          )}
          {contact.linkedin_profile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkedInIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" component="a" href={contact.linkedin_profile} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                LinkedIn Profile
              </Typography>
            </Box>
          )}
        </Box>

        {contact.relationship && (
          <Chip
            label={contact.relationship}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Added: {new Date(contact.created_at).toLocaleDateString()}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ContactCard;
