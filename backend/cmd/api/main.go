package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ataymehmet9/intro-hub/internal/api/router"
	"github.com/ataymehmet9/intro-hub/internal/api/server"
	"github.com/ataymehmet9/intro-hub/internal/config"
	"github.com/ataymehmet9/intro-hub/internal/repository/mysql"
	"github.com/ataymehmet9/intro-hub/pkg/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize config
	cfg := config.NewConfig()

	// Initialize logger
	l := logger.NewLogger(cfg.LogLevel)

	// Connect to MySQL
	db, err := mysql.NewMySQLConnection(cfg.MySQLDSN)
	if err != nil {
		l.Fatal("Failed to connect to MySQL", "error", err)
	}
	defer db.Close()

	// // Run database migrations
	// if err := mysql.MigrateDatabase(cfg.MySQLDSN); err != nil {
	// 	l.Fatal("Failed to run database migrations", "error", err)
	// }

	// Initialize repositories
	userRepo := mysql.NewUserRepository(db)
	contactRepo := mysql.NewContactRepository(db)
	requestRepo := mysql.NewRequestRepository(db)

	// Create the router
	r := router.NewRouter(cfg, l, userRepo, contactRepo, requestRepo)

	// Initialize and start the server
	srv := server.NewServer(cfg, r)
	go func() {
		l.Info("Starting server", "port", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			l.Fatal("Server failed to start", "error", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	l.Info("Shutting down server...")

	// Create a deadline for server shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := srv.Shutdown(ctx); err != nil {
		l.Fatal("Server forced to shutdown", "error", err)
	}

	l.Info("Server exited properly")
}
