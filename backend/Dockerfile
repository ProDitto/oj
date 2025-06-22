FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o app ./cmd/...

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/app .
RUN mkdir -p /root/migrations
COPY --from=builder /app/migrations/*.sql /root/migrations/

EXPOSE 8080

# Run the app
CMD ["./app"]
