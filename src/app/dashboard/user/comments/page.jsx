
import UserCommentsClient from "@/Components/UserCommentsClient";
import { getCommentsByUser } from "@/lib/api/comments";
import { getUserSession } from "@/lib/core/session";


const UserCommentsPage = async () => {
  const session = await getUserSession();
  const comments = await getCommentsByUser(session?.id);
  console.log(session ,comments , "comments.....>><<<")

  return <UserCommentsClient comments={comments || []} />;
};

export default UserCommentsPage;