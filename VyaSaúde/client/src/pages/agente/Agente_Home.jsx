import "./Agente.css";
import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
// import ButtonAjuda from "@components/ButtonAjuda/Index.jsx";
import { getUser } from "@helpers/auth.ts";

import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import BoxSimpleInfos from "@components/BoxSimpleInfos/Index.jsx";

import more from '@components/Sidenav/iconsSideBar/more.png';
import AddUserMale     from '@components/Sidenav/iconsSideBar/AddUserMale.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import UserManagerIcon from '@components/Sidenav/iconsSideBar/UserManagerIcon.png';
import HomeAddress     from '@components/Sidenav/iconsSideBar/HomeAddress.png';

function Agente_Home() {
   const usuario = getUser();
   
   return(
      <div className="app">
         <Header/>
         <Sidenav/>
         {/* <ButtonAjuda/> */}
         <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />} items={[{ label: 'Home', href: '' }]} />
         <NavBar items={[
            { label: 'Home', href: '/agente/home', icon: HomeAddress },
            { label: 'Pacientes', href: '/agente/paciente', icon: AddUserMale },
            { label: 'Agenda', href: '/agente/historico-visitas', icon: query },
            { label: 'Dash', href: '/agente/dashboards', icon: dashIcon }
         ]} />
         <main className="content-home agente">
            <div className="title_Home">
               <img src={more} id="logoMore"/><br /><br />
               <h2><b>Olá, {usuario.nome}!</b></h2>
               <h4>Bem-vindo(a) à sua área do agente.</h4>
            </div>

            {/* <p><b>Navegar para:</b></p> */}
            <div className="shortcutField paciente-home">
            </div>

            <div className="gridBoxOtherOptions">
               <BoxSimpleInfos
                  icon={AddUserMale}
                  title="Gerenciar Pacientes"
                  description="Cadastre ou altere informações de pacientes na plataforma"
                  linkTo="/agente/paciente"
                  buttonText="Acessar pacientes"
               />
               <BoxSimpleInfos
                  icon={query}
                  title="Agenda de Visitas"
                  description="Verifique as datas das últimas visitas realizadas e as próximas visitas agendadas"
                  linkTo="/agente/historico-visitas"
                  buttonText="Acessar agenda"
               />
               <BoxSimpleInfos
                  icon={UserManagerIcon}
                  title="Meu Perfil"
                  description="Verifique, edite e atualize suas informações pessoais (nome, endereço, telefone e email)"
                  linkTo="/agente/perfil"
                  buttonText="Visualizar perfil"
               />
               <BoxSimpleInfos
                  icon={HomeAddress}
                  title="Gerenciar Endereços"
                  description="Cadastre ou altere informações de endereços na plataforma"
                  linkTo="/agente/endereco"
                  buttonText="Acessar endereços"
               />
               <BoxSimpleInfos
                  icon={query}
                  title="Histórico de Consultas"
                  description="Área para visualizar o histórico de consultas, assim como consultas futuras"
                  linkTo="/agente/historico-consultas"
                  buttonText="Acessar consultas"
               />
               <BoxSimpleInfos
                  icon={dashIcon}
                  title="Área de Dashboards"
                  description="Visualize, altere e faça análises com nossos dashboards personalizados para melhor monitorar a saúde da sua região"
                  linkTo="/agente/dashboards"
                  buttonText="Ir para Dashboards"
               />
            </div>
         </main>
      </div>
   )
}

export default Agente_Home;