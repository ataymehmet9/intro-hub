package services

import (
	"context"
	"errors"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/domain/repositories"
)

// ContactService handles contact-related business logic
type ContactService struct {
	contactRepo repositories.ContactRepository
	userRepo    repositories.UserRepository
}

// NewContactService creates a new ContactService
func NewContactService(
	contactRepo repositories.ContactRepository,
	userRepo repositories.UserRepository,
) *ContactService {
	return &ContactService{
		contactRepo: contactRepo,
		userRepo:    userRepo,
	}
}

// CreateContact creates a new contact for a user
func (s *ContactService) CreateContact(ctx context.Context, req models.ContactCreateRequest, userID uint) (*models.Contact, error) {
	// Check if email is already used
	exists, err := s.contactRepo.IsEmailUsed(ctx, req.Email, userID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("email already exists for one of your contacts")
	}

	// Create contact
	contact := models.NewContactFromCreateRequest(req, userID)
	if err := s.contactRepo.Create(ctx, contact); err != nil {
		return nil, err
	}

	return contact, nil
}

// GetContact retrieves a contact by ID
func (s *ContactService) GetContact(ctx context.Context, id, userID uint) (*models.Contact, error) {
	return s.contactRepo.GetByIDAndUserID(ctx, id, userID)
}

// GetAllContacts retrieves all contacts for a user
func (s *ContactService) GetAllContacts(ctx context.Context, userID uint) ([]*models.Contact, error) {
	return s.contactRepo.GetAllByUserID(ctx, userID)
}

// SearchContacts searches for contacts by name or company
func (s *ContactService) SearchContacts(ctx context.Context, userID uint, query string) ([]*models.Contact, error) {
	return s.contactRepo.SearchByNameOrCompany(ctx, userID, query)
}

// SearchContacts searches for contacts by name or company
func (s *ContactService) SearchAllContacts(ctx context.Context, userID uint, query string) ([]*models.Contact, error) {
	return s.contactRepo.SearchAllByNameOrCompany(ctx, userID, query)
}

// UpdateContact updates a contact
func (s *ContactService) UpdateContact(ctx context.Context, id, userID uint, req models.ContactUpdateRequest) (*models.Contact, error) {
	// Get existing contact
	contact, err := s.contactRepo.GetByIDAndUserID(ctx, id, userID)
	if err != nil {
		return nil, err
	}

	// Check if new email is already used (if email is being updated)
	if req.Email != "" && req.Email != contact.Email {
		exists, err := s.contactRepo.IsEmailUsed(ctx, req.Email, userID)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, errors.New("email already exists for one of your contacts")
		}
		contact.Email = req.Email
	}

	// Update other fields if provided
	if req.FirstName != "" {
		contact.FirstName = req.FirstName
	}
	if req.LastName != "" {
		contact.LastName = req.LastName
	}

	// These fields can be updated to empty strings
	contact.Company = req.Company
	contact.Position = req.Position
	contact.Notes = req.Notes
	contact.Phone = req.Phone
	contact.LinkedInURL = req.LinkedInURL

	// Save updates
	if err := s.contactRepo.Update(ctx, contact); err != nil {
		return nil, err
	}

	return contact, nil
}

// DeleteContact deletes a contact
func (s *ContactService) DeleteContact(ctx context.Context, id, userID uint) error {
	return s.contactRepo.Delete(ctx, id, userID)
}

// BatchImportContacts imports multiple contacts at once
func (s *ContactService) BatchImportContacts(ctx context.Context, req models.ContactBatchImportRequest, userID uint) (*models.BatchImportResponse, error) {
	result := &models.BatchImportResponse{
		SuccessCount: 0,
		ErrorCount:   0,
		Errors:       []models.BatchImportError{},
	}

	for _, contactReq := range req.Contacts {
		contact := models.NewContactFromCreateRequest(contactReq, userID)

		// Check if email is already used
		exists, err := s.contactRepo.IsEmailUsed(ctx, contact.Email, userID)
		if err != nil {
			importError := models.BatchImportError{
				Data:   contactReq,
				Errors: []string{err.Error()},
			}
			result.Errors = append(result.Errors, importError)
			result.ErrorCount++
			continue
		}

		if exists {
			importError := models.BatchImportError{
				Data:   contactReq,
				Errors: []string{"email already exists for one of your contacts"},
			}
			result.Errors = append(result.Errors, importError)
			result.ErrorCount++
			continue
		}

		// Create contact
		if err := s.contactRepo.Create(ctx, contact); err != nil {
			importError := models.BatchImportError{
				Data:   contactReq,
				Errors: []string{err.Error()},
			}
			result.Errors = append(result.Errors, importError)
			result.ErrorCount++
			continue
		}

		result.SuccessCount++
	}

	return result, nil
}
