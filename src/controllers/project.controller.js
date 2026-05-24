import { 
    ApiResponse, 
    asyncHandler, 
    ApiError, 
    escapedSlug, 
    uploadToCloudinary, 
    deleteFromCloudinary 
} from "../utils/index.js";
import Project  from "../models/project.model.js";
import {CloudinaryFolders} from '../constants/constants.js'

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
                CloudinaryFolders.Project.ProjectImages
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
        CloudinaryFolders.Project.ProjectImages
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
        CloudinaryFolders.Project.CoverImage
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

export const updateProjectSlug = asyncHandler(async (req) => {
    const { UniqueCode, slug } = req.body;
    const project = await Project.findOne({
        UniqueCode,
        PortfolioUniqueCode: req.portfolioCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project"
        );
    }

    project.Slug = slug.trim();

    await project.save();

    return new ApiResponse(
        200,
        project,
        "Project slug updated successfully"
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

    const project = await Project.findOne({ 
        Slug: {
            $regex: `^${escapedSlug(slug.trim())}$`,
            $options: "i"
        } 
    });

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
    const coverImage = project.CoverImage;

    if(coverImage?.PublicId){
        await deleteFromCloudinary(coverImage.PublicId);
    }

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