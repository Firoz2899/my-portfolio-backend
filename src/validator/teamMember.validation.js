import { body } from "express-validator";

export const createTeamMemberValidation = () => [
    body("MemberName")
        .trim()
        .notEmpty()
        .withMessage("Member name is required")
        .isLength({ max: 100 })
        .withMessage("Member name cannot exceed 100 characters"),

    body("Position")
        .trim()
        .notEmpty()
        .withMessage("Position is required")
        .isLength({ max: 100 })
        .withMessage("Position cannot exceed 100 characters"),

    body("Experience")
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Experience must be greater than or equal to 0"),

    body("Bio")
        .trim()
        .notEmpty()
        .withMessage("Bio is required")
        .isLength({ max: 5000 })
        .withMessage("Bio cannot exceed 5000 characters"),

    body("Skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array"),

    body("Skills.*")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Skill cannot be empty"),

    body("Social")
        .optional()
        .isObject()
        .withMessage("Social must be an object"),

    body("Social.Facebook")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("Facebook URL is invalid"),

    body("Social.Twitter")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("Twitter URL is invalid"),

    body("Social.LinkedIn")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("LinkedIn URL is invalid"),

    body("Social.Instagram")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("Instagram URL is invalid"),

    body("Social.Github")
        .optional({ nullable: true, checkFalsy: true })
        .isURL()
        .withMessage("Github URL is invalid")
];