import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createProfile,
  updateProfile,
  updateProfilePhoto,
} from "../../services/profile.service";
import { setProfile } from "../../redux/slices/profileSlice";
import { useToast } from "../../hooks/useToast";
import type { RootState } from "../../redux/store";

interface ProfileFormProps {
  mode: "create" | "edit";
}

const ProfileForm = ({ mode }: ProfileFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { profile } = useSelector((state: RootState) => state.profile);

  const [formData, setFormData] = useState({
    age: mode === "edit" && profile?.age ? String(profile.age) : "",
    gender: mode === "edit" ? profile?.gender ?? "" : "",
    about: mode === "edit" ? profile?.about ?? "" : "",
    github: mode === "edit" ? profile?.github ?? "" : "",
    linkedin: mode === "edit" ? profile?.linkedin ?? "" : "",
  });

  const [skills, setSkills] = useState(
    mode === "edit" && profile ? profile.skills.join(", ") : "",
  );
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    skills: "",
    about: "",
    age: "",
    github: "",
    linkedin: "",
  });

  // Memory leak fix for photo preview
  useEffect(() => {
    // This will run when the component unmounts or when photoPreview changes
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("File is too large. Max size is 1MB.");
        return;
      }
      setPhoto(file);

      // Revoke old preview URL before creating a new one
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = { skills: "", about: "", age: "", github: "", linkedin: "" };
    let isValid = true;
    const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
    if (skillsArray.length === 0) {
      newErrors.skills = "At least one skill is required.";
      isValid = false;
    } else if (skillsArray.length > 15) {
      newErrors.skills = "You can add a maximum of 15 skills.";
      isValid = false;
    }

    if (formData.about.length > 300) {
      newErrors.about = "About section cannot exceed 300 characters.";
      isValid = false;
    }
    
    if (formData.age) {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
        newErrors.age = "Please enter a valid age between 18 and 99.";
        isValid = false;
      }
    }

    if (formData.github && !urlRegex.test(formData.github)) {
      newErrors.github = "Please enter a valid URL for your GitHub profile.";
      isValid = false;
    }

    if (formData.linkedin && !urlRegex.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid URL for your LinkedIn profile.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const payload = {
        skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        about: formData.about,
        github: formData.github,
        linkedin: formData.linkedin,
      };

      const profilePromise =
        mode === "create"
          ? createProfile(payload)
          : updateProfile(payload);

      const profileResponse = await profilePromise;
      dispatch(setProfile(profileResponse.profile));

      if (photo) {
        try {
          const photoResponse = await updateProfilePhoto(photo);
          dispatch(setProfile(photoResponse.profile));
        } catch (err) {
          toast.error("Profile data saved, but failed to upload photo.");
        }
      }

      toast.success(
        `Profile ${mode === "create" ? "created" : "updated"} successfully!`,
      );
      navigate(mode === "create" ? "/feed" : "/profile");

    } catch (err: unknown) {
      const message = (axios.isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined) || `Unable to ${mode} profile`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const currentPhoto = photoPreview ?? profile?.photoURL ?? `https://placehold.co/150x150?text=Avatar`;

  return (
    <div className="w-full max-w-xl rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold">
        {mode === "create" ? "Complete Your Profile" : "Edit Profile"}
      </h1>
      <p className="mt-2 mb-8 text-base-content/60">
        {mode === "create"
          ? "Tell other developers about yourself."
          : "Update your profile information."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={currentPhoto} alt="Profile Preview" />
            </div>
          </div>
          <div>
            <label htmlFor="photo-upload" className="btn btn-outline">
              Change Photo
            </label>
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <p className="mt-2 text-xs text-base-content/60">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="divider"/>

        <div className="form-control">
          <label htmlFor="skills" className="label">
            <span className="label-text">Skills</span>
          </label>
          <input
            id="skills"
            placeholder="Skills (e.g., React, Node, Java)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className={`input input-bordered w-full ${errors.skills ? "input-error" : ""}`}
            required
            autoFocus
          />
           {errors.skills && <p className="mt-1 text-xs text-error">{errors.skills}</p>}
        </div>

        <div className="form-control">
          <label htmlFor="about" className="label">
            <span className="label-text">About</span>
          </label>
          <textarea
            id="about"
            rows={4}
            name="about"
            placeholder="A brief bio"
            value={formData.about}
            onChange={handleChange}
            className={`textarea textarea-bordered w-full ${errors.about ? "textarea-error" : ""}`}
          />
          {errors.about && <p className="mt-1 text-xs text-error">{errors.about}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="form-control">
             <label htmlFor="age" className="label">
              <span className="label-text">Age</span>
            </label>
            <input
              id="age"
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className={`input input-bordered w-full ${errors.age ? "input-error" : ""}`}
            />
            {errors.age && <p className="mt-1 text-xs text-error">{errors.age}</p>}
          </div>
          <div className="form-control">
            <label htmlFor="gender" className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-control">
          <label htmlFor="github" className="label">
            <span className="label-text">GitHub URL</span>
          </label>
          <input
            id="github"
            name="github"
            type="url"
            placeholder="https://github.com/username"
            value={formData.github}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.github ? "input-error" : ""}`}
          />
          {errors.github && <p className="mt-1 text-xs text-error">{errors.github}</p>}
        </div>
        
        <div className="form-control">
          <label htmlFor="linkedin" className="label">
            <span className="label-text">LinkedIn URL</span>
          </label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedin}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.linkedin ? "input-error" : ""}`}
          />
           {errors.linkedin && <p className="mt-1 text-xs text-error">{errors.linkedin}</p>}
        </div>

        <button
          disabled={loading}
          className="btn btn-primary w-full !mt-6"
        >
          {loading ? <span className="loading loading-spinner" /> : (mode === "create" ? "Create Profile" : "Save Changes")}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
