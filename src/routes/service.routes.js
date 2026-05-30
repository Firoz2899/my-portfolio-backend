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
import {serviceValidation, commonValidation, validate} from '../validator/index.js'
import {UniqueCodePrefixes} from '../constants/constants.js'  

const router = Router();

router.post(
  "/",
  authenticateUser,
  getPortfolioCode,
  serviceValidation.createServiceValidation(),
  validate,
  createService
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Service),
  validate,
  updateService
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Service),
  validate,
  deleteService
);

router.get(
  "/details/:uniqueCode",
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Service),
  validate,
  getServiceByCode
);

router.get(
  "/portfolio-services",
  getPortfolioCode,
  getServicesByPortfolio
);

export default router;