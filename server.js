const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/user");
const geodatasRoutes = require("./routes/geojson");
const workspaceRoutes = require("./routes/workspace");
const layerRoutes = require("./routes/layer");
const db = require("./db");
const sequelize = require("./sequelize");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: '*',  // Autoriser toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// create App Database if not exists
const dbname = process.env.DB_NAME;// || "gabx";
(async function(){
  await db.createDb(dbname);

  // Synchroniser les modèles avec la base de données
  //sequelize.sync({ force: true })
  sequelize.sync({ alter: true })
  .then(async () => {
    console.log("Les tables ont été synchronisées");
  })
  .catch((err) => console.log("Erreur : " + err));
  
  // Start of any route
  let routeHead = "/api/v1";

  // Routes
  app.use(`${routeHead}/auth`, authRoutes);

  app.use(`${routeHead}/users`, userRoutes);

  app.use(`${routeHead}/geodatas`, geodatasRoutes);
  app.use(`${routeHead}/workspaces`, workspaceRoutes);
  app.use(`${routeHead}/layers`, layerRoutes);

  // share resources via any route
  app.use(`${routeHead}/static`, express.static(path.join(__dirname, "resources/geojson")));
  app.use(`${routeHead}/uploads`, express.static("uploads"));
  //console.log(path.join(__dirname, "resources/tiles/Mapnik"));

  app.listen(port, () => {
    console.log(`L'API est disponible via http://localhost:${port}`);
  });
})();

// Synchroniser les modèles avec la base de données
/*sequelize.sync({alter: true})
.then(async () => {
  console.log("Les tables ont été synchronisées");
})
.catch((err) => console.log("Erreur : " + err));*/