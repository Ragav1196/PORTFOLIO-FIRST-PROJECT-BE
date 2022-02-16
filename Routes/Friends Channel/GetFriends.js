import express from "express";
import { ObjectId } from "mongodb";
import {
  GetFriendsName,
  GetFriendsChannelById,
} from "../../Utilities/Functions/Friends.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const friendsChannelId = req.body.friendsChannelId;
  const userId = req.body.userId;

  if (!friendsChannelId) {
    return res
      .status(400)
      .send({ message: "Friends list is empty for the user", Access: false });
  }

  //   CONVERTING FRIENDS CHANNEL ID TO OBJECT ID
  for (let i = 0; i < friendsChannelId.length; i++) {
    friendsChannelId[i] = new ObjectId(friendsChannelId[i]);
  }
  
  //   GETTING FRIENDS ID LIST
  const friendsList = await GetFriendsChannelById(friendsChannelId);
  const updatedFriendsList = friendsList.map((data) => data.users);

  //   SEPERATING USER ID FROM THE FRIENDS ID
  let friendsId = [];
  for (let j = 0; j < updatedFriendsList.length; j++) {
    updatedFriendsList[j].map((friends) => {
      if (friends.toString() != userId) {
        friendsId.push(friends);
      }
    });
  }

  //   CONVERTING FRIENDS ID TO OBJECT ID
  for (let i = 0; i < friendsId.length; i++) {
    friendsId[i] = new ObjectId(friendsId[i]);
  }

  //   GETTING FRIENDS NAME
  const friends = await GetFriendsName(friendsId);

  res.send({ friends, Access: true });
});

export const GetFriendsRouter = router;
