# Базовий образ
FROM node:20-alpine

# Робоча папка всередині контейнера
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь інший код проекту (src, server і т.д.)
COPY . .

# Вказуємо порт
ENV PORT=5000
EXPOSE 5000

# Запускаємо сервер (шлях від кореня /app)
CMD ["node", "server/server.js"]