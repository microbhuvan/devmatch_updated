import ProfileForm from "../components/profile/ProfileForm";

const CreateProfile = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <ProfileForm mode="create" />
    </div>
  );
};

export default CreateProfile;
