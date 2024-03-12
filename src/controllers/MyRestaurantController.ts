//Myyyyy
import { Request, Response } from "express";
import Restaurant from "../models/restaurants";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

//check if the user already has an existing
// restaurant in the database.
//the user can only create 1 restaurant per account
const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

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

//when we are doing a .find, it's always gonna reutrn an []

// need to create a data URI string that represents
//the image that we got in our requests

//linking current logged in user to this restaurant record

//we want to  create a new restarant in our DB based on the model
