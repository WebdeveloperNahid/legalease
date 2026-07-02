import AllTransactionsClient from "@/Components/AllTransactionClient";
import { getAllTransactions } from "@/lib/actions/transactions";
import { requireRole } from "@/lib/core/session";

const AllTransactionsPage = async () => {
  await requireRole("admin");

  const transactions = await getAllTransactions();
  const safeTransactions = JSON.parse(JSON.stringify(transactions));

  console.log(safeTransactions,"lkfsjdfl;ksadfj;lasjfal;dkf")

  return <AllTransactionsClient transactions={safeTransactions} />;
};

export default AllTransactionsPage;
