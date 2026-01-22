.PHONY: help dev prod stop clean logs restart

# Couleurs pour les messages
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

help: ## Affiche cette aide
	@echo "$(GREEN)Commandes disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

dev: ## Démarre l'environnement de développement
	@echo "$(GREEN)Démarrage de l'environnement de développement...$(NC)"
	docker compose -f compose.dev.yml up -d --build
	@echo "$(GREEN)✓ Application disponible sur http://localhost$(NC)"

prod: ## Démarre l'environnement de production
	@echo "$(GREEN)Démarrage de l'environnement de production...$(NC)"
	docker compose -f compose.prod.yml up -d --build
	@echo "$(GREEN)✓ Application disponible sur http://localhost$(NC)"

stop: ## Arrête tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	docker compose -f compose.dev.yml down
	docker compose -f compose.prod.yml down
	@echo "$(GREEN)✓ Services arrêtés$(NC)"

clean: ## Arrête et supprime tous les conteneurs, volumes et images
	@echo "$(RED)Nettoyage complet...$(NC)"
	docker compose -f compose.dev.yml down -v --remove-orphans
	docker compose -f compose.prod.yml down -v --remove-orphans
	@echo "$(GREEN)✓ Nettoyage terminé$(NC)"

logs: ## Affiche les logs de tous les services
	docker compose -f compose.dev.yml logs -f

logs-api: ## Affiche les logs de l'API
	docker compose -f compose.dev.yml logs -f api

logs-web: ## Affiche les logs du frontend
	docker compose -f compose.dev.yml logs -f web

logs-nginx: ## Affiche les logs de nginx
	docker compose -f compose.dev.yml logs -f nginx

restart: stop dev ## Redémarre l'environnement de développement

ps: ## Liste les conteneurs en cours d'exécution
	docker compose -f compose.dev.yml ps

shell-api: ## Ouvre un shell dans le conteneur API
	docker compose -f compose.dev.yml exec api bash

shell-web: ## Ouvre un shell dans le conteneur web
	docker compose -f compose.dev.yml exec web sh

shell-db: ## Ouvre un shell PostgreSQL
	docker compose -f compose.dev.yml exec postgres psql -U app_user -d app_db

db-create: ## Crée la base de données
	docker compose -f compose.dev.yml exec api php bin/console doctrine:database:create --if-not-exists
	@echo "$(GREEN)✓ Base de données créée$(NC)"

db-migrate: ## Exécute les migrations
	docker compose -f compose.dev.yml exec api php bin/console doctrine:migrations:migrate --no-interaction
	@echo "$(GREEN)✓ Migrations exécutées$(NC)"

db-reset: ## Réinitialise la base de données
	docker compose -f compose.dev.yml exec api php bin/console doctrine:database:drop --force --if-exists
	docker compose -f compose.dev.yml exec api php bin/console doctrine:database:create
	docker compose -f compose.dev.yml exec api php bin/console doctrine:schema:create
	@echo "$(GREEN)✓ Base de données réinitialisée$(NC)"

cache-clear: ## Vide le cache Symfony
	docker compose -f compose.dev.yml exec api php bin/console cache:clear
	@echo "$(GREEN)✓ Cache vidé$(NC)"

install: ## Installation initiale du projet
	@echo "$(GREEN)Installation du projet...$(NC)"
	@if [ ! -f .env ]; then \
		echo "Création du fichier .env..."; \
		cp .env.example .env 2>/dev/null || echo "COMPOSE_PROJECT_NAME=symfony-react-app\nENVIRONMENT=dev\nPOSTGRES_DB=app_db\nPOSTGRES_USER=app_user\nPOSTGRES_PASSWORD=app_password\nPOSTGRES_PORT=5432\nAPP_ENV=dev\nAPP_SECRET=ChangeThisSecretInProduction\nDATABASE_URL=postgresql://app_user:app_password@postgres:5432/app_db?serverVersion=15&charset=utf8\nNGINX_PORT=80\nAPI_PORT=9000\nWEB_PORT=3000" > .env; \
	fi
	@echo "$(GREEN)Démarrage des services...$(NC)"
	docker compose -f compose.dev.yml up -d --build
	@echo "$(YELLOW)Attente du démarrage de PostgreSQL...$(NC)"
	@sleep 5
	@echo "$(GREEN)Installation des dépendances Symfony...$(NC)"
	docker compose -f compose.dev.yml exec api composer install
	@echo "$(GREEN)Création de la base de données...$(NC)"
	docker compose -f compose.dev.yml exec api php bin/console doctrine:database:create --if-not-exists
	docker compose -f compose.dev.yml exec api php bin/console doctrine:schema:create
	@echo "$(GREEN)✓ Installation terminée!$(NC)"
	@echo "$(GREEN)Application disponible sur http://localhost$(NC)"
