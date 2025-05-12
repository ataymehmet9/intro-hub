package services

import (
	"context"
	"errors"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
	"github.com/ataymehmet9/intro-hub/internal/domain/repositories"
	"github.com/ataymehmet9/intro-hub/internal/email"
)

// RequestService handles introduction request business logic
type RequestService struct {
	requestRepo repositories.RequestRepository
	contactRepo repositories.ContactRepository
	userRepo    repositories.UserRepository
	mailer      *email.Mailer
}

// NewRequestService creates a new RequestService
func NewRequestService(
	requestRepo repositories.RequestRepository,
	contactRepo repositories.ContactRepository,
	userRepo repositories.UserRepository,
	mailer *email.Mailer,
) *RequestService {
	return &RequestService{
		requestRepo: requestRepo,
		contactRepo: contactRepo,
		userRepo:    userRepo,
		mailer:      mailer,
	}
}

// CreateRequest creates a new introduction request
func (s *RequestService) CreateRequest(ctx context.Context, req models.RequestCreateRequest, requesterID uint) (*models.IntroductionRequest, error) {
	// Verify target contact exists and belongs to approver
	contact, err := s.contactRepo.GetByID(ctx, req.TargetContactID)
	if err != nil {
		return nil, err
	}
	if contact.UserID != req.ApproverID {
		return nil, errors.New("target contact does not belong to specified approver")
	}

	// Check if a request already exists
	exists, err := s.requestRepo.Exists(ctx, requesterID, req.TargetContactID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("a request for this contact already exists")
	}

	// Create request
	request := models.NewIntroductionRequest(req, requesterID)
	if err := s.requestRepo.Create(ctx, request); err != nil {
		return nil, err
	}

	// Send notification to approver (asynchronously)
	go s.sendNewRequestNotification(request)

	return request, nil
}

// GetRequest retrieves a request by ID
func (s *RequestService) GetRequest(ctx context.Context, id, userID uint) (*models.IntroductionRequest, *models.User, *models.User, *models.Contact, error) {
	// Get request
	request, err := s.requestRepo.GetByID(ctx, id)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	// Verify user is either requester or approver
	if request.RequesterID != userID && request.ApproverID != userID {
		return nil, nil, nil, nil, errors.New("unauthorized to access this request")
	}

	// Get requester, approver, and target contact
	requester, err := s.userRepo.GetByID(ctx, request.RequesterID)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	approver, err := s.userRepo.GetByID(ctx, request.ApproverID)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	contact, err := s.contactRepo.GetByID(ctx, request.TargetContactID)
	if err != nil {
		return nil, nil, nil, nil, err
	}

	return request, requester, approver, contact, nil
}

// GetRequestsByType retrieves requests by type (sent or received)
func (s *RequestService) GetRequestsByType(ctx context.Context, userID uint, isSent bool) ([]*models.IntroductionRequest, error) {
	if isSent {
		return s.requestRepo.GetAllByRequesterID(ctx, userID)
	}
	return s.requestRepo.GetAllByApproverID(ctx, userID)
}

// UpdateRequest updates a request's status
func (s *RequestService) UpdateRequest(ctx context.Context, id, userID uint, req models.RequestUpdateRequest) (*models.IntroductionRequest, error) {
	// Get request
	request, err := s.requestRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Verify user is the approver
	if request.ApproverID != userID {
		return nil, errors.New("only the approver can update this request")
	}

	// Update request
	request.Status = req.Status
	request.ResponseMessage = req.ResponseMessage
	if err := s.requestRepo.Update(ctx, request); err != nil {
		return nil, err
	}

	// Send notification based on status (asynchronously)
	if request.Status == models.RequestStatusApproved {
		go s.sendApprovalNotification(request)
	} else if request.Status == models.RequestStatusDeclined {
		go s.sendDeclineNotification(request)
	}

	return request, nil
}

// DeleteRequest deletes a request
func (s *RequestService) DeleteRequest(ctx context.Context, id, userID uint) error {
	// Get request
	request, err := s.requestRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	// Verify user is the requester and request is pending
	if request.RequesterID != userID {
		return errors.New("only the requester can delete this request")
	}
	if request.Status != models.RequestStatusPending {
		return errors.New("only pending requests can be deleted")
	}

	return s.requestRepo.Delete(ctx, id)
}

// Helper functions for email notifications

func (s *RequestService) sendNewRequestNotification(request *models.IntroductionRequest) {
	ctx := context.Background()

	requester, err := s.userRepo.GetByID(ctx, request.RequesterID)
	if err != nil {
		return
	}

	approver, err := s.userRepo.GetByID(ctx, request.ApproverID)
	if err != nil {
		return
	}

	contact, err := s.contactRepo.GetByID(ctx, request.TargetContactID)
	if err != nil {
		return
	}

	s.mailer.SendNewRequestEmail(approver.Email, requester, approver, contact, request)
}

func (s *RequestService) sendApprovalNotification(request *models.IntroductionRequest) {
	ctx := context.Background()

	requester, err := s.userRepo.GetByID(ctx, request.RequesterID)
	if err != nil {
		return
	}

	approver, err := s.userRepo.GetByID(ctx, request.ApproverID)
	if err != nil {
		return
	}

	contact, err := s.contactRepo.GetByID(ctx, request.TargetContactID)
	if err != nil {
		return
	}

	s.mailer.SendRequestApprovedEmail(requester.Email, contact.Email, approver.Email, requester, approver, contact, request)
}

func (s *RequestService) sendDeclineNotification(request *models.IntroductionRequest) {
	ctx := context.Background()

	requester, err := s.userRepo.GetByID(ctx, request.RequesterID)
	if err != nil {
		return
	}

	approver, err := s.userRepo.GetByID(ctx, request.ApproverID)
	if err != nil {
		return
	}

	contact, err := s.contactRepo.GetByID(ctx, request.TargetContactID)
	if err != nil {
		return
	}

	s.mailer.SendRequestDeclinedEmail(requester.Email, requester, approver, contact, request)
}
