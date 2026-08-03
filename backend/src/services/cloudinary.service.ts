import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export function imageUpload(
  buffer: Buffer,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    //write stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "devmatch_up/profiles",

        transformation: [
          {
            width: 400,
            height: 400,
            crop: "fill",
            gravity: "face",
          },
          {
            quality: "auto",
          },
          {
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Upload failed"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    //buffer ---> readable stream
    streamifier.createReadStream(buffer).pipe(uploadStream);
    //node connects read stream to write stream (pipe)
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
