export const tableNames = Object.freeze({
    User: "Users",
    Profiles: "Profiles",
    Experiences: "Experiences",
    Skills: "Skills",
    Services: "Services",
    Projects: "Projects",
    SiteSettings: "SiteSettings",
    ReservedSlugs: "ReservedSlugs",
    Contacts: "Contacts"
})

export const Roles = Object.freeze({
    SUPERADMIN: "SUPERADMIN",
    USER: "USER"
})

export const ReservedSlugTypes = Object.freeze({
    PROFILE: "PROFILE",
    PROJECT: "PROJECT"
})

export const CloudinaryFolders = Object.freeze({
    Profile: Object.freeze({
        ProfilePictures: "profile/profile-images",
        CoverPictures: "profile/cover-images"
    }),
    Project: Object.freeze({
        ProjectImages: "project/project-images",
        CoverImage: "project/cover-images"
    })
});

export const regex = Object.freeze({
    URL: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?[\w-]+=[\w-]+(&[\w-]+=[\w-]+)*)?$/,
    Slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
})

export const UniqueCodePrefixes = Object.freeze({
    Contact: "CNT",
    Experience: "EXP",
    Profile: "PRF",
    Project: "PRJ",
    ReservedSlug: "RSL",
    Media: "MED",
    Service: "SRV",
    Skill: "SKL",
    User: "USR"
})

export const ErrorTypes = Object.freeze({
  // Authentication
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  REFRESH_TOKEN_INVALID_OR_EXPIRED: "REFRESH_TOKEN_INVALID_OR_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  UNAUTHORIZED_OR_NOT_FOUND: "UNAUTHORIZED_OR_NOT_FOUND",
  NOT_FOUND: "NOT_FOUND",

  // Authorization
  ACCESS_DENIED: "ACCESS_DENIED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  REQUIRED_FIELD_MISSING: "REQUIRED_FIELD_MISSING",

  // User
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  PHONE_ALREADY_EXISTS: "PHONE_ALREADY_EXISTS",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",

  // Resource
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",

  // File
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",

  // Business Rules
  OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
  BUSINESS_RULE_VIOLATION: "BUSINESS_RULE_VIOLATION",

  // Rate Limiting
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // External Services
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
  SMS_SEND_FAILED: "SMS_SEND_FAILED",

  // Server
  DATABASE_ERROR: "DATABASE_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

  // Generic
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});