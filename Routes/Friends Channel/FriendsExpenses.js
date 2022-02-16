import express from "express";
import { ErrorRes } from "../../Utilities/Errors.js";
import {
  GetFriendsChannel,
  AddFriendsExpense,
} from "../../Utilities/Functions/Friends.js";
import { GetName } from "../../Utilities/Functions/Users.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const dataProvided = req.body;
  const user = await GetName(dataProvided.username);
  const friendFrmDB = await GetName(dataProvided.friendName);

  if (!user) {
    const message = "Provided user name is not found";
    return ErrorRes(res, message, false);
  }

  if (!friendFrmDB) {
    const message = "Provided friend name is not found";
    return ErrorRes(res, message, false);
  }

  const isFriendChannelExist = await GetFriendsChannel(
    user._id,
    friendFrmDB._id
  );

  if (!isFriendChannelExist) {
    const message = "Channel doesn't exists between these two friends";
    return ErrorRes(res, message, false);
  }

  console.log(user._id);
  const addExpense = await AddFriendsExpense(
    dataProvided.expenses,
    isFriendChannelExist._id,
    user._id
  );

  res.status(200).send({ addExpense });
});

export const FriendsExpensesRouter = router;
