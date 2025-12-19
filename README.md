## API Документація

Проект реалізує RESTful API згідно зі специфікацією OpenAPI 3.0.

📄 **Повний контракт:** [openapi.yaml](docs/api/openapi.yaml)

### Попередній перегляд:
![Swagger UI Preview](docs/api/swagger_screenshot.png)

## 🐳 Запуск через Docker

### 1. Збірка образу

docker build -t expense-tracker-api .

### 2. Запуск контейнера

docker run -d -p 5000:5000 --name expense-container --rm expense-tracker-api

### 3. Зупинка контейнера

docker stop expense-container