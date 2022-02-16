import express from "express";
import { ErrorRes } from "../../Utilities/Errors.js";
import {
  GetAllNames,
  addGrpExpense,
  GetGroupChannel,
} from "../../Utilities/Functions/Groups.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const dataProvided = req.body;
  const membersFrmDB = await GetAllNames(dataProvided.friendsList);

  const NO_Friends = dataProvided.friendsList.length;
  const NO_FriendsFrmDB = membersFrmDB.length;

  if (NO_Friends != NO_FriendsFrmDB) {
    const message = "Provided list of friends name is not found";
    return ErrorRes(res, message, false, false);
  }

  const isGroupChannelExist = await GetGroupChannel(
    dataProvided.groupName,
    membersFrmDB,
    NO_FriendsFrmDB
  );

  if (!isGroupChannelExist) {
    const message = "Group doesn't exists between provided members";
    return ErrorRes(res, message, false);
  }

  const addExpense = await addGrpExpense(
    dataProvided.expenses,
    isGroupChannelExist._id,
    membersFrmDB
  );

  res.status(200).send({ addExpense });
});

export const GroupExpensesRouter = router;
