import { Request, Response } from "express";
import User from "../models/user.model";
import Profile from "../models/profile.model";

export async function searchDevelopers(req: Request, res: Response) {
  try {
    const currentUser = await User.findById(req.user!.id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!currentUser.isPremium) {
      return res.status(403).json({
        message: "Upgrade to Premium to use Developer Search.",
      });
    }

    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }

    // Search by skills
    const profiles = await Profile.find({
      userId: {
        $ne: currentUser._id,
      },
      skills: {
        $regex: query,
        $options: "i",
      },
    }).populate("userId", "username email");

    // Search users by username
    const users = await User.find({
      _id: {
        $ne: currentUser._id,
      },
      username: {
        $regex: query,
        $options: "i",
      },
    }).select("_id username email");

    const userIds = users.map((user) => user._id);

    // Fetch matching profiles
    const usernameProfiles = await Profile.find({
      userId: {
        $in: userIds,
      },
    }).populate("userId", "username email");

    // Remove duplicates
    const uniqueProfiles = new Map();

    [...profiles, ...usernameProfiles].forEach((profile) => {
      uniqueProfiles.set(profile.userId.toString(), profile);
    });

    return res.status(200).json({
      profiles: [...uniqueProfiles.values()],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Unable to search developers.",
    });
  }
}
