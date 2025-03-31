FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

COPY . .

# Build the application
RUN pnpm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]