# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (or package-lock.json)
COPY package.json package-lock.json ./
RUN npm i

# Copy the rest of the app
COPY . .

# Expose the port (default 3000 for Next.js)
EXPOSE 3000

# Start the app
CMD ["next", "dev"]