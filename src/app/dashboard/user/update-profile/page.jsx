import UpdateProfileClient from "@/Components/UpdateProfileClient";
import { getUserSession } from "@/lib/core/session";


const UpdateProfilePage = async () => {
  const session = await getUserSession();


  return <UpdateProfileClient user={session} />;
};

export default UpdateProfilePage;