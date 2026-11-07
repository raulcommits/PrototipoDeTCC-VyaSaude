import { Routes, Route } from "react-router-dom";
import AccessControl from "../pages/AccessControl.jsx"; // Verifica se o usuário logado pode acessar a página.

// ROTAS: AGENTE
import Agente_Home from "../pages/agente/Agente_Home.jsx";
import Agente_Home_Paciente from "../pages/agente/Agente_Home_Paciente.jsx";
import Agente_Cadastrar_Paciente from "../pages/agente/Agente_Cadastrar_Paciente.jsx";
import Agente_Alterar_Paciente from "../pages/agente/Agente_Alterar_Paciente.jsx";
import Agente_Home_Endereco from "../pages/agente/Agente_Home_Endereco.jsx";
// import Agente_Cadastrar_Endereco from '../pages/agente/Agente_Cadastrar_Endereco.jsx';
// import Agente_Alterar_Endereco from '../pages/agente/Agente_Alterar_Endereco.jsx';
import Agente_Historico_Visitas from "../pages/agente/Agente_Historico_Visitas.jsx";
import Agente_Historico_Consultas from "../pages/agente/Agente_Historico_Consultas.jsx";
import Agente_Perfil from "../pages/agente/Agente_Perfil.jsx";
import Agente_Dashboards from "../pages/agente/Agente_Dashboards.jsx";

export default function AgenteRoutes() {
	return (
		<Routes>
			{/* Rotas: Agente */}
			<Route
				path="/home"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Home />
					</AccessControl>
				}
			/>
			<Route
				path="/paciente"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Home_Paciente />
					</AccessControl>
				}
			/>
			<Route
				path="/cadastrar-paciente"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Cadastrar_Paciente />
					</AccessControl>
				}
			/>
			<Route
				path="/alterar-paciente"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Alterar_Paciente />
					</AccessControl>
				}
			/>
			<Route
				path="/endereco"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Home_Endereco />
					</AccessControl>
				}
			/>
			{/* <Route
				path="/cadastrar-endereco"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Cadastrar_Endereco />
					</AccessControl>
				}
			/>
			<Route
				path="/alterar-endereco"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Alterar_Endereco />
					</AccessControl>
				}
			/> */}
			<Route
				path="/historico-visitas"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Historico_Visitas />
					</AccessControl>
				}
			/>
			<Route
				path="/historico-consultas"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Historico_Consultas />
					</AccessControl>
				}
			/>
			<Route
				path="/perfil"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Perfil />
					</AccessControl>
				}
			/>
			<Route
				path="/dashboards"
				element={
					<AccessControl tipoPermitido="agente">
						<Agente_Dashboards />
					</AccessControl>
				}
			/>
		</Routes>
	);
}
