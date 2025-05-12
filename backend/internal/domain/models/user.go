package models

import (
	"time"

	"github.com/ataymehmet9/intro-hub/internal/utils"
)

// User represents a user entity
type User struct {
	ID             uint      `json:"id"`
	Email          string    `json:"email"`
	PasswordHash   string    `json:"-"` // Never expose in JSON
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	Company        string    `json:"company"`
	Position       string    `json:"position"`
	Bio            string    `json:"bio"`
	ProfilePicture string    `json:"profile_picture"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// UserSignupRequest represents the request to create a new user
type UserSignupRequest struct {
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=6"`
	PasswordConfirm string `json:"password_confirm" validate:"required,eqfield=Password"`
	FirstName       string `json:"first_name" validate:"required"`
	LastName        string `json:"last_name" validate:"required"`
	Company         string `json:"company"`
	Position        string `json:"position"`
}

// UserLoginRequest represents the request to login a user
type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// UserUpdateRequest represents the request to update a user's profile
type UserUpdateRequest struct {
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	Company        string `json:"company"`
	Position       string `json:"position"`
	Bio            string `json:"bio"`
	ProfilePicture string `json:"profile_picture"`
}

// UserResponse represents the user data to be returned in responses
type UserResponse struct {
	ID             uint      `json:"id"`
	Email          string    `json:"email"`
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	FullName       string    `json:"full_name"`
	Company        string    `json:"company"`
	Position       string    `json:"position"`
	Bio            string    `json:"bio,omitempty"`
	ProfilePicture string    `json:"profile_picture,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// NewUserFromSignupRequest creates a new User from a UserSignupRequest
func NewUserFromSignupRequest(req UserSignupRequest) (*User, error) {
	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	return &User{
		Email:        req.Email,
		PasswordHash: passwordHash,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Company:      req.Company,
		Position:     req.Position,
		CreatedAt:    now,
		UpdatedAt:    now,
	}, nil
}

// ToResponse converts a User to a UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:             u.ID,
		Email:          u.Email,
		FirstName:      u.FirstName,
		LastName:       u.LastName,
		FullName:       u.FirstName + " " + u.LastName,
		Company:        u.Company,
		Position:       u.Position,
		Bio:            u.Bio,
		ProfilePicture: u.ProfilePicture,
		CreatedAt:      u.CreatedAt,
		UpdatedAt:      u.UpdatedAt,
	}
}

// CheckPassword validates the provided password against the user's stored hash
func (u *User) CheckPassword(password string) bool {
	return utils.CheckPasswordHash(password, u.PasswordHash)
}
