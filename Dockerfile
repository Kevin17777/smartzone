FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build
EXPOSE 3001
CMD ["npm", "start"]
