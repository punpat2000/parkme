# Docker Development Setup

This project is configured to run in Docker for development with IntelliSense support.

## Prerequisites

- Docker and Docker Compose installed
- **No need to install node_modules on your host** - the container handles it!

## Quick Start

1. **Start the development server**:
   ```bash
   docker-compose up
   ```

   The container will automatically:
   - Build the image (if needed)
   - Install dependencies into `node_modules` (if empty)
   - Start the Angular dev server

2. **Access the application**:
   - Open http://localhost:4200 in your browser

## How It Works

- **Source code** is mounted as volumes, so changes on your host machine are immediately reflected in the container
- **node_modules** are installed in the container and mounted to your host, so your IDE can access them for IntelliSense
- The container automatically installs dependencies on first run if `node_modules` is empty
- The Angular dev server runs inside Docker and watches for file changes

## Commands

- Start: `docker-compose up`
- Start in background: `docker-compose up -d`
- Stop: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild container: `docker-compose build`
- Execute commands in container: `docker-compose exec app <command>`

## IntelliSense Setup

IntelliSense should work automatically! The container installs `node_modules` directly into the mounted volume on your host, so your IDE can access all type definitions immediately.

If IntelliSense doesn't work:
1. Make sure the container has started and installed dependencies (check logs)
2. Ensure `node_modules` directory exists and has content
3. Restart your IDE/TypeScript server

## Troubleshooting

- If IntelliSense doesn't work, ensure the container has installed dependencies (check `docker-compose logs`)
- If the dev server doesn't start, check logs with `docker-compose logs`
- To rebuild after dependency changes: `docker-compose build --no-cache && docker-compose up`
- To force reinstall dependencies: `rm -rf node_modules && docker-compose up`