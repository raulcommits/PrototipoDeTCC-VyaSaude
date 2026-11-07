import styles from "./PageTitle.module.scss";
import { useNavigate } from 'react-router-dom';
import { GoReply } from "react-icons/go";

function PageTitle({ title }: {title: string}) {
   const navigate = useNavigate();

   return (
      <div className={styles.title}>
         <GoReply onClick={() => navigate(-1)}/>
         <h2>{title}</h2>
      </div>
   )
}

export default PageTitle;