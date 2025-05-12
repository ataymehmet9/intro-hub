# Build stage
FROM golang:1.18-alpine AS build

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o intro-hub ./cmd/api

# Final stage
FROM alpine:3.15

# Set working directory
WORKDIR /app

# Install CA certificates
RUN apk --no-cache add ca-certificates

# Copy the binary from the build stage
COPY --from=build /app/intro-hub .

# Copy email templates
COPY --from=build /app/internal/email/templates ./internal/email/templates

# Expose port
EXPOSE 8080

# Run the application
CMD ["./intro-hub"]