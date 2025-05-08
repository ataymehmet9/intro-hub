import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useContacts } from "../hooks/useContacts";
import ContactCard from "../components/contacts/ContactCard";
import ContactForm from "../components/contacts/ContactForm";
import FileUploadButton from "../components/common/FileUploadButton";

const Contacts = () => {
  const { contacts, isLoading, error, fetchContacts, uploadContacts } =
    useContacts();

  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [filterCompany, setFilterCompany] = useState("");

  // Get unique companies for filter menu
  const companies = [...new Set(contacts.map((contact) => contact.company))]
    .filter(Boolean)
    .sort();

  // Handle initial data load
  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...contacts];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((contact) => {
        return (
          contact.full_name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          (contact.company && contact.company.toLowerCase().includes(term)) ||
          (contact.job_title && contact.job_title.toLowerCase().includes(term))
        );
      });
    }

    // Apply company filter
    if (filterCompany) {
      result = result.filter((contact) => contact.company === filterCompany);
    }

    // Apply sorting
    switch (sortOrder) {
      case "name_asc":
        result.sort((a, b) => a.full_name.localeCompare(b.full_name));
        break;
      case "name_desc":
        result.sort((a, b) => b.full_name.localeCompare(a.full_name));
        break;
      case "company_asc":
        result.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
        break;
      case "company_desc":
        result.sort((a, b) => (b.company || "").localeCompare(a.company || ""));
        break;
      case "recent":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setFilteredContacts(result);
  }, [contacts, searchTerm, sortOrder, filterCompany]);

  const handleAddContactOpen = () => {
    setEditContact(null);
    setOpenAddContact(true);
  };

  const handleEditContactOpen = (contact) => {
    setEditContact(contact);
    setOpenAddContact(true);
  };

  const handleContactDialogClose = () => {
    setOpenAddContact(false);
    setEditContact(null);
  };

  const handleUploadDialogOpen = () => {
    setOpenUploadDialog(true);
  };

  const handleUploadDialogClose = () => {
    setOpenUploadDialog(false);
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      await uploadContacts(file);
      handleUploadDialogClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    handleSortMenuClose();
  };

  const handleFilterChange = (company) => {
    setFilterCompany(company);
    handleFilterMenuClose();
  };

  const clearFilter = () => {
    setFilterCompany("");
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Typography variant="h4" sx={{ mb: { xs: 2, md: 0 } }}>
          My Contacts
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadDialogOpen}
          >
            Import
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddContactOpen}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* Search and filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
                variant="outlined"
                size="small"
              >
                Sort
              </Button>
              <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={handleSortMenuClose}
              >
                <MenuItem
                  selected={sortOrder === "name_asc"}
                  onClick={() => handleSortChange("name_asc")}
                >
                  Name (A-Z)
                </MenuItem>
                <MenuItem
                  selected={sortOrder === "name_desc"}
                  onClick={() => handleSortChange("name_desc")}
                >
                  Name (Z-A)
                </MenuItem>
                <MenuItem
                  selected={sortOrder === "company_asc"}
                  onClick={() => handleSortChange("company_asc")}
                >
                  Company (A-Z)
                </MenuItem>
                <MenuItem
                  selected={sortOrder === "company_desc"}
                  onClick={() => handleSortChange("company_desc")}
                >
                  Company (Z-A)
                </MenuItem>
                <MenuItem
                  selected={sortOrder === "recent"}
                  onClick={() => handleSortChange("recent")}
                >
                  Recently Added
                </MenuItem>
              </Menu>

              <Button
                startIcon={<FilterListIcon />}
                onClick={handleFilterMenuOpen}
                variant="outlined"
                size="small"
                color={filterCompany ? "secondary" : "primary"}
              >
                Filter
              </Button>
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleFilterMenuClose}
              >
                <MenuItem onClick={() => handleFilterChange("")}>
                  All Companies
                </MenuItem>
                <Divider />
                {companies.map((company) => (
                  <MenuItem
                    key={company}
                    selected={filterCompany === company}
                    onClick={() => handleFilterChange(company)}
                  >
                    {company}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Grid>
        </Grid>

        {filterCompany && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Filtered by:
            </Typography>
            <Chip
              label={`Company: ${filterCompany}`}
              onDelete={clearFilter}
              size="small"
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
          <Button onClick={fetchContacts} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Paper>
      ) : filteredContacts.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          {searchTerm || filterCompany ? (
            <>
              <Typography variant="h6" gutterBottom>
                No contacts found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search or filters
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                You don't have any contacts yet
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Add contacts to start building your network
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddContactOpen}
              >
                Add Contact
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredContacts.map((contact) => (
            <Grid item xs={12} sm={6} md={4} key={contact.id}>
              <ContactCard contact={contact} onEdit={handleEditContactOpen} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Contact Dialog */}
      <ContactForm
        open={openAddContact}
        onClose={handleContactDialogClose}
        contact={editContact}
      />

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleUploadDialogClose}>
        <DialogTitle>Import Contacts</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload a CSV or Excel file with your contacts. The file should
            include the following columns: first_name, last_name, email, phone
            (optional), company (optional), job_title (optional), relationship
            (optional), notes (optional).
          </DialogContentText>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <FileUploadButton
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onFileSelect={handleFileUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <CloudUploadIcon sx={{ mr: 1 }} /> Select File
                </>
              )}
            </FileUploadButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contacts;
