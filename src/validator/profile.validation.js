import { body, param } from "express-validator";
import {LanguageLevel} from '#constants/constants.js'

export const updateProfileValidation = () => [

    body("FirstName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("FirstName cannot be empty"),

    body("LastName")
        .optional()
        .trim(),

    body("FullName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("FullName cannot be empty"),

    body("Email")
        .trim()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),

    body("Phone")
        .optional()
        .trim(),

    body("Designation")
        .optional()
        .trim(),

    body("Hobbies")
        .optional()
        .isArray()
        .withMessage("Hobbies must be an array"),

    body("Hobbies.*")
        .optional()
        .isString()
        .trim(),

    body("Language")
        .optional()
        .isArray()
        .withMessage("Language must be an array"),

    body("Language.*")
        .optional()
        .isObject()
        .trim(),

    body("Language.*.Name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Language name is required"),

    body("Language.*.Level")
        .optional()
        .isIn(Object.values(LanguageLevel))
        .withMessage("Invalid language level"),

    body("Availability")
        .optional()
        .trim(),

    body("Summary")
        .optional()
        .trim(),

    body("AboutMe")
        .optional()
        .trim(),

    body("Address")
        .optional()
        .isObject()
        .withMessage("Address must be an object"),
    
        
    body("Address.AddressLine1")
        .optional()
        .trim(),

    body("Address.AddressLine2")
        .optional()
        .trim(),

    body("Address.Country")
        .optional()
        .isObject()
        .withMessage("Country must be an object"),

    body("Address.Country.Name")
        .optional()
        .trim(),

    body("Address.Country.Code")
        .optional()
        .trim(),

    body("Address.Country.PhoneCode")
        .optional()
        .trim(),

    body("Address.Country.Flag")
        .optional()
        .trim(),

    body("Address.Country.Currency")
        .optional()
        .trim(),

    body("Address.State")
        .optional()
        .isObject()
        .withMessage("State must be an object"),

    body("Address.State.Name")
        .optional()
        .trim(),

    body("Address.State.Code")
        .optional()
        .trim(),

    body("Address.State.CountryCode")
        .optional()
        .trim(),

    body("Address.City")
        .optional()
        .isObject()
        .withMessage("State must be an object"),

    body("Address.City.Name")
        .optional()
        .trim(),

    body("Address.City.CountryCode")
        .optional()
        .trim(),

    body("Address.City.StateCode")
        .optional()
        .trim(),

    body("Address.Pincode")
        .optional()
        .trim(),
];

export const updateProfileSlugValidation = () => [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug is required")
];