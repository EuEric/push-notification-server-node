# Use Node.js image
FROM node:18

# Copy package.json and package-lock.json
COPY package*.json .

# Copy the app code
COPY src/ .

# Install dependencies
RUN npm install

# Expose the app port
EXPOSE 3000

# Set the working directory
WORKDIR /src

#TODO: fix environment to production

# Run the migrations during build
RUN knex migrate:latest --knexfile ./db/knexfile.js

# Start the app
CMD ["node", "app.js"]
