import { getUser } from "@/auth.ts";

export function usePermissao(tipoPermitido) {
   const usuario = getUser();
   if (!usuario) return false;

   console.log("usuario usePermissao", usuario)

   return usuario.tipoPermitido === tipoPermitido;
}