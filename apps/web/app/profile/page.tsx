import TextPage from "@/components/layouts/text-page";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  return (
    <TextPage color="transparent" title={`${user?.fullName}’s profile`}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </TextPage>
  );
};

export default ProfilePage;
