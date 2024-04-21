import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export async function uploadFile(req: any, res: Response) {
  try {
    // const img = req.file; //for testing
    const image: File = req.body.file;

    // const buffer = new Uint8Array(img.buffer); //for testing
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const uploadRes: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(buffer);
    });

    // console.log(uploadRes);
    const url = uploadRes.secure_url;
    res.json({
      success: true,
      url,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
}
