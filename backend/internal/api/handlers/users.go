package handlers

import (
	"fmt"
	"net/http"

	"github.com/ataymehmet9/intro-hub/internal/api/middleware"
	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/services"
	"github.com/ataymehmet9/intro-hub/internal/utils"
	"github.com/gin-gonic/gin"
)

// UserHandler handles user-related API endpoints
type UserHandler struct {
	userService *services.UserService
}

// NewUserHandler creates a new UserHandler
func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetProfile godoc
// @Summary Get user profile
// @Description Get the current user's profile
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.UserResponse "User profile retrieved successfully"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /profile [get]
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := middleware.GetUserID(c)
	fmt.Println("User ID:", userID)

	// Get user profile
	user, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return user data
	c.JSON(http.StatusOK, user.ToResponse())
}

// UpdateProfile godoc
// @Summary Update user profile
// @Description Update the current user's profile
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.UserUpdateRequest true "User profile update data"
// @Success 200 {object} models.UserResponse "User profile updated successfully"
// @Failure 400 {object} map[string]string "Validation error"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Server error"
// @Router /profile [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var req models.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if err := utils.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update user profile
	user, err := h.userService.UpdateProfile(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return updated user data
	c.JSON(http.StatusOK, user.ToResponse())
}
