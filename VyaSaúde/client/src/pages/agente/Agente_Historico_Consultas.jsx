import "./Agente.css";
import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
import PageTitle from "@components/PageTitle/Index.tsx";
import PageWIP from "@components/PageWIP/Index.jsx";
import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import HomeAddress from '@components/Sidenav/iconsSideBar/HomeAddress.png';
import AddUserMale from '@components/Sidenav/iconsSideBar/AddUserMale.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';

function Agente_Historico_Consultas() {
   return (
      <div className="app">
         <Header/>
         <Sidenav/>
         <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />} items={[{ label: 'Home', href: '' }]} />
         <NavBar items={[
            { label: 'Home', href: '/agente/home', icon: HomeAddress },
            { label: 'Pacientes', href: '/agente/paciente', icon: AddUserMale },
            { label: 'Agenda', href: '/agente/historico-visitas', icon: query },
            { label: 'Dash', href: '/agente/dashboards', icon: dashIcon }
         ]} />
         <main className="content-home content-pages-home">
            <PageTitle title="Histórico de Consultas" />

            <PageWIP />

         </main>
      </div>
   )
}

export default Agente_Historico_Consultas;