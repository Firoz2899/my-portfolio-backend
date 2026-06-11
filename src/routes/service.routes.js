import { Router } from "express";

import {
  createService,
  updateService,
  deleteService,
  getServiceByCode,
  getServicesByProfile
} from "#controllers/service.controller.js";

import { authenticateUser } from "#middlewares/auth.middleware.js";
import { getProfileCode } from "#middlewares/profileCode.middleware.js";
import {serviceValidation, commonValidation, validate} from '#validator/index.js'
import {UniqueCodePrefixes} from '#constants/constants.js'  

const router = Router();

router.post(
  "/",
  authenticateUser,
  getProfileCode,
  serviceValidation.createServiceValidation(),
  validate,
  createService
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Service),
  validate,
  updateService
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Service),
  validate,
  deleteService
);

router.get(
  "/details/:uniqueCode",
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Service),
  validate,
  getServiceByCode
);

router.get(
  "/profile-services",
  getProfileCode,
  getServicesByProfile
);

export default router;