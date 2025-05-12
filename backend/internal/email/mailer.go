package email

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/smtp"
	"path/filepath"

	"github.com/ataymehmet9/intro-hub/internal/domain/models"
)

// Mailer handles sending emails
type Mailer struct {
	host     string
	port     int
	username string
	password string
	from     string
	fromName string
}

// NewMailer creates a new Mailer
func NewMailer(host string, port int, username, password, from, fromName string) *Mailer {
	return &Mailer{
		host:     host,
		port:     port,
		username: username,
		password: password,
		from:     from,
		fromName: fromName,
	}
}

// SendNewRequestEmail sends an email notification about a new introduction request
func (m *Mailer) SendNewRequestEmail(to string, requester *models.User, approver *models.User, contact *models.Contact, request *models.IntroductionRequest) error {
	subject := fmt.Sprintf("%s would like an introduction to %s", requester.FirstName+" "+requester.LastName, contact.FirstName+" "+contact.LastName)

	data := map[string]interface{}{
		"Requester": requester,
		"Approver":  approver,
		"Contact":   contact,
		"Request":   request,
	}

	return m.sendEmail(to, subject, "new_request.html", data)
}

// SendRequestApprovedEmail sends an email when a request is approved
func (m *Mailer) SendRequestApprovedEmail(toRequester, toContact, ccApprover string, requester *models.User, approver *models.User, contact *models.Contact, request *models.IntroductionRequest) error {
	subject := fmt.Sprintf("Introduction: %s <> %s", requester.FirstName+" "+requester.LastName, contact.FirstName+" "+contact.LastName)

	data := map[string]interface{}{
		"Requester": requester,
		"Approver":  approver,
		"Contact":   contact,
		"Request":   request,
	}

	// In a real implementation, you'd handle multiple recipients more gracefully
	to := []string{toRequester, toContact, ccApprover}
	return m.sendEmailToMultiple(to, subject, "request_approved.html", data)
}

// SendRequestDeclinedEmail sends an email when a request is declined
func (m *Mailer) SendRequestDeclinedEmail(to string, requester *models.User, approver *models.User, contact *models.Contact, request *models.IntroductionRequest) error {
	subject := fmt.Sprintf("Introduction request to %s was declined", contact.FirstName+" "+contact.LastName)

	data := map[string]interface{}{
		"Requester": requester,
		"Approver":  approver,
		"Contact":   contact,
		"Request":   request,
	}

	return m.sendEmail(to, subject, "request_declined.html", data)
}

// Helper method to send an email
func (m *Mailer) sendEmail(to, subject, templateFile string, data map[string]interface{}) error {
	return m.sendEmailToMultiple([]string{to}, subject, templateFile, data)
}

// Helper method to send an email to multiple recipients
func (m *Mailer) sendEmailToMultiple(to []string, subject, templateFile string, data map[string]interface{}) error {
	// Load template
	tmpl, err := template.ParseFiles(filepath.Join("internal", "email", "templates", templateFile))
	if err != nil {
		log.Printf("Error loading email template: %v", err)
		return err
	}

	// Render template
	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		log.Printf("Error rendering email template: %v", err)
		return err
	}

	// Prepare email
	from := fmt.Sprintf("%s <%s>", m.fromName, m.from)
	msg := []byte(fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s", from, to[0], subject, body.String()))

	// Send email
	auth := smtp.PlainAuth("", m.username, m.password, m.host)
	addr := fmt.Sprintf("%s:%d", m.host, m.port)

	// In a real implementation, you would handle authentication and sending more gracefully
	// Here we're just logging errors for simplicity
	if err := smtp.SendMail(addr, auth, m.from, to, msg); err != nil {
		log.Printf("Error sending email: %v", err)
		return err
	}

	return nil
}
