// NEED TO CHECK AGAIN AND DO THE COMMENT

import express from "express";
import { ObjectId } from "mongodb";
import { Auth } from "../../Middleware/Auth.js";
import { GetGroupName } from "../../Utilities/Functions/Groups.js";

const router = express.Router();

router.route("/").post(Auth, async (req, res) => {
  const groupsId = req.body.GroupsId;

  if (!groupsId) {
    return res
      .status(200)
      .send({ message: "Groups list is empty for the user", Access: false });
  }

  //   CONVERTING FRIENDS CHANNEL ID TO OBJECT ID
  for (let i = 0; i < groupsId.length; i++) {
    groupsId[i] = new ObjectId(groupsId[i]);
  }

  // GETTING GROUP DETAILS FROM THE DATABASE
  const Groups = await GetGroupName(groupsId);

  res.send({ groupsDetails: Groups, Access: true });
});

export const GetGroupsRouter = router;
