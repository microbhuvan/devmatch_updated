import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import type { RootState } from "../redux/store";
import { getMyProfile } from "../services/profile.service";
import { setProfile } from "../redux/slices/profileSlice";
import { updateProfilePhoto } from "../services/profile.service";
import ProfilePageSkeleton from "../components/profile/ProfilePageSkeleton";
import { useToast } from "../hooks/useToast";

const Profile = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { profile } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(!profile);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    try {
      setUploading(true);
      const data = await updateProfilePhoto(file);
      dispatch(setProfile(data.profile));
      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (profile) return;

    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        dispatch(setProfile(data.profile));
      } catch (err) {
        toast.error("Could not fetch your profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profile, dispatch, toast]);

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl">Could not load your profile.</p>
        <Link to="/create-profile" className="btn btn-primary">
          Create a Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:mt-10 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="avatar mb-4">
          <div className="w-36 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
            <img
              src={
                profile.photoURL || "https://placehold.co/150x150?text=Profile"
              }
              alt="Profile"
            />
          </div>
        </div>

        <label className="btn btn-sm btn-primary cursor-pointer">
          {uploading ? (
            <span className="loading loading-spinner" />
          ) : (
            "Change Photo"
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
            disabled={uploading}
          />
        </label>

        <h1 className="mt-4 text-3xl font-bold">{user?.username}</h1>
        <p className="mt-1 text-base-content/60">{user?.email}</p>
      </div>

      <div className="divider" />

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">About</h2>
          <p className="mt-1 text-base-content/80">
            {profile.about || "No bio added."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span key={skill} className="badge badge-lg badge-primary">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-base-content/60">No skills added.</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Age</h2>
            <p className="mt-1 text-base-content/80">
              {profile.age || "Not specified"}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Gender</h2>
            <p className="mt-1 text-base-content/80">
              {profile.gender || "Not specified"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">GitHub</h2>
          {profile.github ? (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-primary link break-all"
            >
              {profile.github}
            </a>
          ) : (
            <p className="text-base-content/60">Not provided.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold">LinkedIn</h2>
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-primary link break-all"
            >
              {profile.linkedin}
            </a>
          ) : (
            <p className="text-base-content/60">Not provided.</p>
          )}
        </div>
      </div>

      <div className="divider" />

      <div className="mt-4 flex justify-end">
        <Link to="/profile/edit" className="btn btn-primary">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default Profile;
