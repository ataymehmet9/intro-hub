package mysql

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
)

// UserRepository is a MySQL implementation of the UserRepository interface
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository creates a new MySQL UserRepository
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

// Create adds a new user to the database
func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	query := `
		INSERT INTO users (
			email, password_hash, first_name, last_name, 
			company, position, bio, profile_picture,
			created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		strings.ToLower(user.Email),
		user.PasswordHash,
		user.FirstName,
		user.LastName,
		user.Company,
		user.Position,
		user.Bio,
		user.ProfilePicture,
		user.CreatedAt,
		user.UpdatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && strings.Contains(err.Error(), "users_email_key") {
			return errors.New("email already in use")
		}
		return fmt.Errorf("error creating user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	user.ID = uint(id)
	return nil
}

// GetByID retrieves a user by ID
func (r *UserRepository) GetByID(ctx context.Context, id uint) (*models.User, error) {
	query := `
		SELECT 
			id, email, password_hash, first_name, last_name,
			company, position, bio, profile_picture,
			created_at, updated_at
		FROM users
		WHERE id = ?
	`

	var user models.User
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&user.Company,
		&user.Position,
		&user.Bio,
		&user.ProfilePicture,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("error getting user: %w", err)
	}

	return &user, nil
}

// GetByEmail retrieves a user by email
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT 
			id, email, password_hash, first_name, last_name,
			company, position, bio, profile_picture,
			created_at, updated_at
		FROM users
		WHERE email = ?
	`

	var user models.User
	err := r.db.QueryRowContext(ctx, query, strings.ToLower(email)).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&user.Company,
		&user.Position,
		&user.Bio,
		&user.ProfilePicture,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("error getting user by email: %w", err)
	}

	return &user, nil
}

// Update updates user information
func (r *UserRepository) Update(ctx context.Context, user *models.User) error {
	query := `
		UPDATE users
		SET 
			first_name = ?,
			last_name = ?,
			company = ?,
			position = ?,
			bio = ?,
			profile_picture = ?,
			updated_at = ?
		WHERE id = ?
	`

	user.UpdatedAt = time.Now()
	_, err := r.db.ExecContext(
		ctx,
		query,
		user.FirstName,
		user.LastName,
		user.Company,
		user.Position,
		user.Bio,
		user.ProfilePicture,
		user.UpdatedAt,
		user.ID,
	)

	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}

	return nil
}

// Delete removes a user
func (r *UserRepository) Delete(ctx context.Context, id uint) error {
	query := `DELETE FROM users WHERE id = ?`

	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("error deleting user: %w", err)
	}

	return nil
}
