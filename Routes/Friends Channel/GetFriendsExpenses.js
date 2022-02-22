import express from "express";
import { ErrorRes } from "../../Utilities/Errors.js";
import { GetFriendsChannel } from "../../Utilities/Functions/Friends.js";
import { GetId } from "../../Utilities/FUNCTIONS/Users.js";

const router = express.Router();

router.route("/:user_id/:friend_id").get(async (req, res) => {
  // GETTING FRIEND AND USER ID FROM THE URL
  const { user_id } = req.params;
  const { friend_id } = req.params;

  // CHECKING IF THE USER AND FRIEND IS EXISTING IN THE DATABASE
  const user = await GetId(user_id);
  const friend = await GetId(friend_id);

  // THROWING AN ERROR IF THE USER IS NOT EXISITING IN THE DATABASE
  if (!user) {
    const message = "Provided user doesn't exist in the database";
    return ErrorRes(res, message, false);
  }
  // THROWING AN ERROR IF THE FRIEND IS NOT EXISITING IN THE DATABASE
  if (!user) {
    const message = "Provided friend doesn't exist in the database";
    return ErrorRes(res, message, false);
  }

  // CHECKING IF THERE IS ANY CHANNEL EXISTING BETWEEN THE USERS
  const isFriendChannelExist = await GetFriendsChannel(user_id, friend_id);

  // THROWING AN ERROR IF THE THE CHANNEL IS NOT EXISITING BETWEEN THE USERS
  if (!isFriendChannelExist) {
    message = "Channel doesn't exist between the users";
    return ErrorRes(res, message, false);
  }

  res.status(200).send({
    user: user,
    friend: friend,
    FriendChannel: isFriendChannelExist,
  });
});

export const GetFriendsExpensesRouter = router;
