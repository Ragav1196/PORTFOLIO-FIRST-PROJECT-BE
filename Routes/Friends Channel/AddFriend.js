import express from "express";
import {
  CreateFriendsChannel,
  GetFriendsChannel,
  AddFrndsChannelToUsers,
} from "../../Utilities/Functions/Friends.js";
import { ErrorRes } from "../../Utilities/Errors.js";
import { GetName, GenerateToken } from "../../Utilities/Functions/Users.js";
import { client } from "../../index.js";

const router = express.Router();

router
  .route("/")
  .post(async (req, res) => {
    let message;
    let Access;

    const dataProvided = req.body;

    // GETTING USERS DETAILS FROM DATABASE
    const user = await GetName(dataProvided.username);
    const friendFrmDB = await GetName(dataProvided.friendName);

    // TO THROW AN ERROR IF USER IS NOT PRESENT IN THE DATABASE
    if (!user) {
      message = "Provided user name is not found";
      Access = false;

      return ErrorRes(res, message, Access);
    }

    // TO THROW AN ERROR IF THE FRIEND IS NOT PRESENT IN THE DATABASE
    if (!friendFrmDB) {
      message = "Provided friend name is not found";
      Access = false;

      return ErrorRes(res, message, Access);
    }

    // TO CHECK IF THERE IS ANY FRIENDS CHANNEL PRESENT ALREADY BETWEEN THE PROVIDED USERS
    const isFriendChannelExist = await GetFriendsChannel(
      user._id,
      friendFrmDB._id
    );

    // TO THROW AN ERROR IF THERE ANY CHANNEL EXIST ALREADY
    if (isFriendChannelExist) {
      message = "Provided friend is already present in your friend list";
      Access = false;

      return ErrorRes(res, message, Access);
    }

    // IF THERE IS NO CHANNEL THEN CREATING A NEW CHANNEL BETWEEN THE USERS
    const channel = await CreateFriendsChannel(user._id, friendFrmDB._id);

    // ADDING THE CHANNEL ID TO THE MEMBERS OF THE CHANNEL
    await AddFrndsChannelToUsers(user._id, friendFrmDB._id, channel.insertedId);

    //   GETTING TOKEN TO UPDATE IN THE FRONT END
    const Getuser = await GetName(dataProvided.username);
    const token = GenerateToken(Getuser);

    res.status(200).send({
      message: "Friend added successfully",
      Token: token,
      Access: true,
    });
  }) // TO DELETE ALL THE FRIENDS CHANNEL
  .delete(async (req, res) => {
    client
      .db("Portfolio-First-Project")
      .collection("friends-channel")
      .deleteMany({});

    client
      .db("Portfolio-First-Project")
      .collection("users")
      .updateMany({}, { $unset: { friendsChannel: 1 } });

    return res.send({ message: "all Friends deleted" });
  });
export const AddFriendRouter = router;
