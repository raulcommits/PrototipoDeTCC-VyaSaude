import "../../App.scss";
import "./Agente.css";
import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
import PageTitle from "@components/PageTitle/Index.tsx";
import { Link  } from "react-router-dom";
import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import HomeAddress from '@components/Sidenav/iconsSideBar/HomeAddress.png';
import AddUserMale from '@components/Sidenav/iconsSideBar/AddUserMale.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';

function Agente_Home_Paciente() {
   return(
      <div className="app">
         <Header/>
         <Sidenav/>
         <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />} items={[{ label: 'Home', href: '/agente/home' }, {label: 'Cadastro', href: '/agente/paciente'}]} />
         <NavBar items={[
            { label: 'Home', href: '/agente/home', icon: HomeAddress },
            { label: 'Pacientes', href: '/agente/paciente', icon: AddUserMale },
            { label: 'Agenda', href: '/agente/historico-visitas', icon: query },
            { label: 'Dash', href: '/agente/dashboards', icon: dashIcon }
         ]} />
         <main className="content-home content-pages-home">
            <PageTitle title="Gerenciamento de Pacientes" />

            <div className="simpleBoxShadow">
               <h4>Selecione uma das opções abaixo</h4><br />

               <div className="shortcutField paciente-home">
                  <Link to='/agente/cadastrar-paciente'><div className="shortcutClick"><p>Cadastrar novo paciente</p></div></Link>
                  <Link to='/agente/alterar-paciente'><div className="shortcutClick"><p>Alterar pacientes</p></div></Link>
               </div>
            </div>
            <div></div>
         </main>
      </div>
   )
}

export default Agente_Home_Paciente;