import { Request, Response } from "express";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import { validateProfile } from "../validators/profile.validator";
import { imageUpload, deleteImage } from "../services/cloudinary.service";

async function createProfile(req: Request, res: Response) {
  try {
    const { skills, age, gender, about, github, linkedin } = req.body;

    const profileExists = await Profile.findOne({
      userId: req.user!.id,
    });

    if (profileExists) {
      return res.status(409).json({ message: "profile already exists" });
    }

    const profile = await Profile.create({
      userId: req.user!.id,
      skills,
      age,
      gender,
      about,
      github,
      linkedin,
    });

    return res.status(201).json({
      message: "profile created successfully",
      profile,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ message: "server error" });
  }
}

async function getMyProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const profile = await Profile.findOne({ userId: userId });

    if (!profile) {
      return res.status(404).json({ message: "profile doesnt exist" });
    }

    return res.status(200).json({
      message: "profile data",
      profile,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: "server error" });
  }
}

async function getUserProfile(req: Request, res: Response) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "invalid username format" });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "user doesnt exist" });
    }

    const profile = await Profile.findOne({ userId: user?.id });
    if (!profile) {
      return res.status(404).json({ message: "profile doesnt exist" });
    }

    return res.status(200).json({
      message: "profile data",
      profile,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: "server error" });
  }
}

async function editProfile(req: Request, res: Response) {
  try {
    const updates = Object.keys(req.body);

    let isValid: boolean = validateProfile(updates);
    if (!isValid) {
      return res.status(400).json({ message: "invalid input fields" });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user!.id },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!profile) {
      return res.status(404).json({ message: "profile doesnt exist" });
    }

    return res
      .status(200)
      .json({ message: "changes successfully saved", profile });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ message: "server error" });
  }
}

async function updateProfilePhoto(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "photo required" });
    }

    const profile = await Profile.findOne({ userId: req.user!.id });

    if (!profile) {
      return res.status(404).json({ message: "profile not found" });
    }

    if (profile.photoPublicId) {
      await deleteImage(profile.photoPublicId);
    }

    const result = await imageUpload(req.file.buffer);

    profile.photoURL = result.url;
    profile.photoPublicId = result.publicId;

    await profile.save();

    return res.status(200).json({
      message: "photo updated",
      photoURL: profile.photoURL,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ message: "server error" });
  }
}

export {
  createProfile,
  getMyProfile,
  getUserProfile,
  editProfile,
  updateProfilePhoto,
};

//missing projection and using virtual both in getUserProfile
