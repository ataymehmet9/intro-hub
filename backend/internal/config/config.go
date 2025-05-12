package config

import (
	"os"
	"strconv"
	"time"
)

// Config holds all configuration for the application
type Config struct {
	// Server
	ServerPort     string
	ServerTimeout  time.Duration
	ServerEnv      string
	AllowedOrigins []string
	TrustedProxies []string
	LogLevel       string

	// Database
	MySQLDSN string

	// JWT
	JWTSecret      string
	JWTExpiryHours int

	// Email
	SMTPHost      string
	SMTPPort      int
	SMTPUsername  string
	SMTPPassword  string
	SMTPFromEmail string
	SMTPFromName  string
}

// NewConfig creates a new Config instance
func NewConfig() *Config {
	jwtExpiryHours, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	smtpPort, _ := strconv.Atoi(getEnv("SMTP_PORT", "587"))

	return &Config{
		// Server
		ServerPort:     getEnv("SERVER_PORT", "8080"),
		ServerTimeout:  time.Duration(getIntEnv("SERVER_TIMEOUT_SECONDS", 30)) * time.Second,
		ServerEnv:      getEnv("SERVER_ENV", "development"),
		AllowedOrigins: getEnvSlice("ALLOWED_ORIGINS", []string{"*"}),
		TrustedProxies: getEnvSlice("TRUSTED_PROXIES", []string{}),
		LogLevel:       getEnv("LOG_LEVEL", "info"),

		// Database
		MySQLDSN: getEnv("MYSQL_DSN", "root:password@tcp(localhost:3306)/introhub?parseTime=true"),

		// JWT
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key"),
		JWTExpiryHours: jwtExpiryHours,

		// Email
		SMTPHost:      getEnv("SMTP_HOST", "smtp.example.com"),
		SMTPPort:      smtpPort,
		SMTPUsername:  getEnv("SMTP_USERNAME", ""),
		SMTPPassword:  getEnv("SMTP_PASSWORD", ""),
		SMTPFromEmail: getEnv("SMTP_FROM_EMAIL", "noreply@introhub.com"),
		SMTPFromName:  getEnv("SMTP_FROM_NAME", "Intro-Hub"),
	}
}

// Helper function to get environment variable with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// Helper function to get integer environment variable with fallback
func getIntEnv(key string, fallback int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return fallback
}

// Helper function to get slice environment variable with fallback
func getEnvSlice(key string, fallback []string) []string {
	if value, exists := os.LookupEnv(key); exists {
		return []string{value} // For simplicity; in a real app, you might split by comma
	}
	return fallback
}
