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

// ContactRepository is a MySQL implementation of the ContactRepository interface
type ContactRepository struct {
	db *sql.DB
}

// NewContactRepository creates a new MySQL ContactRepository
func NewContactRepository(db *sql.DB) *ContactRepository {
	return &ContactRepository{
		db: db,
	}
}

// Create adds a new contact to the database
func (r *ContactRepository) Create(ctx context.Context, contact *models.Contact) error {
	query := `
		INSERT INTO contacts (
			user_id, email, first_name, last_name,
			company, position, notes, phone, linkedin_url,
			created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		contact.UserID,
		strings.ToLower(contact.Email),
		contact.FirstName,
		contact.LastName,
		contact.Company,
		contact.Position,
		contact.Notes,
		contact.Phone,
		contact.LinkedInURL,
		contact.CreatedAt,
		contact.UpdatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && strings.Contains(err.Error(), "contacts_user_id_email_key") {
			return errors.New("email already exists for one of your contacts")
		}
		return fmt.Errorf("error creating contact: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	contact.ID = uint(id)
	return nil
}

// GetByID retrieves a contact by ID
func (r *ContactRepository) GetByID(ctx context.Context, id uint) (*models.Contact, error) {
	query := `
		SELECT 
			id, user_id, email, first_name, last_name,
			company, position, notes, phone, linkedin_url,
			created_at, updated_at
		FROM contacts
		WHERE id = ?
	`

	var contact models.Contact
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&contact.ID,
		&contact.UserID,
		&contact.Email,
		&contact.FirstName,
		&contact.LastName,
		&contact.Company,
		&contact.Position,
		&contact.Notes,
		&contact.Phone,
		&contact.LinkedInURL,
		&contact.CreatedAt,
		&contact.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("contact not found")
		}
		return nil, fmt.Errorf("error getting contact: %w", err)
	}

	return &contact, nil
}

// GetByIDAndUserID retrieves a contact by ID and ensures it belongs to the specified user
func (r *ContactRepository) GetByIDAndUserID(ctx context.Context, id, userID uint) (*models.Contact, error) {
	query := `
		SELECT 
			id, user_id, email, first_name, last_name,
			company, position, notes, phone, linkedin_url,
			created_at, updated_at
		FROM contacts
		WHERE id = ? AND user_id = ?
	`

	var contact models.Contact
	err := r.db.QueryRowContext(ctx, query, id, userID).Scan(
		&contact.ID,
		&contact.UserID,
		&contact.Email,
		&contact.FirstName,
		&contact.LastName,
		&contact.Company,
		&contact.Position,
		&contact.Notes,
		&contact.Phone,
		&contact.LinkedInURL,
		&contact.CreatedAt,
		&contact.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("contact not found")
		}
		return nil, fmt.Errorf("error getting contact: %w", err)
	}

	return &contact, nil
}

// GetAllByUserID retrieves all contacts for a user
func (r *ContactRepository) GetAllByUserID(ctx context.Context, userID uint) ([]*models.Contact, error) {
	query := `
		SELECT 
			id, user_id, email, first_name, last_name,
			company, position, notes, phone, linkedin_url,
			created_at, updated_at
		FROM contacts
		WHERE user_id = ?
		ORDER BY first_name, last_name
	`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("error querying contacts: %w", err)
	}
	defer rows.Close()

	var contacts []*models.Contact
	for rows.Next() {
		var contact models.Contact
		if err := rows.Scan(
			&contact.ID,
			&contact.UserID,
			&contact.Email,
			&contact.FirstName,
			&contact.LastName,
			&contact.Company,
			&contact.Position,
			&contact.Notes,
			&contact.Phone,
			&contact.LinkedInURL,
			&contact.CreatedAt,
			&contact.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning contact row: %w", err)
		}
		contacts = append(contacts, &contact)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating contact rows: %w", err)
	}

	return contacts, nil
}

// SearchByNameOrCompany searches for contacts by name or company
func (r *ContactRepository) SearchByNameOrCompany(ctx context.Context, userID uint, query string) ([]*models.Contact, error) {
	searchQuery := `
		SELECT 
			id, user_id, email, first_name, last_name,
			company, position, notes, phone, linkedin_url,
			created_at, updated_at
		FROM contacts
		WHERE user_id = ? AND (
			LOWER(first_name) LIKE ? OR
			LOWER(last_name) LIKE ? OR
			LOWER(company) LIKE ?
		)
		ORDER BY first_name, last_name
	`

	searchPattern := "%" + strings.ToLower(query) + "%"
	rows, err := r.db.QueryContext(
		ctx,
		searchQuery,
		userID,
		searchPattern,
		searchPattern,
		searchPattern,
	)
	if err != nil {
		return nil, fmt.Errorf("error searching contacts: %w", err)
	}
	defer rows.Close()

	var contacts []*models.Contact
	for rows.Next() {
		var contact models.Contact
		if err := rows.Scan(
			&contact.ID,
			&contact.UserID,
			&contact.Email,
			&contact.FirstName,
			&contact.LastName,
			&contact.Company,
			&contact.Position,
			&contact.Notes,
			&contact.Phone,
			&contact.LinkedInURL,
			&contact.CreatedAt,
			&contact.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning contact row: %w", err)
		}
		contacts = append(contacts, &contact)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating contact rows: %w", err)
	}

	return contacts, nil
}

// SearchByNameOrCompany searches for contacts by name or company
func (r *ContactRepository) SearchAllByNameOrCompany(ctx context.Context, userID uint, query string) ([]*models.Contact, error) {
	searchQuery := `
		SELECT 
			id, user_id, email, first_name, last_name,
			company, position, notes, phone, linkedin_url,
			created_at, updated_at
		FROM contacts
		WHERE user_id <> ? AND company IS NOT NULL AND TRIM(company) <> ''
		AND (LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(company) LIKE ?)
		ORDER BY first_name, last_name
	`

	searchPattern := "%" + strings.ToLower(query) + "%"
	rows, err := r.db.QueryContext(
		ctx,
		searchQuery,
		userID,
		searchPattern,
		searchPattern,
		searchPattern,
	)
	if err != nil {
		return nil, fmt.Errorf("error searching contacts: %w", err)
	}
	defer rows.Close()

	var contacts []*models.Contact
	for rows.Next() {
		var contact models.Contact
		if err := rows.Scan(
			&contact.ID,
			&contact.UserID,
			&contact.Email,
			&contact.FirstName,
			&contact.LastName,
			&contact.Company,
			&contact.Position,
			&contact.Notes,
			&contact.Phone,
			&contact.LinkedInURL,
			&contact.CreatedAt,
			&contact.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning contact row: %w", err)
		}
		fmt.Println()
		fmt.Printf("Contct in repo: %+v", contact)
		fmt.Println()
		contacts = append(contacts, &contact)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating contact rows: %w", err)
	}

	return contacts, nil
}

// Update updates a contact
func (r *ContactRepository) Update(ctx context.Context, contact *models.Contact) error {
	query := `
		UPDATE contacts
		SET 
			email = ?,
			first_name = ?,
			last_name = ?,
			company = ?,
			position = ?,
			notes = ?,
			phone = ?,
			linkedin_url = ?,
			updated_at = ?
		WHERE id = ? AND user_id = ?
	`

	contact.UpdatedAt = time.Now()
	result, err := r.db.ExecContext(
		ctx,
		query,
		strings.ToLower(contact.Email),
		contact.FirstName,
		contact.LastName,
		contact.Company,
		contact.Position,
		contact.Notes,
		contact.Phone,
		contact.LinkedInURL,
		contact.UpdatedAt,
		contact.ID,
		contact.UserID,
	)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") && strings.Contains(err.Error(), "contacts_user_id_email_key") {
			return errors.New("email already exists for one of your contacts")
		}
		return fmt.Errorf("error updating contact: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return errors.New("contact not found")
	}

	return nil
}

// Delete removes a contact
func (r *ContactRepository) Delete(ctx context.Context, id, userID uint) error {
	query := `DELETE FROM contacts WHERE id = ? AND user_id = ?`

	result, err := r.db.ExecContext(ctx, query, id, userID)
	if err != nil {
		return fmt.Errorf("error deleting contact: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return errors.New("contact not found")
	}

	return nil
}

// IsEmailUsed checks if an email is already used for a user's contact
func (r *ContactRepository) IsEmailUsed(ctx context.Context, email string, userID uint) (bool, error) {
	query := `
		SELECT COUNT(*) 
		FROM contacts 
		WHERE email = ? AND user_id = ?
	`

	var count int
	err := r.db.QueryRowContext(ctx, query, strings.ToLower(email), userID).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("error checking email usage: %w", err)
	}

	return count > 0, nil
}
