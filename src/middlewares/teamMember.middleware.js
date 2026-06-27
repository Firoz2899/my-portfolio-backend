export const parseTeamMemberFormData = (req, res, next) => {
    if (req.body.Skills && typeof req.body.Skills === "string") {
        req.body.Skills = JSON.parse(req.body.Skills);
    }

    if (req.body.Social && typeof req.body.Social === "string") {
        req.body.Social = JSON.parse(req.body.Social);
    }

    next();
};