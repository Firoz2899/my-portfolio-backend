export const tableNames = Object.freeze({
    User: "Users",
    Portfolios: "Portfolios",
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
    PORTFOLIO: "PORTFOLIO",
    PROJECT: "PROJECT"
})

export const CloudinaryFolders = Object.freeze({
    Portfolio: Object.freeze({
        ProfilePictures: "portfolio/profile-images",
        CoverPictures: "portfolio/cover-images"
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
    Portfolio: "POR",
    Project: "PRJ",
    ReservedSlug: "RSL",
    Media: "MED",
    Service: "SRV",
    Skill: "SKL",
    User: "USR"
})