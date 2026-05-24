import { param } from "express-validator";

export const updateDefaultPortfolioValidation = () => [
    param("portfolioCode")
        .notEmpty()
        .withMessage("Portfolio code is required")
];