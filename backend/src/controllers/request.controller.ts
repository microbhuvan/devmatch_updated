import { Request, Response } from "express";
import ConnectionRequest from "../models/connectionRequest.model";
import User from "../models/user.model";
import { validateFields } from "../validators/request.validator";

async function sendRequest(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "invalid url format" });
    }

    if (userId === req.user!.id) {
      return res
        .status(400)
        .json({ message: "cannot send connection to yourself" });
    }

    const toUser = await User.findOne({ userId });
    if (!toUser) {
      return res.status(404).json({ message: "user does not exist" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      fromUserId: req.user!.id,
      toUserId: userId,
    });

    if (existingRequest && existingRequest.status == "interested") {
      return res.status(409).json({ message: "request already exists" });
    }
    if (existingRequest && existingRequest.status == "accepted") {
      return res.status(409).json({ message: "request already accepted" });
    }

    const request = await ConnectionRequest.create({
      fromUserId: req.user!.id,
      toUserId: userId,
      status: "interested",
    });

    return res.status(201).json({ message: "connection created", request });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

async function sentRequests(req: Request, res: Response) {
  try {
    const requests = await ConnectionRequest.find({
      fromUserId: req.user!.id,
      status: "interested",
    });
    if (!requests) {
      return res.status(404).json({ message: "no pending sent requests" });
    }

    return res
      .status(200)
      .json({ message: "existing pending sent requests", requests });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

async function receivedRequests(req: Request, res: Response) {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user!.id,
      status: "interested",
    });
    if (!requests) {
      return res.status(404).json({ message: "no pending sent requests" });
    }

    return res
      .status(200)
      .json({ message: "existing pending sent requests", requests });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

export { sendRequest, sentRequests, receivedRequests };
