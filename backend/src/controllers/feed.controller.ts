import { Request, Response } from "express";
import ConnectionRequest from "../models/ConnectionRequest.model";
import User from "../models/user.model";

interface FeedQuery {
  page?: string;
  limit?: string;
}

async function getFeed(req: Request<{}, {}, {}, FeedQuery>, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    //const skip = (page - 1) * limit;

    const requests = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user!.id }, { toUserId: req.user!.id }],
    });

    const excludedIds = new Set<string>([req.user!.id]);

    for (const request of requests) {
      excludedIds.add(request.toUserId.toString());
      excludedIds.add(request.fromUserId.toString());
    }

    const users = await User.find({
      _id: {
        $nin: [...excludedIds],
      },
    })
      .select("username")
      .populate({
        path: "profile",
        select: "photoURL about skills github linkedin",
      })
      .limit(limit);

    return res.status(200).json({
      page,
      limit,
      count: users.length,
      users,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

export { getFeed };
