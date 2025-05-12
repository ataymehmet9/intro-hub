package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ataymehmet9/intro-hub/internal/config"
	"github.com/gin-gonic/gin"
)

// Server represents the HTTP server
type Server struct {
	*http.Server
}

// NewServer creates a new HTTP server
func NewServer(cfg *config.Config, handler *gin.Engine) *Server {
	return &Server{
		Server: &http.Server{
			Addr:         fmt.Sprintf(":%s", cfg.ServerPort),
			Handler:      handler,
			ReadTimeout:  cfg.ServerTimeout,
			WriteTimeout: cfg.ServerTimeout,
			IdleTimeout:  120 * time.Second,
		},
	}
}
