package repositories

import (
	"context"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
)

// RequestRepository defines the interface for introduction request data operations
type RequestRepository interface {
	// Create a new introduction request
	Create(ctx context.Context, request *models.IntroductionRequest) error

	// Get a request by ID
	GetByID(ctx context.Context, id uint) (*models.IntroductionRequest, error)

	// Get all requests where the user is the requester
	GetAllByRequesterID(ctx context.Context, requesterID uint) ([]*models.IntroductionRequest, error)

	// Get all requests where the user is the approver
	GetAllByApproverID(ctx context.Context, approverID uint) ([]*models.IntroductionRequest, error)

	// Update a request
	Update(ctx context.Context, request *models.IntroductionRequest) error

	// Delete a request
	Delete(ctx context.Context, id uint) error

	// Check if a request already exists for this requester and contact
	Exists(ctx context.Context, requesterID, targetContactID uint) (bool, error)
}
