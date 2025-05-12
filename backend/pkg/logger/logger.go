package logger

import (
	"os"
	"strings"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// Logger is a wrapper around zerolog.Logger
type Logger struct {
	logger zerolog.Logger
}

// NewLogger creates a new logger with the specified log level
func NewLogger(level string) *Logger {
	// Set up pretty console logging for development
	output := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: "2006-01-02 15:04:05"}

	// Set log level
	var logLevel zerolog.Level
	switch strings.ToLower(level) {
	case "debug":
		logLevel = zerolog.DebugLevel
	case "info":
		logLevel = zerolog.InfoLevel
	case "warn":
		logLevel = zerolog.WarnLevel
	case "error":
		logLevel = zerolog.ErrorLevel
	case "fatal":
		logLevel = zerolog.FatalLevel
	default:
		logLevel = zerolog.InfoLevel
	}

	// Configure zerolog
	zerolog.SetGlobalLevel(logLevel)
	l := log.Output(output).With().Timestamp().Logger()

	return &Logger{
		logger: l,
	}
}

// Debug logs a debug message
func (l *Logger) Debug(msg string, args ...interface{}) {
	l.logger.Debug().Fields(argsToMap(args)).Msg(msg)
}

// Info logs an info message
func (l *Logger) Info(msg string, args ...interface{}) {
	l.logger.Info().Fields(argsToMap(args)).Msg(msg)
}

// Warn logs a warning message
func (l *Logger) Warn(msg string, args ...interface{}) {
	l.logger.Warn().Fields(argsToMap(args)).Msg(msg)
}

// Error logs an error message
func (l *Logger) Error(msg string, args ...interface{}) {
	l.logger.Error().Fields(argsToMap(args)).Msg(msg)
}

// Fatal logs a fatal message and terminates the application
func (l *Logger) Fatal(msg string, args ...interface{}) {
	l.logger.Fatal().Fields(argsToMap(args)).Msg(msg)
}

// Helper function to convert a slice of key-value pairs to a map
func argsToMap(args []interface{}) map[string]interface{} {
	if len(args) == 0 {
		return nil
	}

	if len(args)%2 != 0 {
		// If the number of arguments is odd, add a placeholder for the last value
		args = append(args, "(missing)")
	}

	result := make(map[string]interface{}, len(args)/2)
	for i := 0; i < len(args); i += 2 {
		key, ok := args[i].(string)
		if !ok {
			key = "unknown"
		}
		result[key] = args[i+1]
	}

	return result
}
