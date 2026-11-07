import styles from "./Header.module.scss";
import { getUser } from "@helpers/auth.ts";
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import logo from "@icons/logo.svg";
import placeholder from "@icons/placeholder.png";
import { IoMdExit } from "react-icons/io";

interface Usuario {
   cpf: string;
   data_criacao: string;
   email: string;
   nome: string;
   tipoUsuario: string;
}

function Header() {
   const [carregando, setCarregando] = useState(true);

   const navigate = useNavigate();

   const handleLogout = useCallback(() => {
      navigate("/login");
      sessionStorage.removeItem("token");
   }, [navigate]);

   const [usuario, setUsuario] = useState<Usuario | null>(() => {
      const usuarioLogado = getUser() as Usuario;
      return usuarioLogado || null;
   });

   useEffect(() => {
      function obterUsuario() {
         const usuario = getUser() as Usuario;
         setUsuario(usuario);
         setCarregando(false);
      }
      obterUsuario();
   }, []);


   useEffect(() => {
      async function deslogar() {
         if (!carregando && !usuario) {
            handleLogout();
         }
      }
      deslogar();
   }, [carregando, usuario, handleLogout]);


   const homeNavigate = () => {
      if (usuario?.tipoUsuario) {
         navigate(`/${usuario.tipoUsuario}/home`);
      }
   };

   const profileNavigate = () => {
      if (usuario?.tipoUsuario) {
         navigate(`/${usuario.tipoUsuario}/perfil`);
      }
   }


   return (
      <header className={styles.header}>
         <div className={styles.logo} onClick={homeNavigate}>
            <img className={styles.logoImg} src={logo} alt="Logo" />
            <div className={styles.logoName}>VyaSaúde</div>
         </div>
         <div className={styles.accountDiv}>
            {/* <p>Tempo restante da sessão: {tempoRestante}</p> */}
            <div className={styles.user} onClick={profileNavigate}>
               <img className={styles.userImg} src={placeholder} alt="Placeholder" />
               <span className={styles.userName}>{usuario?.nome}</span>
            </div>
            <div className={styles.logout} onClick={handleLogout}>
               <IoMdExit color="white" size={50} />
            </div>
         </div>
      </header>
   )
};

export default Header;