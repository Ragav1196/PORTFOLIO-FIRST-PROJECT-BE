import { client } from "../../index.js";
import { ObjectId } from "mongodb";

// TO CREATE A CHANNEL BETWEEN TWO FRIENDS
function CreateFriendsChannel(user, friend) {
  return client
    .db("Portfolio-First-Project")
    .collection("friends-channel")
    .insertOne({
      users: [user, friend],
    });
}

// TO ADD FRIENDS CHANNEL ID TO USERS
function AddFrndsChannelToUsers(userId, friendId, channelId) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .updateMany(
      { _id: { $in: [ObjectId(userId), ObjectId(friendId)] } },
      { $push: { friendsChannel: channelId } }
    );
}

// TO GET FRIENDS CHANNEL
function GetFriendsChannel(user, friend) {
  return client
    .db("Portfolio-First-Project")
    .collection("friends-channel")
    .findOne({ users: { $all: [ObjectId(user), ObjectId(friend)] } });
}

// TO ADD FRIENDS EXPENSES
function AddFriendsExpense(data, channelId, userId) {
  return client
    .db("Portfolio-First-Project")
    .collection("friends-channel")
    .updateOne(
      { _id: ObjectId(channelId) },
      {
        $push: {
          expenses: {
            _id: ObjectId(),
            category: data.category,
            amount: data.amount,
            paidBY: userId,
          },
        },
      }
    );
}

// TO GET FRIENDS LIST
function GetFriendsName(id) {
  return client
    .db("Portfolio-First-Project")
    .collection("users")
    .find({
      _id: { $in: id },
    })
    .project({ name: 1 })
    .toArray();
}

// TO GET FRIENDS CHANNEL BY ID
function GetFriendsChannelById(id) {
  return client
    .db("Portfolio-First-Project")
    .collection("friends-channel")
    .find({
      _id: { $in: id },
    })
    .project({ _id: 0 })
    .toArray();
}

export {
  CreateFriendsChannel,
  AddFrndsChannelToUsers,
  GetFriendsChannel,
  AddFriendsExpense,
  GetFriendsName,
  GetFriendsChannelById,
};
