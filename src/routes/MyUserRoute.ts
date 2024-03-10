import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

//if we get a request for eg at /api/my/user and put a 'post' request then
//the handler is gonna get called &it' going to pass the request on the
//MyUserController.createCurrentUser function which will handle the
//business logic

//api/my/user
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);
router.post("/", jwtCheck, MyUserController.createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);
export default router;

//this is where we created the handler & the comtroller that
//handles the request to create the user, so it makes sense
//to put the updateCurrentUser function in there.

//this is where we defined our endpoints to create a user &
//update the user, so it makes sense to get request to get
//the current logged in user in here as well.
