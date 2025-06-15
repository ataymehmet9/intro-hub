package models

import (
	"time"
)

// Contact represents a contact entity
type Contact struct {
	ID          uint      `json:"id"`
	UserID      uint      `json:"user_id"`
	Email       string    `json:"email"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Company     string    `json:"company"`
	Position    string    `json:"position"`
	Notes       string    `json:"notes"`
	Phone       string    `json:"phone"`
	LinkedInURL string    `json:"linkedin_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ContactCreateRequest represents the request to create a new contact
type ContactCreateRequest struct {
	Email       string `json:"email" validate:"required"` // validate:"required,email"`
	FirstName   string `json:"first_name" validate:"required"`
	LastName    string `json:"last_name" validate:"required"`
	Company     string `json:"company" validate:"required"`
	Position    string `json:"position" validate:"required"`
	Notes       string `json:"notes,omitempty"`
	Phone       string `json:"phone,omitempty"`
	LinkedInURL string `json:"linkedin_url,omitempty"`
}

// ContactUpdateRequest represents the request to update a contact
type ContactUpdateRequest struct {
	Email       string `json:"email" validate:"omitempty,email"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Company     string `json:"company"`
	Position    string `json:"position"`
	Notes       string `json:"notes"`
	Phone       string `json:"phone"`
	LinkedInURL string `json:"linkedin_url"`
}

// ContactBatchImportRequest represents a batch of contacts to import
type ContactBatchImportRequest struct {
	Contacts []ContactCreateRequest `json:"contacts" validate:"required,dive"`
}

// ContactResponse represents a contact in API responses
type ContactResponse struct {
	ID          uint         `json:"id"`
	UserID      uint         `json:"user_id"`
	Email       string       `json:"email,omitempty"`
	FirstName   string       `json:"first_name,omitempty"`
	LastName    string       `json:"last_name,omitempty"`
	FullName    string       `json:"full_name,omitempty"`
	Company     string       `json:"company,omitempty"`
	Position    string       `json:"position,omitempty"`
	Notes       string       `json:"notes,omitempty"`
	Phone       string       `json:"phone,omitempty"`
	LinkedInURL string       `json:"linkedin_url,omitempty"`
	User        UserResponse `json:"user"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

// BatchImportResponse represents the response for a batch import
type BatchImportResponse struct {
	SuccessCount int                `json:"success_count"`
	ErrorCount   int                `json:"error_count"`
	Errors       []BatchImportError `json:"errors,omitempty"`
}

// BatchImportError represents an error during batch import
type BatchImportError struct {
	Data   ContactCreateRequest `json:"data"`
	Errors []string             `json:"errors"`
}

// NewContactFromCreateRequest creates a new Contact from a ContactCreateRequest
func NewContactFromCreateRequest(req ContactCreateRequest, userID uint) *Contact {
	now := time.Now()
	return &Contact{
		UserID:      userID,
		Email:       req.Email,
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Company:     req.Company,
		Position:    req.Position,
		Notes:       req.Notes,
		Phone:       req.Phone,
		LinkedInURL: req.LinkedInURL,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// ToResponse converts a Contact to a ContactResponse
func (c *Contact) ToResponse(user *User) ContactResponse {
	return ContactResponse{
		ID:          c.ID,
		UserID:      c.UserID,
		Email:       c.Email,
		FirstName:   c.FirstName,
		LastName:    c.LastName,
		FullName:    c.FirstName + " " + c.LastName,
		Company:     c.Company,
		Position:    c.Position,
		Notes:       c.Notes,
		Phone:       c.Phone,
		LinkedInURL: c.LinkedInURL,
		User:        user.ToResponse(),
		CreatedAt:   c.CreatedAt,
		UpdatedAt:   c.UpdatedAt,
	}
}
