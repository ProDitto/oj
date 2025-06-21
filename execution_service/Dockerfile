FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o worker ./generic_worker/main.go

FROM alpine:latest

# Enable the community repository and install required tools
RUN sed -i 's#https://dl-cdn.alpinelinux.org/alpine/v[0-9.]*/#https://dl-cdn.alpinelinux.org/alpine/latest-stable/#' /etc/apk/repositories \
    && apk update \
    && apk add --no-cache \
        python3 \
        openjdk17 \
        gcc \
        musl-dev \
        g++ \
        go \
        openjdk17-jdk

# Create non-root user and group
RUN adduser -D appuser && \
    addgroup appuser appuser

# Switch to the non-root user
USER appuser
WORKDIR /home/appuser

COPY --from=builder --chown=appuser:appuser /app/worker ./

CMD ["./worker"]

# commands:
#     build:
#         docker build -t code-eval-worker .
#     run:
#         docker run -d --rm --name worker \
#           -e REDIS_ADDR=your-redis-host:6379 \
#           code-eval-worker
