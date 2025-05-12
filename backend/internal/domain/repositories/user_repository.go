package repositories

import (
	"context"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
)

// UserRepository defines the interface for user data operations
type UserRepository interface {
	// Create a new user
	Create(ctx context.Context, user *models.User) error

	// Get a user by ID
	GetByID(ctx context.Context, id uint) (*models.User, error)

	// Get a user by email
	GetByEmail(ctx context.Context, email string) (*models.User, error)

	// Update user information
	Update(ctx context.Context, user *models.User) error

	// Delete a user
	Delete(ctx context.Context, id uint) error
}
