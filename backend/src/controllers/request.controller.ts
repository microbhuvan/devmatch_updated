import { Request, Response } from "express";
import ConnectionRequest from "../models/ConnectionRequest.model";
import User from "../models/user.model";
import { validateFields } from "../validators/request.validator";

interface UserIdParams {
  userId: string;
}

interface RequestIdParams {
  requestId: string;
}

async function sendRequest(req: Request<UserIdParams>, res: Response) {
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

    const toUser = await User.findById(userId);
    if (!toUser) {
      return res.status(404).json({ message: "user does not exist" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: req.user!.id,
          toUserId: userId,
        },
        {
          fromUserId: userId,
          toUserId: req.user!.id,
        },
      ],
      status: {
        $in: ["interested", "accepted"],
      },
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
    }).populate("toUserId", "username email");

    if (requests.length === 0) {
      return res
        .status(200)
        .json({ message: "no pending sent requests", requests: [] });
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
    }).populate("fromUserId", "username email");

    if (requests.length === 0) {
      return res
        .status(200)
        .json({ message: "no pending sent requests", requests: [] });
    }

    return res
      .status(200)
      .json({ message: "existing pending sent requests", requests });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

async function acceptRequest(req: Request<RequestIdParams>, res: Response) {
  try {
    const { requestId } = req.params;

    const request = await ConnectionRequest.findById(requestId);
    if (!request) {
      return res.status(400).json({ message: "invalid request" });
    }

    if (request.toUserId.toString() !== req.user!.id) {
      return res.status(403).json({ message: "forbidden request" });
    }

    request.status = "accepted";
    await request.save();

    return res
      .status(200)
      .json({ message: "connection established successfully", request });
  } catch (err: any) {
    console.log(err.messsage);
    return res.status(500).json({ message: "server error" });
  }
}

async function rejectRequest(req: Request<RequestIdParams>, res: Response) {
  try {
    const { requestId } = req.params;

    const request = await ConnectionRequest.findById(requestId);
    if (!request) {
      return res.status(400).json({ message: "invalid request" });
    }

    if (request.toUserId.toString() !== req.user!.id) {
      return res.status(403).json({ message: "forbidden request" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({ message: "connection rejected", request });
  } catch (err: any) {
    console.log(err.messsage);
    return res.status(500).json({ message: "server error" });
  }
}

async function connections(req: Request, res: Response) {
  try {
    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: req.user!.id }, { fromUserId: req.user!.id }],
      status: "accepted",
    })
      .populate("fromUserId", "username email")
      .populate("toUserId", "username email");

    if (connections.length === 0) {
      return res
        .status(200)
        .json({ message: "no connections exists", requests: [] });
    }

    return res
      .status(200)
      .json({ message: "all connections fetched", connections });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

export {
  sendRequest,
  sentRequests,
  receivedRequests,
  acceptRequest,
  rejectRequest,
  connections,
};
