# Use the official Node.js image from Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if present) into the container
COPY package*.json ./

# Install the dependencies
RUN npm install
RUN npm install mysql2


# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
