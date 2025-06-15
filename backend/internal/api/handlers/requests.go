package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/ataymehmet9/intro-hub/internal/api/middleware"
	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/services"
	"github.com/ataymehmet9/intro-hub/internal/utils"
	"github.com/gin-gonic/gin"
)

// RequestHandler handles introduction request API endpoints
type RequestHandler struct {
	requestService *services.RequestService
}

// NewRequestHandler creates a new RequestHandler
func NewRequestHandler(requestService *services.RequestService) *RequestHandler {
	return &RequestHandler{
		requestService: requestService,
	}
}

// ListRequests godoc
// @Summary List requests
// @Description Get all requests for the current user
// @Tags requests
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param type query string false "Request type (sent or received, default: received)"
// @Success 200 {array} models.RequestResponse "Requests retrieved successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /requests [get]
func (h *RequestHandler) ListRequests(c *gin.Context) {
	userID := middleware.GetUserID(c)
	requestType := c.DefaultQuery("type", "received")
	isSent := requestType == "sent"

	// Get requests
	requests, err := h.requestService.GetRequestsByType(c.Request.Context(), userID, isSent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Transform requests to responses
	responses := make([]models.RequestResponse, 0, len(requests))
	for _, request := range requests {
		// Get full request data with related entities
		fullRequest, requester, approver, contact, err := h.requestService.GetRequest(
			c.Request.Context(),
			request.ID,
			userID,
		)
		if err != nil {
			// Skip if there's an error retrieving related data (e.g., deleted user)
			continue
		}

		responses = append(responses, fullRequest.ToResponse(requester, approver, contact))
	}
	fmt.Printf("REQUEST LIST: %+v", responses)
	c.JSON(http.StatusOK, responses)
}

// GetRequest godoc
// @Summary Get a request
// @Description Get a specific request by ID
// @Tags requests
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Request ID"
// @Success 200 {object} models.RequestResponse "Request retrieved successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 404 {object} map[string]string "Request not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /requests/{id} [get]
func (h *RequestHandler) GetRequest(c *gin.Context) {
	userID := middleware.GetUserID(c)

	// Parse request ID
	requestID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request ID"})
		return
	}

	// Get request with related entities
	request, requester, approver, contact, err := h.requestService.GetRequest(
		c.Request.Context(),
		uint(requestID),
		userID,
	)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "request not found" || err.Error() == "unauthorized to access this request" {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	// Return request data
	c.JSON(http.StatusOK, request.ToResponse(requester, approver, contact))
}

// CreateRequest godoc
// @Summary Create a request
// @Description Create a new introduction request
// @Tags requests
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.RequestCreateRequest true "Request creation data"
// @Success 201 {object} models.RequestResponse "Request created successfully"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /requests [post]
func (h *RequestHandler) CreateRequest(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var req models.RequestCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create request
	request, err := h.requestService.CreateRequest(c.Request.Context(), req, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get full request data with related entities
	fullRequest, requester, approver, contact, err := h.requestService.GetRequest(
		c.Request.Context(),
		request.ID,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return created request
	c.JSON(http.StatusCreated, fullRequest.ToResponse(requester, approver, contact))
}

// UpdateRequest godoc
// @Summary Update a request
// @Description Update an existing request (approve/decline)
// @Tags requests
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Request ID"
// @Param request body models.RequestUpdateRequest true "Request update data"
// @Success 200 {object} models.RequestResponse "Request updated successfully"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Request not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /requests/{id} [put]
func (h *RequestHandler) UpdateRequest(c *gin.Context) {
	userID := middleware.GetUserID(c)

	// Parse request ID
	requestID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request ID"})
		return
	}

	var req models.RequestUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update request
	request, err := h.requestService.UpdateRequest(c.Request.Context(), uint(requestID), userID, req)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "request not found" {
			status = http.StatusNotFound
		} else if err.Error() == "only the approver can update this request" {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	// Get full request data with related entities
	fullRequest, requester, approver, contact, err := h.requestService.GetRequest(
		c.Request.Context(),
		request.ID,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return updated request
	c.JSON(http.StatusOK, fullRequest.ToResponse(requester, approver, contact))
}

// DeleteRequest godoc
// @Summary Delete a request
// @Description Delete an existing request
// @Tags requests
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Request ID"
// @Success 204 "Request deleted successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Request not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /requests/{id} [delete]
func (h *RequestHandler) DeleteRequest(c *gin.Context) {
	userID := middleware.GetUserID(c)

	// Parse request ID
	requestID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request ID"})
		return
	}

	// Delete request
	err = h.requestService.DeleteRequest(c.Request.Context(), uint(requestID), userID)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "request not found" {
			status = http.StatusNotFound
		} else if err.Error() == "only the requester can delete this request" || err.Error() == "only pending requests can be deleted" {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{"error": err.Error()})
		return
	}

	// Return success with no content
	c.Status(http.StatusNoContent)
}
