import { ApiResponse, asyncHandler, ApiError } from "../utils/index.js";
import Project  from "../models/project.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const createProject = asyncHandler(async (req) => {

    const project = await Project.create({
        PortfolioUniqueCode: req.portfolioCode,
        ...req.body
    });

    return new ApiResponse(
        201,
        project,
        "Project created successfully"
    );
});

export const uploadProjectImages = asyncHandler(async (req) => {

    const { projectCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project"
        );
    }

    const uploadedImages = [];

    for(const file of req.files){

        const image =
            await uploadToCloudinary(
                file,
                "projects/project-images"
            );

        uploadedImages.push(image);
    }

    project.ProjectImages.push(
        ...uploadedImages
    );

    await project.save();

    return new ApiResponse(
        200,
        uploadedImages,
        "Project Images uploaded successfully"
    );
});

export const replaceProjectImage = asyncHandler(async (req) => {

    const { projectCode, imageCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if (!project) {
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project"
        );
    }

    const image = project.ProjectImages.find(
        x => x.UniqueCode === imageCode
    );

    if (!image) {
        throw new ApiError(
            404,
            "Image not found"
        );
    }

    if (image.PublicId) {
        await deleteFromCloudinary(image.PublicId);
    }

    const uploadedImage = await uploadToCloudinary(
        req.file,
        "projects"
    );

    image.OriginalUrl = uploadedImage.OriginalUrl;

    image.ThumbnailUrl = uploadedImage.ThumbnailUrl;

    image.PublicId = uploadedImage.PublicId;

    image.Width = uploadedImage.Width;

    image.Height = uploadedImage.Height;

    image.Size = uploadedImage.Size;

    await project.save();

    return new ApiResponse(
        200,
        image,
        "Image replaced successfully"
    );
});

export const uploadCoverImage = asyncHandler(async (req) => {

    const { projectCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project"
        );
    }

    if(project.CoverImage?.PublicId){
        await deleteFromCloudinary(project.CoverImage.PublicId);
    }

    const image = await uploadToCloudinary(
        req.file,
        "projects/covers"
    );

    project.CoverImage = image;

    await project.save();

    return new ApiResponse(
        200,
        image,
        "Cover image uploaded"
    );
});

export const deleteProjectImage = asyncHandler(async (req) => {

    const { projectCode, imageCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project"
        );
    }

    const image = project.ProjectImages.find(x => x.UniqueCode === imageCode);

    if(!image){
        throw new ApiError(
            404,
            "Image not found"
        );
    }

    await deleteFromCloudinary(image.PublicId);

    project.ProjectImages = project.ProjectImages.filter(x => x.UniqueCode !== imageCode);

    await project.save();

    return new ApiResponse(
        200,
        null,
        "Image deleted"
    );
});

export const updateProject = asyncHandler(async (req) => {

    const { projectCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project"
        );
    }

    const allowedFields = [
        "Title",
        "Slug",
        "ShortDescription",
        "Description",
        "WebsiteUrl",
        "GithubUrl",
        "Technologies",
        "Features",
        "StartDate",
        "EndDate",
        "IsFeatured",
        "IsActive"
    ];

    allowedFields.forEach(field => {
        if(req.body[field] !== undefined){
            project[field] = req.body[field];
        }
    });

    await project.save();

    return new ApiResponse(
        200,
        project,
        "Project updated successfully"
    );
});

export const getProjectByCode = asyncHandler(async (req) => {

    const { projectCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to view this project"
        );
    }

    return new ApiResponse(
        200,
        project,
        "Project retrieved successfully"
    );
});

export const getAllProjects = asyncHandler(async (req) => {

    const projects = await Project
        .find({ PortfolioUniqueCode: req.portfolioCode })
        .sort({
            IsFeatured: -1,
            createdAt: -1
        });

    return new ApiResponse(
        200,
        projects,
        "Projects retrieved successfully"
    );
});

export const getProjectBySlug = asyncHandler(async (req) => {

    const { slug } = req.params;

    const project = await Project.findOne({ Slug: slug });

    if(!project){
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    return new ApiResponse(
        200,
        project,
        "Project retrieved successfully"
    );
});

export const deleteProject = asyncHandler(async (req) => {

    const { projectCode } = req.params;

    const project = await Project.findOne({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to delete this project"
        );
    }

    const images = project.ProjectImages;

    if(images.length){
        for(const image of images){

            if(image.PublicId){
                await deleteFromCloudinary(image.PublicId);
            }
        }
    }

    const deletedProject = await Project.findOneAndDelete({
        UniqueCode: projectCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!deletedProject){
        throw new ApiError(
            404,
            "Project not found or unauthorized to delete this project"
        );
    }

    return new ApiResponse(
        200,
        null,
        "Project deleted"
    );
});