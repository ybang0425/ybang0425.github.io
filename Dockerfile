FROM node:16

# Install PHP
RUN apt-get update && apt-get install -y php-cli

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000

# Start both Node.js and PHP server
CMD ["sh", "-c", "php -S 0.0.0.0:8000 & npm start"]
