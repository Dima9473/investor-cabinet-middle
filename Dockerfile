FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm ci

# Copy the rest of your application files
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
