import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export async function uploadFile(buffer: Buffer) {
  try {
    // const img = req.file; //for testing

    // const buffer = new Uint8Array(img.buffer); //for testing
    const array = new Uint8Array(buffer);

    const uploadRes: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(array);
    });

    // console.log(uploadRes);
    const url = uploadRes.secure_url;
    return {
      success: true,
      url,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
    };
  }
}
