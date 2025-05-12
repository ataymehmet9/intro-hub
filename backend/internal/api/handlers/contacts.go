package handlers

import (
	"net/http"
	"strconv"

	"github.com/ataymehmet9/intro-hub/internal/api/middleware"
	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/services"
	"github.com/ataymehmet9/intro-hub/internal/utils"
	"github.com/gin-gonic/gin"
)

// ContactHandler handles contact-related API endpoints
type ContactHandler struct {
	contactService *services.ContactService
	userService    *services.UserService
}

// NewContactHandler creates a new ContactHandler
func NewContactHandler(contactService *services.ContactService, userService *services.UserService) *ContactHandler {
	return &ContactHandler{
		contactService: contactService,
		userService:    userService,
	}
}

// ListContacts godoc
// @Summary List contacts
// @Description Get all contacts for the current user
// @Tags contacts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param query query string false "Search query"
// @Success 200 {array} models.ContactResponse "Contacts retrieved successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /contacts [get]
func (h *ContactHandler) ListContacts(c *gin.Context) {
	userID := middleware.GetUserID(c)
	query := c.Query("query")

	var contacts []*models.Contact
	var err error

	// If search query is provided, search contacts
	if query != "" {
		contacts, err = h.contactService.SearchContacts(c.Request.Context(), userID, query)
	} else {
		contacts, err = h.contactService.GetAllContacts(c.Request.Context(), userID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get user info for response
	user, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Transform contacts to responses
	responses := make([]models.ContactResponse, len(contacts))
	for i, contact := range contacts {
		responses[i] = contact.ToResponse(user)
	}

	c.JSON(http.StatusOK, responses)
}

// GetContact godoc
// @Summary Get a contact
// @Description Get a specific contact by ID
// @Tags contacts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Contact ID"
// @Success 200 {object} models.ContactResponse "Contact retrieved successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 404 {object} map[string]string "Contact not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /contacts/{id} [get]
func (h *ContactHandler) GetContact(c *gin.Context) {
	userID := middleware.GetUserID(c)

	// Parse contact ID
	contactID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contact ID"})
		return
	}

	// Get contact
	contact, err := h.contactService.GetContact(c.Request.Context(), uint(contactID), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Get user info for response
	user, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return contact data
	c.JSON(http.StatusOK, contact.ToResponse(user))
}

// CreateContact godoc
// @Summary Create a contact
// @Description Create a new contact for the current user
// @Tags contacts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.ContactCreateRequest true "Contact creation data"
// @Success 201 {object} models.ContactResponse "Contact created successfully"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /contacts [post]
func (h *ContactHandler) CreateContact(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var req models.ContactCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create contact
	contact, err := h.contactService.CreateContact(c.Request.Context(), req, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user info for response
	user, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return created contact
	c.JSON(http.StatusCreated, contact.ToResponse(user))
}

// UpdateContact godoc
// @Summary Update a contact
// @Description Update an existing contact
// @Tags contacts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Contact ID"
// @Param request body models.ContactUpdateRequest true "Contact update data"
// @Success 200 {object} models.ContactResponse "Contact updated successfully"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 404 {object} map[string]string "Contact not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /contacts/{id} [put]
func (h *ContactHandler) UpdateContact(c *gin.Context) {
	userID := middleware.GetUserID(c)

	// Parse contact ID
	contactID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contact ID"})
		return
	}

	var req models.ContactUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update contact
	contact, err := h.contactService.UpdateContact(c.Request.Context(), uint(contactID), userID, req)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "contact not found" {
			status = http.StatusNotFound
		} else if err.Error() == "email already exists for one of your contacts" {
			status = http.StatusBadRequest
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	// Get user info for response
	user, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return updated contact
	c.JSON(http.StatusOK, contact.ToResponse(user))
}

// DeleteContact godoc
// @Summary Delete a contact
// @Description Delete an existing contact
// @Tags contacts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Contact ID"
// @Success 204 "Contact deleted successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 404 {object} map[string]string "Contact not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /contacts/{id} [delete]
func (h *ContactHandler) DeleteContact(c *gin.Context) {
	userID := middleware.GetUserID(c)

	// Parse contact ID
	contactID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid contact ID"})
		return
	}

	// Delete contact
	err = h.contactService.DeleteContact(c.Request.Context(), uint(contactID), userID)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "contact not found" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	// Return success with no content
	c.Status(http.StatusNoContent)
}

// BatchImportContacts godoc
// @Summary Batch import contacts
// @Description Import multiple contacts at once
// @Tags contacts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.ContactBatchImportRequest true "Batch import data"
// @Success 200 {object} models.BatchImportResponse "Contacts imported successfully"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /contacts/batch-import [post]
func (h *ContactHandler) BatchImportContacts(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var req models.ContactBatchImportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Import contacts
	result, err := h.contactService.BatchImportContacts(c.Request.Context(), req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return result
	c.JSON(http.StatusOK, result)
}
