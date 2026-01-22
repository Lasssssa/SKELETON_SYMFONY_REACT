# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet !

## 📋 Prérequis

- Docker et Docker Compose installés
- Git
- Connaissance de Symfony et React

## 🔧 Configuration de l'Environnement de Développement

1. Forkez le projet
2. Clonez votre fork :
   ```bash
   git clone https://github.com/votre-username/nom-du-projet.git
   cd nom-du-projet
   ```

3. Créez votre fichier `.env` :
   ```bash
   cp env.example .env
   ```

4. Démarrez l'environnement :
   ```bash
   make install
   # ou
   docker compose -f compose.dev.yml up --build
   ```

## 🌿 Workflow Git

### Branches

- `main` : branche de production stable
- `develop` : branche de développement
- `feature/*` : nouvelles fonctionnalités
- `fix/*` : corrections de bugs
- `hotfix/*` : corrections urgentes

### Créer une nouvelle fonctionnalité

```bash
# Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/ma-nouvelle-fonctionnalite

# Développer et commiter
git add .
git commit -m "feat: description de la fonctionnalité"

# Pusher et créer une Pull Request
git push origin feature/ma-nouvelle-fonctionnalite
```

## 📝 Convention de Commits

Nous utilisons la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgules manquants, etc.
- `refactor:` refactoring du code
- `test:` ajout ou modification de tests
- `chore:` tâches de maintenance

### Exemples

```bash
feat: ajouter l'authentification JWT
fix: corriger l'erreur de validation du formulaire
docs: mettre à jour le README avec les nouvelles instructions
refactor: extraire la logique métier dans un service
```

## 🧪 Tests

### Backend (Symfony)

```bash
# Lancer les tests
docker compose -f compose.dev.yml exec api php bin/phpunit

# Tests avec couverture
docker compose -f compose.dev.yml exec api php bin/phpunit --coverage-html coverage
```

### Frontend (React)

```bash
# Lancer les tests
docker compose -f compose.dev.yml exec web npm test

# Tests en mode watch
docker compose -f compose.dev.yml exec web npm test -- --watch
```

## 🎨 Standards de Code

### Backend (PHP/Symfony)

- Suivre les [PSR-12](https://www.php-fig.org/psr/psr-12/) standards
- Utiliser PHP-CS-Fixer :
  ```bash
  docker compose -f compose.dev.yml exec api vendor/bin/php-cs-fixer fix
  ```

### Frontend (JavaScript/React)

- Suivre les standards ESLint
- Utiliser Prettier pour le formatage :
  ```bash
  docker compose -f compose.dev.yml exec web npm run format
  ```

## 🔍 Checklist avant de Soumettre

- [ ] Le code compile sans erreurs
- [ ] Les tests passent
- [ ] Le code suit les standards de style
- [ ] La documentation est mise à jour
- [ ] Les commits suivent la convention
- [ ] La PR a une description claire

---