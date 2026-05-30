import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';
import { handleError } from "./src/middlewares/handleError.middleware.js";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./src/swagger_document.config.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//#region basic app Middelware
app.use(express.json({limit: "16kb"}));
app.use(cors({origin: "*", credentials: true}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, './public')));
app.use(cookieParser());
//#endregion

//#region Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Portfolio apis docs",
  })
);
//#endregion

//#region Routes
import * as routes from './src/routes/index.js';

app.use("/api/v1/auth", routes.authRoutes);
app.use("/api/v1/skills", routes.skillRoutes);
app.use("/api/v1/experiences", routes.experienceRoutes);
app.use("/api/v1/services", routes.serviceRoutes);
app.use("/api/v1/projects", routes.projectRoutes);
app.use("/api/v1/slugs", routes.slugRoutes);
app.use("/api/v1/portfolios", routes.portfolioRoutes);
app.use("/api/v1/settings", routes.settingRoutes);
//#endregion

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling MiddleWare
app.use(handleError);

export default app;
