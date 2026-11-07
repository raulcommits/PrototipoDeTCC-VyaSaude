import { Navigate } from "react-router-dom";
import { getUser } from "@helpers/auth.ts";

// Função que verifica se o usuario logado pode acessar o componente. Caso não, retorna pra tela de login.
// tipoPermitido: Recebe do { getUser } os dados do usuário logado, e depois verifica se o tipo desse usuário (tipoUsuario) pode acessar o componente ou não (definido em App.jsx).
// Children: Caso passe pelas validações, o "return children" permite que o componente seja renderizado.

function AccessControl({ children, tipoPermitido }) {
   const usuario = getUser();
   
   if (!usuario) return <Navigate to="/login" />;

   if (usuario.tipoUsuario !== tipoPermitido) {
      return <Navigate to={`/${usuario.tipoUsuario}_home`} />;
   }
   return children;
}

export default AccessControl;