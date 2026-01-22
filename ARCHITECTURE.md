# 🏗️ Architecture du Projet

## 📊 Vue d'Ensemble

Ce projet est une application fullstack moderne utilisant une architecture séparée entre le backend (API) et le frontend (SPA), avec Nginx comme reverse proxy.

```
                                 ┌─────────────────┐
                                 │   NAVIGATEUR    │
                                 └────────┬────────┘
                                          │
                                    HTTP  │  Port 80
                                          │
                                 ┌────────▼────────┐
                                 │     NGINX       │
                                 │ Reverse Proxy   │
                                 └────┬────────┬───┘
                                      │        │
                      /api/*          │        │  /*
                                      │        │
                         ┌────────────▼─┐    ┌─▼────────────┐
                         │  SYMFONY API │    │  REACT SPA   │
                         │  PHP 8.2     │    │  Vite/Node   │
                         └──────┬───────┘    └──────────────┘
                                │
                         ┌──────▼───────┐
                         │  POSTGRESQL  │
                         │   Database   │
                         └──────────────┘
```

## 🔄 Flux de Requêtes

### 1. Requêtes Frontend (/, /about, etc.)

```
Navigateur → Nginx (port 80) → React App
```

- En **dev** : Nginx proxy vers Vite dev server (port 3000) avec HMR
- En **prod** : Nginx sert les fichiers statiques buildés

### 2. Requêtes API (/api/*)

```
Navigateur → Nginx (port 80) → PHP-FPM (port 9000) → Symfony
                                         ↓
                                   PostgreSQL (port 5432)
```

Nginx supprime le préfixe `/api` et route vers Symfony.

## 📁 Structure Détaillée

```
my-project/
│
├── api/                              # Backend Symfony
│   ├── bin/
│   │   └── console                   # Console Symfony
│   ├── config/
│   │   ├── packages/                 # Config des bundles
│   │   │   ├── doctrine.yaml
│   │   │   ├── framework.yaml
│   │   │   └── routing.yaml
│   │   ├── bundles.php               # Bundles activés
│   │   ├── services.yaml             # Container de services
│   │   └── routes.yaml               # Routes principales
│   ├── migrations/                   # Migrations Doctrine
│   ├── public/
│   │   └── index.php                 # Point d'entrée
│   ├── src/
│   │   ├── Controller/               # Contrôleurs API
│   │   │   └── HealthController.php
│   │   ├── Entity/                   # Entités Doctrine
│   │   │   └── User.php
│   │   ├── Repository/               # Repositories
│   │   │   └── UserRepository.php
│   │   ├── Service/                  # Services métier
│   │   └── Kernel.php                # Kernel Symfony
│   ├── var/                          # Cache et logs
│   ├── vendor/                       # Dépendances Composer
│   ├── composer.json                 # Dépendances PHP
│   ├── Dockerfile                    # Image prod
│   └── Dockerfile.dev                # Image dev
│
├── web/                              # Frontend React
│   ├── public/
│   │   └── vite.svg                  # Assets publics
│   ├── src/
│   │   ├── components/               # Composants réutilisables
│   │   ├── pages/                    # Pages de l'app
│   │   ├── services/
│   │   │   └── api.js                # Client API
│   │   ├── App.jsx                   # Composant principal
│   │   ├── App.css                   # Styles de l'app
│   │   ├── main.jsx                  # Point d'entrée
│   │   └── index.css                 # Styles globaux
│   ├── node_modules/                 # Dépendances NPM
│   ├── index.html                    # Template HTML
│   ├── package.json                  # Dépendances Node
│   ├── vite.config.js                # Config Vite
│   ├── Dockerfile                    # Image prod (build + nginx)
│   └── Dockerfile.dev                # Image dev (Vite)
│
├── nginx/
│   ├── nginx.dev.conf                # Config dev (proxy Vite)
│   ├── nginx.prod.conf               # Config prod (fichiers statiques)
│   └── Dockerfile                    # Image Nginx
│
├── docker/
│   └── php/
│       └── php.ini                   # Config PHP
│
├── compose.dev.yml                   # Docker Compose dev
├── compose.prod.yml                  # Docker Compose prod
├── Makefile                          # Commandes utiles
├── .gitignore                        # Fichiers ignorés par Git
├── .dockerignore                     # Fichiers ignorés par Docker
├── env.example                       # Template des variables d'env
├── README.md                         # Documentation principale
├── SETUP.md                          # Guide d'installation
├── ARCHITECTURE.md                   # Ce fichier
├── CONTRIBUTING.md                   # Guide de contribution
└── LICENSE                           # Licence MIT
```

