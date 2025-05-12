package repositories

import (
	"context"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
)

// ContactRepository defines the interface for contact data operations
type ContactRepository interface {
	// Create a new contact
	Create(ctx context.Context, contact *models.Contact) error

	// Get a contact by ID
	GetByID(ctx context.Context, id uint) (*models.Contact, error)

	// Get a contact by ID and ensure it belongs to the specified user
	GetByIDAndUserID(ctx context.Context, id, userID uint) (*models.Contact, error)

	// Get all contacts for a user
	GetAllByUserID(ctx context.Context, userID uint) ([]*models.Contact, error)

	// Search for contacts by name or company
	SearchByNameOrCompany(ctx context.Context, userID uint, query string) ([]*models.Contact, error)

	// Update a contact
	Update(ctx context.Context, contact *models.Contact) error

	// Delete a contact
	Delete(ctx context.Context, id, userID uint) error

	// Check if an email is already used for a user's contact
	IsEmailUsed(ctx context.Context, email string, userID uint) (bool, error)
}
