import { Router } from "express";

import {
  createService,
  updateService,
  deleteService,
  getServiceByCode,
  getServicesByPortfolio
} from "../controllers/service.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getPortfolioCode } from "../middlewares/portfolioCode.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  getPortfolioCode,
  createService
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  updateService
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  deleteService
);

router.get(
  "/details/:uniqueCode",
  getPortfolioCode,
  getServiceByCode
);

router.get(
  "/portfolio-services",
  getPortfolioCode,
  getServicesByPortfolio
);

export default router;