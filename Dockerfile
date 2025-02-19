# Use official Node.js image from Docker Hub
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application to the container
COPY . .

# Expose the port your app will run on (e.g., 3000 for a typical Node.js app)
EXPOSE 4123

# Command to run your app
CMD ["npm", "start"]
