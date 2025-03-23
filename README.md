# WebMappingAPI

# Application NodeJS

## Description
Cette application node.js et express.js permet l'authentification des utilisateurs avec un système d'inscription et de connexion sécurisé. Elle utilise **Postgresql** comme sgbd et **sequelize** pour la gestion des modèles.


## 📋 Prérequis

- Node.js (version 22.12.0+)
- npm (version 10.9.0)

## 🛠️ Installation

### Clonage du Projet

```bash
git clone https://github.com/webMappingGabX/webMappingAPI.git
cd webMappingAPI
```

### Installation des Dépendances

```bash
npm install
```

## 🔧 Configuration

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez les variables d'environnement suivantes :

```
JWT_SECRET=your_jwt_secret

# Configuration de la base de données
DB_USER=your_postgresql_user
DB_HOST=your_postgresql_host
DB_NAME=your_db_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432

DEFAULT_DB_NAME=postgres

PORT=your_application_port

NODE_ENV=development
```

## 🚦 Démarrage de l'Application

### Développement

```bash
npm run dev
```

### Production

```bash
npm start
```

## 📡 Points de Terminaison API

### Authentification

- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/logout` - Déconnexion

### Ressources

- `GET /api/v1/static` - Liste des ressources
- `GET /api/v1/uploads` - Liste des uploadées

## 🧪 Tests

```bash
npm test
```

## 🔒 Sécurité

- Authentification par JWT
- Validation des entrées
- Protection contre les attaques CSRF et XSS

## 📦 Dépendances Principales

- Express.js
- bcrypt
- jsonwebtoken
- dotenv
- cors
- multer

## 📝 Structure du Projet

```
app/
│
├── controllers/
├── middleware/
├── models/
├── resources/
│   ├── geojson/  
├── routes/
├── uploads/
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📜 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## 📞 Contact

Mac Dallas - [roylexstephane@gmail.com]

Lien du Projet: [https://github.com/webMappingGabX/webMappingAPI.git](https://github.com/MacDallas123/blokusGameApi)