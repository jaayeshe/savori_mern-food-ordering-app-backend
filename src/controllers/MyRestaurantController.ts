import { Request, Response } from "express";
import Restaurant from "../models/restaurants";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    //check if the user already has an existing
    // restaurant in the database.
    //the user can only create 1 restaurant per account

    const exisitngrestaurant = await Restaurant.find({ user: req.userId });

    if (exisitngrestaurant) {
      ({ message: "User restaurant already exisits" });
      return res.status(409).json;
    }

    // need to create a data URI string that represents
    //the image that we got in our requests

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //linking current logged in user to this restaurant record

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    //we want to  create a new restarant in our DB based on the model

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Sth went wrong" });
  }
};

export default { createMyRestaurant };
