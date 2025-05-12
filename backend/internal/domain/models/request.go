package models

import (
	"time"
)

// RequestStatus represents the status of an introduction request
type RequestStatus string

const (
	RequestStatusPending  RequestStatus = "pending"
	RequestStatusApproved RequestStatus = "approved"
	RequestStatusDeclined RequestStatus = "declined"
)

// IntroductionRequest represents an introduction request
type IntroductionRequest struct {
	ID              uint          `json:"id"`
	RequesterID     uint          `json:"requester_id"`
	ApproverID      uint          `json:"approver_id"`
	TargetContactID uint          `json:"target_contact_id"`
	Message         string        `json:"message"`
	Status          RequestStatus `json:"status"`
	ResponseMessage string        `json:"response_message"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
}

// RequestCreateRequest represents a request to create an introduction request
type RequestCreateRequest struct {
	ApproverID      uint   `json:"approver_id" validate:"required"`
	TargetContactID uint   `json:"target_contact_id" validate:"required"`
	Message         string `json:"message" validate:"required"`
}

// RequestUpdateRequest represents a request to update an introduction request
type RequestUpdateRequest struct {
	Status          RequestStatus `json:"status" validate:"required,oneof=pending approved declined"`
	ResponseMessage string        `json:"response_message"`
}

// RequestResponse represents an introduction request in API responses
type RequestResponse struct {
	ID              uint            `json:"id"`
	Requester       UserResponse    `json:"requester"`
	Approver        UserResponse    `json:"approver"`
	TargetContact   ContactResponse `json:"target_contact"`
	Message         string          `json:"message"`
	Status          RequestStatus   `json:"status"`
	ResponseMessage string          `json:"response_message,omitempty"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// NewIntroductionRequest creates a new introduction request
func NewIntroductionRequest(req RequestCreateRequest, requesterID uint) *IntroductionRequest {
	now := time.Now()
	return &IntroductionRequest{
		RequesterID:     requesterID,
		ApproverID:      req.ApproverID,
		TargetContactID: req.TargetContactID,
		Message:         req.Message,
		Status:          RequestStatusPending,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
}

// ToResponse converts an IntroductionRequest to a RequestResponse
func (r *IntroductionRequest) ToResponse(requester *User, approver *User, contact *Contact) RequestResponse {
	return RequestResponse{
		ID:              r.ID,
		Requester:       requester.ToResponse(),
		Approver:        approver.ToResponse(),
		TargetContact:   contact.ToResponse(approver),
		Message:         r.Message,
		Status:          r.Status,
		ResponseMessage: r.ResponseMessage,
		CreatedAt:       r.CreatedAt,
		UpdatedAt:       r.UpdatedAt,
	}
}
