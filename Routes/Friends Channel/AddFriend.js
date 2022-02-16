import express from "express";
import {
  CreateFriendsChannel,
  GetFriendsChannel,
  AddFrndsChannelToUsers,
} from "../../Utilities/Functions/Friends.js";
import { ErrorRes } from "../../Utilities/Errors.js";
import { GetName, GenerateToken } from "../../Utilities/Functions/Users.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  let message;
  let Access;

  const dataProvided = req.body;
  const user = await GetName(dataProvided.username);
  const friendFrmDB = await GetName(dataProvided.friendName);

  if (!user) {
    message = "Provided user name is not found";
    Access = false;

    return ErrorRes(res, message, Access);
  }

  if (!friendFrmDB) {
    message = "Provided friend name is not found";
    Access = false;

    return ErrorRes(res, message, Access);
  }

  const isFriendChannelExist = await GetFriendsChannel(
    user._id,
    friendFrmDB._id
  );

  if (isFriendChannelExist) {
    message = "Provided friend is already present in your friend list";
    Access = false;

    return ErrorRes(res, message, Access);
  }

  const channel = await CreateFriendsChannel(user._id, friendFrmDB._id);

  const addFrndsChannelToUsers = await AddFrndsChannelToUsers(
    user._id,
    friendFrmDB._id,
    channel.insertedId
  );

  //   GETTING TOKEN TO UPDATE IN THE FRONT END
  const Getuser = await GetName(dataProvided.username);
  const token = GenerateToken(Getuser);

  res.status(200).send({
    message: "Friend added successfully",
    Token: token,
    Access: true,
  });
});

export const AddFriendRouter = router;
