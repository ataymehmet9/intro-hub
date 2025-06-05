package router

import (
	"github.com/ataymehmet9/intro-hub/internal/api/handlers"
	"github.com/ataymehmet9/intro-hub/internal/api/middleware"
	"github.com/ataymehmet9/intro-hub/internal/config"
	"github.com/ataymehmet9/intro-hub/internal/domain/repositories"
	"github.com/ataymehmet9/intro-hub/internal/email"
	"github.com/ataymehmet9/intro-hub/internal/services"
	"github.com/ataymehmet9/intro-hub/pkg/logger"
	"github.com/gin-gonic/gin"
)

// NewRouter creates a new router with all routes configured
func NewRouter(cfg *config.Config, l *logger.Logger, userRepo repositories.UserRepository, contactRepo repositories.ContactRepository, requestRepo repositories.RequestRepository) *gin.Engine {
	// Set gin mode
	if cfg.ServerEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create router
	r := gin.New()

	// Add middlewares
	r.Use(gin.Recovery())
	r.Use(middleware.LoggerMiddleware(l))
	r.Use(middleware.CorsMiddleware(cfg.AllowedOrigins))

	// Set trusted proxies
	r.SetTrustedProxies(cfg.TrustedProxies)

	// Create mailer
	mailer := email.NewMailer(
		cfg.SMTPHost,
		cfg.SMTPPort,
		cfg.SMTPUsername,
		cfg.SMTPPassword,
		cfg.SMTPFromEmail,
		cfg.SMTPFromName,
	)

	// Create services
	authService := services.NewAuthService(userRepo, cfg.JWTSecret, cfg.JWTExpiryHours)
	userService := services.NewUserService(userRepo)
	contactService := services.NewContactService(contactRepo, userRepo)
	requestService := services.NewRequestService(requestRepo, contactRepo, userRepo, mailer)

	// Create handlers
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)
	contactHandler := handlers.NewContactHandler(contactService, userService)
	requestHandler := handlers.NewRequestHandler(requestService)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Auth routes (no authentication required)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Protected routes (authentication required)
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))
		{
			// User profile
			protected.GET("/profile", userHandler.GetProfile)
			protected.PUT("/profile", userHandler.UpdateProfile)

			// Contacts
			contacts := protected.Group("/contacts")
			{
				contacts.GET("", contactHandler.ListContacts)
				contacts.POST("", contactHandler.CreateContact)
				contacts.GET("/:id", contactHandler.GetContact)
				contacts.PATCH("/:id", contactHandler.UpdateContact)
				contacts.DELETE("/:id", contactHandler.DeleteContact)
				contacts.POST("/batch-import", contactHandler.BatchImportContacts)
				contacts.POST("/bulk_upload", contactHandler.BatchImportContacts)
			}

			users := protected.Group("/users")
			{
				users.GET("/all", contactHandler.SearchAllContacts)
			}

			// Introduction requests
			requests := protected.Group("/requests")
			{
				requests.GET("", requestHandler.ListRequests)
				requests.POST("", requestHandler.CreateRequest)
				requests.GET("/:id", requestHandler.GetRequest)
				requests.PUT("/:id", requestHandler.UpdateRequest)
				requests.DELETE("/:id", requestHandler.DeleteRequest)
			}
		}
	}

	return r
}
