# Stage 1: Build stage
FROM python:3.9-slim as builder

WORKDIR /app

COPY requirements.txt .

# Install dependencies in a temporary location
RUN pip install --upgrade pip \
    && pip install --prefix=/install -r requirements.txt

# Stage 2: Final image
FROM python:3.9-slim as petback

WORKDIR /app/petback

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy app source code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
