import { getLawyerProfileData } from "@/lib/api/add-lawyer";
import ManageLegalProfile from "./ManageLegalProfile";
import { getUserSession } from "@/lib/core/session";

const LawyerProfilePage = async () => {
  const user = await getUserSession();
 
  const lawyers = await getLawyerProfileData(user?.id);
  console.log("Update user profile ... post, edit ,delete from here..___-",user)
  return (
    <div>
      <ManageLegalProfile lawyer={user} getLawyers={lawyers || null}  ></ManageLegalProfile>
    </div>
  );
};

export default LawyerProfilePage;
