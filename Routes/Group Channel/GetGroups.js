// NEED TO CHECK AGAIN AND DO THE COMMENT

import express from "express";
import { ObjectId } from "mongodb";
import { GetGroupName } from "../../Utilities/Functions/Groups.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
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

  const GroupName = await GetGroupName(groupsId);

  const updatedGroupName = GroupName.map((data) => data.name);

  res.send({ GroupName: updatedGroupName, Access: true });
});

export const GetGroupsRouter = router;
