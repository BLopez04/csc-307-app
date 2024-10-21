import mongoose from "mongoose";
import userModel from "../models/user.js";

function getUsers(name, job) {
  let promise = userModel.find();

  if (name) {
    let promise2 = findUserByName(name);
    promise = promise && promise2
  }
  if (job) {
    let promise2 = findUserByJob(job);
    promise = promise && promise2
  }

  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUser(id) {
  return userModel.findByIdAndDelete( id );
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUser,
};