## 🎯 Séparation des Responsabilités

### Backend (Symfony)

**Responsabilité** : API REST, logique métier, accès aux données

- **Controller** : Gère les requêtes HTTP, valide l'input, retourne les réponses
- **Service** : Contient la logique métier
- **Repository** : Accès aux données (Doctrine)
- **Entity** : Modèles de données

**Communication** : JSON via HTTP

### Frontend (React)

**Responsabilité** : Interface utilisateur, expérience utilisateur

- **Pages** : Vues complètes de l'application
- **Components** : Composants réutilisables
- **Services** : Communication avec l'API

**Communication** : Appels HTTP vers `/api`

### Nginx

**Responsabilité** : Reverse proxy, routage, fichiers statiques

- Route `/api/*` → Symfony (PHP-FPM)
- Route `/*` → React (Vite dev server ou fichiers buildés)
- Gère les WebSockets pour le HMR en dev
- Sert les fichiers statiques en prod

### PostgreSQL

**Responsabilité** : Persistance des données

- Stockage relationnel
- Transactions ACID
- Accédé uniquement par Symfony

## 🔐 Sécurité

### Couches de Sécurité

1. **Nginx** : Headers de sécurité, rate limiting possible
2. **Symfony** : Validation des inputs, protection CSRF, gestion des sessions
3. **PostgreSQL** : Isolation des données, requêtes paramétrées (Doctrine)

### Variables Sensibles

Stockées dans `.env` (non versionné) :
- `APP_SECRET` : Clé de chiffrement Symfony
- `DATABASE_URL` : Credentials de la base de données
- Autres secrets API

## 📊 Environnements

### Développement

- **Hot Reload** : Vite HMR + Symfony cache désactivé
- **Volumes** : Code monté depuis l'hôte
- **Debug** : Activé
- **Ports exposés** : PostgreSQL accessible depuis l'hôte

### Production

- **Build optimisé** : React compilé, cache Symfony optimisé
- **Pas de volumes** : Code copié dans les images
- **Debug** : Désactivé
- **Ports minimaux** : Seulement nginx exposé

## 🔄 Cycle de Développement

### 1. Modification Backend

```
Éditer api/src/ → Symfony recharge automatiquement → Test via /api
```

### 2. Modification Frontend

```
Éditer web/src/ → Vite HMR → Navigateur se met à jour
```

### 3. Ajout d'Entité

```bash
make shell-api
php bin/console make:entity
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

### 4. Ajout de Route API

1. Créer le contrôleur dans `api/src/Controller/`
2. Ajouter la route avec l'attribut `#[Route('/api/...')]`
3. Implémenter la logique
4. Appeler depuis React via `services/api.js`

## 🚀 Déploiement

### Pipeline Recommandé

```
1. Tests automatisés (CI)
2. Build des images Docker
3. Push vers registry
4. Pull sur serveur de production
5. docker compose -f compose.prod.yml up -d
6. Migrations de DB
7. Health checks
```

## 📈 Scalabilité

### Options de Scaling

1. **Horizontal** : Plusieurs instances de Symfony derrière un load balancer
2. **Cache** : Redis pour sessions et cache Symfony
3. **CDN** : Pour les assets statiques React
4. **DB** : PostgreSQL avec réplication read/write

### Points d'Extension

- **Cache** : Ajouter Redis dans docker-compose
- **Queue** : RabbitMQ ou Redis pour jobs asynchrones
- **Elasticsearch** : Pour la recherche
- **Monitoring** : Prometheus + Grafana

## 🔧 Maintenance

### Logs

```bash
# Tous les services
make logs

# Service spécifique
make logs-api
make logs-nginx
```

### Backups

```bash
# Base de données
docker compose -f compose.prod.yml exec postgres \
  pg_dump -U app_user app_db > backup_$(date +%Y%m%d).sql
```

### Mises à jour

```bash
# Backend
docker compose -f compose.dev.yml exec api composer update

# Frontend
docker compose -f compose.dev.yml exec web npm update
```

## 📚 Références

- [Symfony Best Practices](https://symfony.com/doc/current/best_practices.html)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Cette architecture permet une séparation claire des responsabilités, une scalabilité horizontale, et un développement efficace. 🚀**
