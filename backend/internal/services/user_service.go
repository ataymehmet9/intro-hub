package services

import (
	"context"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/domain/repositories"
)

// UserService handles user-related business logic
type UserService struct {
	userRepo repositories.UserRepository
}

// NewUserService creates a new UserService
func NewUserService(userRepo repositories.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// GetProfile retrieves a user's profile
func (s *UserService) GetProfile(ctx context.Context, userID uint) (*models.User, error) {
	return s.userRepo.GetByID(ctx, userID)
}

// UpdateProfile updates a user's profile
func (s *UserService) UpdateProfile(ctx context.Context, userID uint, req models.UserUpdateRequest) (*models.User, error) {
	// Get existing user
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}

	// These fields can be updated to empty strings
	user.Company = req.Company
	user.Position = req.Position
	user.Bio = req.Bio
	user.ProfilePicture = req.ProfilePicture

	// Save updates
	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}
