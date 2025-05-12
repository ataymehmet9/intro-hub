package middleware

import (
	"time"

	"github.com/ataymehmet9/intro-hub/pkg/logger"
	"github.com/gin-gonic/gin"
)

// LoggerMiddleware is a middleware for logging HTTP requests
func LoggerMiddleware(l *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Log request details
		duration := time.Since(start)
		l.Info("Request processed",
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"duration", duration,
			"ip", c.ClientIP(),
			"user_agent", c.Request.UserAgent(),
		)
	}
}
