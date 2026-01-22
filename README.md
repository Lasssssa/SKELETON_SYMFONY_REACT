# 🚀 Symfony React Fullstack Application

Une application fullstack moderne avec **Symfony API**, **React Frontend**, **PostgreSQL** et **Nginx**, orchestrée avec **Docker Compose**.

## 📁 Architecture du Projet

```
.
├── api/                    # Backend Symfony (API REST)
│   ├── src/
│   │   ├── Controller/     # Contrôleurs API
│   │   ├── Entity/         # Entités Doctrine
│   │   └── Repository/     # Repositories Doctrine
│   ├── config/             # Configuration Symfony
│   ├── public/             # Point d'entrée public
│   ├── Dockerfile          # Image production
│   └── Dockerfile.dev      # Image développement
│
├── web/                    # Frontend React
│   ├── src/
│   │   ├── services/       # Services API
│   │   ├── App.jsx         # Composant principal
│   │   └── main.jsx        # Point d'entrée
│   ├── Dockerfile          # Image production (build + nginx)
│   └── Dockerfile.dev      # Image développement (Vite)
│
├── nginx/                  # Reverse Proxy
│   ├── nginx.dev.conf      # Config développement
│   ├── nginx.prod.conf     # Config production
│   └── Dockerfile          # Image Nginx
│
├── compose.dev.yml         # Docker Compose développement
├── compose.prod.yml        # Docker Compose production
└── README.md               # Ce fichier
```

## 🎯 Services et Ports

### Développement

| Service   | Description          | Port interne | Port exposé |
|-----------|---------------------|--------------|-------------|
| nginx     | Reverse Proxy       | 80           | 80          |
| api       | Symfony API         | 9000         | -           |
| web       | React (Vite)        | 3000         | -           |
| postgres  | PostgreSQL          | 5432         | 5432        |

### Production

| Service   | Description          | Port interne | Port exposé |
|-----------|---------------------|--------------|-------------|
| nginx     | Reverse Proxy       | 80           | 80          |
| api       | Symfony API         | 9000         | -           |
| web       | React (build)       | -            | -           |
| postgres  | PostgreSQL          | 5432         | -           |

## 🔧 Prérequis

- **Docker** (≥ 20.10)
- **Docker Compose** (≥ 2.0)
- **Git**

## 🚀 Démarrage Rapide

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd <nom-du-projet>
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine :

```bash
# General
COMPOSE_PROJECT_NAME=symfony-react-app
ENVIRONMENT=dev

# Database
POSTGRES_DB=app_db
POSTGRES_USER=app_user
POSTGRES_PASSWORD=app_password
POSTGRES_PORT=5432

# Symfony
APP_ENV=dev
APP_SECRET=ChangeThisSecretInProduction
DATABASE_URL=postgresql://app_user:app_password@postgres:5432/app_db?serverVersion=15&charset=utf8

# Ports
NGINX_PORT=80
API_PORT=9000
WEB_PORT=3000
```

### 3. Lancement en mode développement

```bash
# Construire et démarrer tous les services
docker compose -f compose.dev.yml up --build

# Ou en arrière-plan
docker compose -f compose.dev.yml up -d --build
```

### 4. Initialiser la base de données

Dans un nouveau terminal :

```bash
# Entrer dans le conteneur Symfony
docker compose -f compose.dev.yml exec api bash

# Créer la base de données
php bin/console doctrine:database:create

# Créer les tables
php bin/console doctrine:schema:create

# Ou utiliser les migrations (recommandé)
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

### 5. Accéder à l'application

- **Frontend** : http://localhost
- **API Health Check** : http://localhost/api/health
- **PostgreSQL** : localhost:5432

## 🏭 Déploiement en Production

### 1. Préparer les variables d'environnement

Modifiez le fichier `.env` avec des valeurs sécurisées :

```bash
APP_ENV=prod
APP_SECRET=VotreSecretSecuriseEtAleatoire
DATABASE_URL=postgresql://prod_user:prod_password@postgres:5432/prod_db?serverVersion=15&charset=utf8
NGINX_PORT=80
```

### 2. Lancer en mode production

```bash
# Construire et démarrer
docker compose -f compose.prod.yml up -d --build

