import ProfileForm from "../components/profile/ProfileForm";

const EditProfile = () => {
  return (
    <div className="mx-auto flex max-w-xl justify-center py-6 sm:py-10">
      <ProfileForm mode="edit" />
    </div>
  );
};

export default EditProfile;
