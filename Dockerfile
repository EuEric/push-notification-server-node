# Use Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g knex

# Copy the rest of the code
COPY . .

# Expose the app port
EXPOSE 3000

WORKDIR /app/src

# Run the migrations and start the app
CMD ["sh", "-c", "knex migrate:latest --knexfile db/knexfile.js && node app.js"]
