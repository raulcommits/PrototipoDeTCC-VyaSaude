import './Index.css';
import { getUser } from '../../helpers/auth.js';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import logo from "../../../public/logo.svg";
import placeholder from "../../../public/placeholder.png";
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
      <header className='header'>
         <div className='logo_div cursorPointer' onClick={homeNavigate}>
            <img src={logo} alt="Logo"/>
            <div className="titulosEstilo2 tituloLogo">VyaSaúde</div>
         </div>
         <div className='accountmenu_div'>
            {/* <p>Tempo restante da sessão: {tempoRestante}</p> */}
            <div className='cursorPointer' onClick={profileNavigate}>
               <img className='accountmenu_img' src={placeholder} alt="Placeholder" />
            </div>
            <span>{usuario?.nome}</span>
            <div className='cursorPointer' onClick={handleLogout}>
               <IoMdExit color="white" size={50} />
            </div>
         </div>
      </header>
   )
};

export default Header;