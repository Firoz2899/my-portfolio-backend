// utils/cloudinary.js

import { generateUniqueCode } from "./helpers.js";
import { config } from "./config.js";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

export default cloudinary;

export const uploadToCloudinary = async (
    file,
    folder = "portfolio"
) => {

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {
                if(error){
                    return reject(error);
                }
                resolve({
                    UniqueCode: generateUniqueCode("IMG"),
                    OriginalUrl: result.secure_url,
                    ThumbnailUrl: cloudinary.url(
                        result.public_id,
                        {
                            width: 400,
                            height: 250,
                            crop: "fill"
                        }
                    ),
                    PublicId: result.public_id,
                    Width: result.width,
                    Height: result.height,
                    Size: result.bytes
                });
            }
        ).end(file.buffer);
    });
};


export const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(
        publicId
    );
}