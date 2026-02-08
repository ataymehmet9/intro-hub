# Docker Setup Documentation

This document provides instructions for running the Intro Hub application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose V2 or higher

## Architecture

The Docker setup consists of two services:

1. **PostgreSQL Database** - PostgreSQL 16 Alpine for data persistence
2. **Application** - Node.js 20 Alpine running the Intro Hub application

## Quick Start

### 1. Environment Configuration

Create a `.env.local` file in the project root with your environment variables:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=introhub
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=3000
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/introhub

# Better Auth Configuration (if applicable)
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=1234123
```

### 2. Start the Services

Build and start all services:

```bash
docker-compose up -d
```

This will:

- Pull the PostgreSQL image
- Build the application Docker image
- Start both services
- Create a persistent volume for the database

### 3. View Logs

To view application logs:

```bash
docker-compose logs -f app
```

To view database logs:

```bash
docker-compose logs -f postgres
```

### 4. Access the Application

Once the services are running:

- Application: http://localhost:3000
- PostgreSQL: localhost:5432

## Database Migrations

Run database migrations after the containers are up:

```bash
# Execute migration inside the container
docker-compose exec app npm run db:migrate

# Or push schema changes
docker-compose exec app npm run db:push
```

## Common Commands

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This will delete all data)

```bash
docker-compose down -v
```

### Rebuild Application

If you make code changes:

```bash
docker-compose up -d --build app
```

### Access PostgreSQL CLI

```bash
docker-compose exec postgres psql -U postgres -d introhub
```

### Execute Commands in App Container

```bash
docker-compose exec app sh
```

### View Container Status

```bash
docker-compose ps
```

## Troubleshooting

### Database Connection Issues

If the application can't connect to the database:

1. Check if PostgreSQL is healthy:

   ```bash
   docker-compose ps postgres
   ```

2. Verify the DATABASE_URL environment variable matches your configuration

3. Ensure the database service is fully started before the app:
   ```bash
   docker-compose restart app
   ```

### Port Conflicts

If ports 3000 or 5432 are already in use, modify the `.env.local` file:

```env
APP_PORT=3001
POSTGRES_PORT=5433
```

Then restart the services:

```bash
docker-compose down
docker-compose up -d
```

### Build Failures

If the Docker build fails:

1. Clear Docker cache:

   ```bash
   docker-compose build --no-cache
   ```

2. Check Docker logs for specific errors:
   ```bash
   docker-compose logs app
   ```

### Database Persistence

Database data is stored in a Docker volume named `intro-hub_postgres_data`. To backup:

```bash
docker-compose exec postgres pg_dump -U postgres introhub > backup.sql
```

To restore:

```bash
docker-compose exec -T postgres psql -U postgres introhub < backup.sql
```

## Production Considerations

For production deployments:

1. **Use secrets management** - Don't commit `.env.local` files
2. **Set strong passwords** - Use complex passwords for POSTGRES_PASSWORD
3. **Configure resource limits** - Add memory and CPU limits to docker-compose.yml
4. **Enable SSL** - Configure PostgreSQL to use SSL connections
5. **Regular backups** - Implement automated database backup strategy
6. **Monitoring** - Add health checks and monitoring solutions
7. **Reverse proxy** - Use nginx or traefik for SSL termination

## Docker Compose Configuration

### Environment Variables

| Variable          | Default  | Description         |
| ----------------- | -------- | ------------------- |
| POSTGRES_USER     | postgres | PostgreSQL username |
| POSTGRES_PASSWORD | postgres | PostgreSQL password |
| POSTGRES_DB       | introhub | Database name       |
| POSTGRES_PORT     | 5432     | PostgreSQL port     |
| APP_PORT          | 3000     | Application port    |

### Volumes

- `postgres_data` - Persistent storage for PostgreSQL data

### Networks

- `intro-hub-network` - Bridge network for service communication

## Health Checks

Both services include health checks:

- **PostgreSQL**: Checks if the database is ready to accept connections
- **Application**: HTTP health check on port 3000

## Development vs Production

This Docker setup is optimized for production with:

- Multi-stage builds for smaller image size
- Production-only dependencies
- Health checks
- Restart policies

For development, continue using:

```bash
npm run dev
```

## Support

For issues or questions:

1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure Docker and Docker Compose are up to date
