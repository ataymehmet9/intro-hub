package services

import (
	"context"
	"errors"
	"time"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/domain/repositories"
	"github.com/ataymehmet9/intro-hub/internal/utils"
)

// AuthService handles authentication related business logic
type AuthService struct {
	userRepo     repositories.UserRepository
	jwtSecret    string
	jwtExpiryHrs int
}

// NewAuthService creates a new AuthService
func NewAuthService(
	userRepo repositories.UserRepository,
	jwtSecret string,
	jwtExpiryHrs int,
) *AuthService {
	return &AuthService{
		userRepo:     userRepo,
		jwtSecret:    jwtSecret,
		jwtExpiryHrs: jwtExpiryHrs,
	}
}

// Login authenticates a user and returns a JWT token
func (s *AuthService) Login(ctx context.Context, req models.UserLoginRequest) (string, *models.User, error) {
	// Find user by email
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return "", nil, errors.New("invalid email or password")
	}

	// Verify password
	if !user.CheckPassword(req.Password) {
		return "", nil, errors.New("invalid email or password")
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, s.jwtSecret, time.Duration(s.jwtExpiryHrs)*time.Hour)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

// Register creates a new user and returns a JWT token
func (s *AuthService) Register(ctx context.Context, req models.UserSignupRequest) (string, *models.User, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		return "", nil, errors.New("email already registered")
	}

	// Create user
	user, err := models.NewUserFromSignupRequest(req)
	if err != nil {
		return "", nil, err
	}

	// Save user to database
	if err := s.userRepo.Create(ctx, user); err != nil {
		return "", nil, err
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, s.jwtSecret, time.Duration(s.jwtExpiryHrs)*time.Hour)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

// GetUserByID retrieves a user by ID
func (s *AuthService) GetUserByID(ctx context.Context, id uint) (*models.User, error) {
	return s.userRepo.GetByID(ctx, id)
}
