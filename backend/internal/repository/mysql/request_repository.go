package mysql

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
)

// RequestRepository is a MySQL implementation of the RequestRepository interface
type RequestRepository struct {
	db *sql.DB
}

// NewRequestRepository creates a new MySQL RequestRepository
func NewRequestRepository(db *sql.DB) *RequestRepository {
	return &RequestRepository{
		db: db,
	}
}

// Create adds a new introduction request to the database
func (r *RequestRepository) Create(ctx context.Context, request *models.IntroductionRequest) error {
	query := `
		INSERT INTO introduction_requests (
			requester_id, approver_id, target_contact_id,
			message, status, response_message,
			created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		request.RequesterID,
		request.ApproverID,
		request.TargetContactID,
		request.Message,
		request.Status,
		request.ResponseMessage,
		request.CreatedAt,
		request.UpdatedAt,
	)
	if err != nil {
		if err.Error() == "Error 1062: Duplicate entry" {
			return errors.New("a request for this contact already exists")
		}
		return fmt.Errorf("error creating request: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	request.ID = uint(id)
	return nil
}

// GetByID retrieves a request by ID
func (r *RequestRepository) GetByID(ctx context.Context, id uint) (*models.IntroductionRequest, error) {
	query := `
		SELECT 
			id, requester_id, approver_id, target_contact_id,
			message, status, response_message,
			created_at, updated_at
		FROM introduction_requests
		WHERE id = ?
	`

	var request models.IntroductionRequest
	var status string
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&request.ID,
		&request.RequesterID,
		&request.ApproverID,
		&request.TargetContactID,
		&request.Message,
		&status,
		&request.ResponseMessage,
		&request.CreatedAt,
		&request.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("request not found")
		}
		return nil, fmt.Errorf("error getting request: %w", err)
	}

	request.Status = models.RequestStatus(status)
	return &request, nil
}

// GetAllByRequesterID retrieves all requests where the user is the requester
func (r *RequestRepository) GetAllByRequesterID(ctx context.Context, requesterID uint) ([]*models.IntroductionRequest, error) {
	query := `
		SELECT 
			id, requester_id, approver_id, target_contact_id,
			message, status, response_message,
			created_at, updated_at
		FROM introduction_requests
		WHERE requester_id = ?
		ORDER BY created_at DESC
	`

	return r.queryRequests(ctx, query, requesterID)
}

// GetAllByApproverID retrieves all requests where the user is the approver
func (r *RequestRepository) GetAllByApproverID(ctx context.Context, approverID uint) ([]*models.IntroductionRequest, error) {
	query := `
		SELECT 
			id, requester_id, approver_id, target_contact_id,
			message, status, response_message,
			created_at, updated_at
		FROM introduction_requests
		WHERE approver_id = ?
		ORDER BY created_at DESC
	`

	return r.queryRequests(ctx, query, approverID)
}

// Update updates a request
func (r *RequestRepository) Update(ctx context.Context, request *models.IntroductionRequest) error {
	query := `
		UPDATE introduction_requests
		SET 
			status = ?,
			response_message = ?,
			updated_at = ?
		WHERE id = ?
	`

	request.UpdatedAt = time.Now()
	result, err := r.db.ExecContext(
		ctx,
		query,
		request.Status,
		request.ResponseMessage,
		request.UpdatedAt,
		request.ID,
	)
	if err != nil {
		return fmt.Errorf("error updating request: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return errors.New("request not found")
	}

	return nil
}

// Delete removes a request
func (r *RequestRepository) Delete(ctx context.Context, id uint) error {
	query := `DELETE FROM introduction_requests WHERE id = ?`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("error deleting request: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error getting rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return errors.New("request not found")
	}

	return nil
}

// Exists checks if a request already exists for this requester and contact
func (r *RequestRepository) Exists(ctx context.Context, requesterID, targetContactID uint) (bool, error) {
	query := `
		SELECT COUNT(*) 
		FROM introduction_requests 
		WHERE requester_id = ? AND target_contact_id = ?
	`

	var count int
	err := r.db.QueryRowContext(ctx, query, requesterID, targetContactID).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("error checking request existence: %w", err)
	}

	return count > 0, nil
}

// Helper function to query requests
func (r *RequestRepository) queryRequests(ctx context.Context, query string, id uint) ([]*models.IntroductionRequest, error) {
	rows, err := r.db.QueryContext(ctx, query, id)
	if err != nil {
		return nil, fmt.Errorf("error querying requests: %w", err)
	}
	defer rows.Close()

	var requests []*models.IntroductionRequest
	for rows.Next() {
		var request models.IntroductionRequest
		var status string
		if err := rows.Scan(
			&request.ID,
			&request.RequesterID,
			&request.ApproverID,
			&request.TargetContactID,
			&request.Message,
			&status,
			&request.ResponseMessage,
			&request.CreatedAt,
			&request.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("error scanning request row: %w", err)
		}
		request.Status = models.RequestStatus(status)
		requests = append(requests, &request)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating request rows: %w", err)
	}

	return requests, nil
}
