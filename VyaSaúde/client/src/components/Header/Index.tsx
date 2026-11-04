import styles from "./Header.module.scss";
import { getUser } from '../../helpers/auth.ts';
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
         <div className={styles.logo_div} onClick={homeNavigate}>
            <img src={logo} alt="Logo" />
            <div className={styles.tituloLogo}>VyaSaúde</div>
         </div>
         <div className={styles.accountmenu_div}>
            {/* <p>Tempo restante da sessão: {tempoRestante}</p> */}
            <div className={styles.cursorPointer} onClick={profileNavigate}>
               <img className={styles.accountmenu_img} src={placeholder} alt="Placeholder" />
            </div>
            <span>{usuario?.nome}</span>
            <div className={styles.cursorPointer} onClick={handleLogout}>
               <IoMdExit color="white" size={50} />
            </div>
         </div>
      </header>
   )
};

export default Header;