# Initialiser la base de données
docker compose -f compose.prod.yml exec api php bin/console doctrine:migrations:migrate --no-interaction
```

## 🛠️ Commandes Utiles

### Docker

```bash
# Arrêter les services
docker compose -f compose.dev.yml down

# Arrêter et supprimer les volumes
docker compose -f compose.dev.yml down -v

# Voir les logs
docker compose -f compose.dev.yml logs -f

# Logs d'un service spécifique
docker compose -f compose.dev.yml logs -f api

# Reconstruire un service
docker compose -f compose.dev.yml up -d --build api
```

### Symfony

```bash
# Entrer dans le conteneur
docker compose -f compose.dev.yml exec api bash

# Créer une entité
docker compose -f compose.dev.yml exec api php bin/console make:entity

# Créer un contrôleur
docker compose -f compose.dev.yml exec api php bin/console make:controller

# Créer une migration
docker compose -f compose.dev.yml exec api php bin/console make:migration

# Exécuter les migrations
docker compose -f compose.dev.yml exec api php bin/console doctrine:migrations:migrate

# Vider le cache
docker compose -f compose.dev.yml exec api php bin/console cache:clear
```

### React

```bash
# Entrer dans le conteneur
docker compose -f compose.dev.yml exec web sh

# Installer une dépendance
docker compose -f compose.dev.yml exec web npm install <package>

# Build de production (local)
cd web && npm run build
```

## 📝 Développement

### Backend (Symfony)

#### Créer une nouvelle route API

```php
// api/src/Controller/UserController.php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/api/users', name: 'api_users', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json([
            'users' => []
        ]);
    }
}
```

### Frontend (React)

#### Appeler l'API

```javascript
// web/src/services/api.js
export async function getUsers() {
  return apiCall('/users')
}

// web/src/App.jsx
import { getUsers } from './services/api'

const users = await getUsers()
```

## 🔐 Sécurité

### Bonnes pratiques

1. **Ne jamais commiter le fichier `.env`** avec des secrets réels
2. **Changer `APP_SECRET`** en production
3. **Utiliser des mots de passe forts** pour PostgreSQL
4. **Activer HTTPS** en production (nginx + certbot)
5. **Limiter les ports exposés** en production

### Headers de sécurité (production)

Les headers suivants sont automatiquement ajoutés en production :
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

## 🐛 Troubleshooting

### Le frontend ne se connecte pas à l'API

- Vérifiez que nginx est bien démarré : `docker compose -f compose.dev.yml ps`
- Consultez les logs nginx : `docker compose -f compose.dev.yml logs nginx`
- Testez directement l'API : `curl http://localhost/api/health`

### Erreur de connexion à PostgreSQL

- Vérifiez que le service est démarré : `docker compose -f compose.dev.yml ps postgres`
- Vérifiez les variables d'environnement dans `.env`
- Attendez que le healthcheck soit OK

### Hot reload ne fonctionne pas (React)

- Vérifiez les volumes dans `compose.dev.yml`
- Redémarrez le service : `docker compose -f compose.dev.yml restart web`

### Composer ou npm install échoue

- Supprimez les volumes et recommencez :
  ```bash
  docker compose -f compose.dev.yml down -v
  docker compose -f compose.dev.yml up --build
  ```

## 📚 Technologies Utilisées

- **Backend** : Symfony 7.0, PHP 8.2, Doctrine ORM
- **Frontend** : React 18, Vite 5
- **Base de données** : PostgreSQL 15
- **Reverse Proxy** : Nginx (Alpine)
- **Orchestration** : Docker Compose

## 📖 Documentation

- [Symfony Documentation](https://symfony.com/doc/current/index.html)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Bon développement ! 🚀**
