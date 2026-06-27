import { body } from "express-validator";
import { educationLevels } from "#constants/constants.js";

export const createEducationValidation = () => [
	body("EducationLevel")
		.trim()
		.notEmpty()
		.withMessage("Education level is required")
		.isIn(educationLevels)
		.withMessage("Invalid education level"),

	body("Institute").trim().notEmpty().withMessage("Institute name is required"),

	body("Degree").optional().trim(),

	body("SpecializationOfStudy").optional().trim(),

	body("Description").optional().trim(),

	body("StartDate").notEmpty().withMessage("Start date is required"),

	body("EndDate")
		.optional()
		.custom((value, { req }) => {
			if (!value) return true;

			if (new Date(value) < new Date(req.body.StartDate)) {
				throw new Error("End date cannot be earlier than start date");
			}

			return true;
		}),

	body("Marks")
		.optional()
		.isFloat({ min: 0 })
		.withMessage("Marks must be greater than or equal to 0"),

	body("Grade")
		.optional()
		.isFloat({ min: 0, max: 4 })
		.withMessage("Grade must be between 0 and 4"),

	body("Website").optional(),

	body("Address")
		.optional()
		.isObject()
		.withMessage("Address must be an object"),

	body("Address.AddressLine1").optional().trim(),

	body("Address.AddressLine2").optional().trim(),

	body("Address.Country")
		.optional()
		.isObject()
		.withMessage("Country must be an object"),

	body("Address.Country.Name").optional().trim(),

	body("Address.Country.Code").optional().trim(),

	body("Address.Country.PhoneCode").optional().trim(),

	body("Address.Country.Flag").optional().trim(),

	body("Address.Country.Currency").optional().trim(),

	body("Address.State")
		.optional()
		.isObject()
		.withMessage("State must be an object"),

	body("Address.State.Name").optional().trim(),

	body("Address.State.Code").optional().trim(),

	body("Address.State.CountryCode").optional().trim(),

	body("Address.City").optional().trim(),

	body("Address.Pincode").optional().trim(),

	body("Achievements")
		.optional()
		.isArray()
		.withMessage("Achievements must be an array"),

	body("Achievements.*").optional().trim(),
];
