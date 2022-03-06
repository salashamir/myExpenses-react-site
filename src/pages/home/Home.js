import styles from "./Home.module.css";
// components
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
// auth context hook
import { useAuthContext } from "../../hooks/useAuthContext";
// collection hook
import { useCollection } from "../../hooks/useCollection";

export default function Home() {
  const { user } = useAuthContext();
  const { documents, error } = useCollection(
    "transactions",
    ["uid", "==", user.uid],
    ["createdAt", "desc"]
  );
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {error && <p>{error}</p>}
        {documents && <TransactionList transactions={documents} />}
      </div>
      <div className={styles.sidebar}>
        <TransactionForm uid={user.uid} />
      </div>
    </div>
  );
}
