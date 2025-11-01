FROM node:20-slim

# Install system dependencies required for pdf-lib and sharp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV GOTENBERG_URL=http://gotenberg:3000

# Start the application
CMD ["npm", "run", "start"]
