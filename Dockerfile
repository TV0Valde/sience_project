# Используем Node.js для сборки frontend
FROM node:18 AS build
WORKDIR /app

# Копируем файлы проекта
COPY . .

# Устанавливаем зависимости и собираем проект
RUN npm install && npm run build


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
 
