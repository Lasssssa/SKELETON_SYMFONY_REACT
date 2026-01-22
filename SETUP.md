# 🚀 Guide de Configuration

## 🔧 Configuration Avancée

### Personnaliser les ports

Modifiez le fichier `.env` :

```bash
NGINX_PORT=8080      # Changer le port nginx
POSTGRES_PORT=5433   # Changer le port postgres
```

Puis redémarrez :

```bash
docker compose -f compose.dev.yml down
docker compose -f compose.dev.yml up -d
```

### Ajouter des variables d'environnement Symfony

Éditez `api/.env` ou créez `api/.env.local` :

```bash
# api/.env.local
APP_ENV=dev
APP_DEBUG=1
DATABASE_URL=postgresql://app_user:app_password@postgres:5432/app_db
MAILER_DSN=smtp://localhost
```

### Configurer CORS (si nécessaire)

Si vous devez autoriser des requêtes cross-origin :

```bash
# Installer le bundle CORS
docker compose -f compose.dev.yml exec api composer require nelmio/cors-bundle
```

Configurez dans `api/config/packages/nelmio_cors.yaml` :

```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['*']
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['*']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/api/': ~
```
