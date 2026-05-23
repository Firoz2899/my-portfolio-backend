import fs from 'fs'
import {fileURLToPath} from 'url'
import Path, {dirname} from 'path'
import multer from 'multer'

export const uploadFileIntoDisk = ({mainfolder = '/images', path = '', callback, filesize}) => {
  return multer({ 
    storage : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = Path.join(dirname(fileURLToPath(import.meta.url)), `../../public/uploads${mainfolder}${path}`)
        fs.access(uploadDir, (err) => {
          if (err) {
            fs.mkdir(uploadDir, { recursive: true }, (err) => {
              if (err) {
                return cb(err, null);
              }
              cb(null, uploadDir);
            });
          } else {
            cb(null, uploadDir)
          }
        });
      },
      filename: function(req, file, cb){
        if(file){
          
          if(!callback){
            let fileExtension = "";
            if (file.originalname.split(".").length > 1) {
              fileExtension = file.originalname.substring(
                file.originalname.lastIndexOf(".")
              );
            }
            const filenameWithoutExtension = file.originalname
            .toLowerCase()
            .split(" ")
            .join("-")
            ?.split(".")[0];
            cb(
              null,
              filenameWithoutExtension +
                  Date.now() +
                  Math.ceil(Math.random() * 1e5) + // avoid rare name conflict
                  fileExtension
            );
            return;
          }

          const result = callback(req, file, cb)
          if(result && typeof result === "string"){
            cb(null, result)
          }
        }
      }
    }),
    limits: {
      fileSize: filesize || 3 * 1000 * 1000,
    }
  })
}

const memoryStorage = multer.memoryStorage();

export const uploadImageInMemory = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];
        if (
            allowedMimeTypes.includes(
                file.mimetype
            )
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed"
                ),
                false
            );
        }
    }
});

export function removeFile(filepath){
  try {
    const localFilePath = Path.join(dirname(fileURLToPath(import.meta.url)), '../../public', filepath);
    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('error while remove file', error)
  }
}

export function removeLocalFile(localPath){
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};

export function removeUnusedMulterImageFilesOnError(req){
  try {
    const multerFile = req.file;
    const multerFiles = req.files;

    if (multerFile) {
      removeLocalFile(multerFile.path);
    }

    if (multerFiles) {
      const filesValueArray = Object.values(multerFiles);
      filesValueArray.map((fileFields) => {
        fileFields.map((fileObject) => {
          removeLocalFile(fileObject.path);
        });
      });
    }
  } catch (error) {
    console.log("Error while removing image files: ", error);
  }
};