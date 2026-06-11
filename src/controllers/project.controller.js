import { 
    ApiResponse, 
    asyncHandler, 
    ApiError, 
    escapedSlug, 
    uploadToCloudinary, 
    deleteFromCloudinary 
} from "#utils/index.js";
import Project  from "#models/project.model.js";
import {CloudinaryFolders, UniqueCodePrefixes, ErrorTypes} from '#constants/constants.js'
import {generateUniqueCode} from '#utils/helpers.js'

export const createProject = asyncHandler(async (req) => {

    const project = await Project.create({
        ProfileUniqueCode: req.profileCode,
        ...req.body
    });

    return new ApiResponse(
        201,
        project,
        "Project created successfully"
    );
});

export const updateProject = asyncHandler(async (req) => {

    const {uniqueCode} = req.params;

    const project = await Project.findOne({
        UniqueCode: uniqueCode,
        ProfileUniqueCode: req.profileCode
    })

    if(!project)
        throw new ApiError(404, "Project not found or not authorized", ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND);

    Object.assign(project, req.body)

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
        ProfileUniqueCode: req.profileCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    const uploadedImages = [];

    for(const file of req.files){

        const image =
            await uploadToCloudinary(
                file,
                CloudinaryFolders.Project.ProjectImages
            );
         image.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Media);
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
        ProfileUniqueCode: req.profileCode
    });

    if (!project) {
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    const image = project.ProjectImages.find(
        x => x.UniqueCode === imageCode
    );

    if (!image) {
        throw new ApiError(
            404,
            "Image not found",
            ErrorTypes.FILE_NOT_FOUND
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
        ProfileUniqueCode: req.profileCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    if(project.CoverImage?.PublicId){
        await deleteFromCloudinary(project.CoverImage.PublicId);
    }

    const image = await uploadToCloudinary(
        req.file,
        CloudinaryFolders.Project.CoverImage
    );
    
    image.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Media);

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
        ProfileUniqueCode: req.profileCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    const image = project.ProjectImages.find(x => x.UniqueCode === imageCode);

    if(!image){
        throw new ApiError(
            404,
            "Image not found",
            ErrorTypes.FILE_NOT_FOUND
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
        ProfileUniqueCode: req.profileCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to update this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
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
        ProfileUniqueCode: req.profileCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to view this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
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
        .find({ ProfileUniqueCode: req.profileCode })
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
            "Project not found",
            ErrorTypes.NOT_FOUND
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
        ProfileUniqueCode: req.profileCode
    });

    if(!project){
        throw new ApiError(
            404,
            "Project not found or unauthorized to delete this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
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
        ProfileUniqueCode: req.profileCode
    });

    if(!deletedProject){
        throw new ApiError(
            404,
            "Project not found or unauthorized to delete this project",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    return new ApiResponse(
        200,
        null,
        "Project deleted"
    );
});