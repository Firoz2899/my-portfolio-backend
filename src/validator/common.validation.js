import { body, param } from "express-validator";

export const validatePathIntId = (idName) => {
  return [param(idName).isInt().withMessage(`${idName} must be an integer`)]
}

export const validateBodyIntId = (idName) => {
  return [body(idName).isInt().withMessage(`${idName} must be an integer`)]
}

export const validateUniqueCode = (startsWith, idName = "uniqueCode") => [
    param(idName)
        .notEmpty()
        .isBefore(startsWith)
        .withMessage("UniqueCode is required")
];