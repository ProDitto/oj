
POSTGRES_SERVICE = online_judge_db

up:
	docker-compose up -d $(POSTGRES_SERVICE)

down:
	docker-compose down -v

.PHONY: up down