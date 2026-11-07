import "./Agente_dashboards.css";
import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
import PageTitle from "@components/PageTitle/Index.tsx";
import { Link } from "react-router-dom";
import ButtonBack from "@components/ButtonBack/Index.jsx";
import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import { useEffect, useState } from 'react';
import api from '@services/api.js';
import HomeAddress from '@components/Sidenav/iconsSideBar/HomeAddress.png';
import UserManagerIcon from '@components/Sidenav/iconsSideBar/UserManagerIcon.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';
import SmallBarChart from '@components/SmallBarChart/SmallBarChart.jsx';
import zoom from '@icons/zoom.svg';
import close from '@icons/close.svg';

function Agente_Dashboards() {
   const [usuario, setUsuario] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [agente, setAgente] = useState(null);
   const [pacientes, setPacientes] = useState([]);
   const [visitas, setVisitas] = useState([]);
   const [periodo, setPeriodo] = useState('month'); // 'week' | 'month' | 'year'

   useEffect(() => {
      let mounted = true;
      const fetchAllData = async () => {
         setLoading(true);
         let dataError = null;
         
         const results = await Promise.allSettled([
            api.get('/login/me'),
            api.get('/agente/perfil'),
            api.get('/paciente'),
            api.get('/registro')
         ]);

         if (!mounted) return;

         const [userResult, agenteResult, pacientesResult, visitasResult] = results;

         if (userResult.status === 'fulfilled') {
            setUsuario(userResult.value.data);
         } else {
            console.error('Erro ao buscar usuário:', userResult.reason);
            dataError = 'Não foi possível carregar os dados do seu usuário.';
         }

         if (agenteResult.status === 'fulfilled') {
            setAgente(agenteResult.value.data.response || agenteResult.value.data);
         } else {
            console.error('Erro ao buscar perfil do agente:', agenteResult.reason);
            dataError = dataError || 'Não foi possível carregar seu perfil de agente.';
         }

         if (pacientesResult.status === 'fulfilled') {
            const pacientesData = pacientesResult.value.data.response || pacientesResult.value.data || [];
            setPacientes(Array.isArray(pacientesData) ? pacientesData : []);
         } else {
            console.error('Erro ao buscar pacientes:', pacientesResult.reason);
            setPacientes([]); 
         }

         if (visitasResult.status === 'fulfilled') {
            const visitasData = visitasResult.value.data.response || visitasResult.value.data || [];
            setVisitas(Array.isArray(visitasData) ? visitasData : []);
         } else {
            console.error('Erro ao buscar visitas:', visitasResult.reason);
            setVisitas([]);
         }

         setError(dataError);
         setLoading(false);
      };

      fetchAllData();
      return () => { mounted = false };
   }, []);
   
   const exportDashboardToPDF = () => {
      const el = document.getElementById('dashboard-printable');
      if (!el) return alert('Não foi possível encontrar o conteúdo para exportar.');

      const newWin = window.open('', '_blank', 'width=1000,height=800');
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map(n => n.outerHTML).join('\n');
      const printCSS = `
         <style>
            @page { size: auto; margin: 20mm; }
            body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #111; }
            .print-container { max-width: 900px; margin: 0 auto; }
            .logo-print { display:block; margin: 10px auto 18px auto; width: 160px; }
            .boxSimpleInfos { box-shadow: none; border-radius: 8px; border: 1px solid #ddd; }
         </style>
      `;
      const logoHtml = `<img src="/Logo.png" class="logo-print" alt="Logo"/>`;
      
      newWin.document.write(`<!doctype html><html><head><title>Dashboard do Agente - Relatórios</title>${styles}${printCSS}</head><body><div class="print-container">${logoHtml}${el.innerHTML}</div></body></html>`);
      newWin.document.close();
      newWin.focus();
      setTimeout(() => { newWin.print(); }, 600);
   }

   const getFilteredPacientes = () => {
      const now = new Date();
      let startDate;

      if (periodo === 'week') {
         startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      } else if (periodo === 'month') {
         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else { // year
         startDate = new Date(now.getFullYear(), 0, 1);
      }

      return pacientes.filter(p => {
         const createdAt = new Date(p.createdAt || p.data_criacao);
         return createdAt >= startDate;
      });
   };

   const renderChart = () => {
      const now = new Date();
      const filteredPacientes = getFilteredPacientes();

      if (periodo === 'week') {
         const days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            return {
               label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
               date: d.setHours(0,0,0,0)
            };
         }).reverse();

         const counts = days.map(day => filteredPacientes.filter(p => new Date(p.createdAt || p.data_criacao).setHours(0,0,0,0) === day.date).length);
         const labels = days.map(d => d.label);
         return <SmallBarChart labels={labels} data={counts} />;
      }

      if (periodo === 'month') {
         const weeks = Array.from({length: 4}).map((_, i) => `Semana ${i+1}`);
         const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
         const counts = weeks.map((_, i) => {
            const start = new Date(monthStart.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
            const end = new Date(start.getTime() + (6 * 24 * 60 * 60 * 1000));
            return filteredPacientes.filter(p => {
               const d = new Date(p.createdAt || p.data_criacao);
               return d >= start && d <= end;
            }).length;
         });
         return <SmallBarChart labels={weeks} data={counts} />;
      }
      
      // year
      const months = Array.from({ length: 12 }).map((_, i) => new Date(now.getFullYear(), i, 1).toLocaleString('pt-BR', { month: 'short' }));
      const counts = months.map((_, i) => filteredPacientes.filter(p => new Date(p.createdAt || p.data_criacao).getMonth() === i).length);
      return <SmallBarChart labels={months} data={counts} />;
   };

   // Métricas para os boxes
   const totalPacientes = pacientes.length;
   const visitasMesCorrente = visitas.filter(v => new Date(v.data_visita || v.createdAt).getMonth() === new Date().getMonth()).length;
   const imoveisVisitados = new Set(visitas.map(v => v.enderecoId || v.endereco_id)).size;
   const focosDengue = visitas.filter(v => v.foco_dengue === true).length;
   const imoveisFechados = visitas.filter(v => v.situacao_imovel === 'fechado').length;

   return(
      <div className="app">
         <div className="agente-dashboards">

            <Header/>
            <Sidenav/>
            <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />}
               items={[
                  { label: 'Home', href: '/agente/home' },
                  { label: 'Relatórios', href: '/agente/dashboards' }]
               }
            />
            <NavBar items={[ 
               { label: 'Home', href: '/agente/home', icon: HomeAddress },
               { label: 'Perfil', href: '/agente_perfil', icon: UserManagerIcon },
               { label: 'Visitas', href: '/agente_hist-visitas', icon: query },
               { label: 'Dash', href: '/agente_dashboards', icon: dashIcon }
            ]} />

            <main className="content-home content-pages-home">
               <PageTitle title="Relatórios" />
               {/* <p style={{margin: 0, color: '#666'}}>Visão geral das suas atividades e pacientes.</p> */}

               {loading && <div style={{ textAlign: 'center', padding: '50px' }}>Carregando informações...</div>}

               {!loading && (
                  <div id="dashboard-printable">
                     <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: '100%', maxWidth: 900, background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,.08)'}}>
                           
                           
                           <h2 style={{marginTop: 0}}>Informações do Usuário</h2>
                           <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 16}}>
                              <div>
                                 <p style={{margin: '6px 0'}}><strong>Nome:</strong> {agente?.nome ?? usuario?.nome ?? 'Não informado'}</p>
                                 <p style={{margin: '6px 0'}}><strong>E-mail:</strong> {agente?.email ?? usuario?.email ?? 'Não informado'}</p>
                                 <p style={{margin: '6px 0'}}><strong>Perfil:</strong> <span style={{textTransform: 'capitalize'}}>{usuario?.perfil ?? 'Não informado'}</span></p>
                              </div>
                              <div>
                                 <p style={{margin: '6px 0'}}><strong>CPF:</strong> {agente?.cpf ?? usuario?.cpf ?? 'Não informado'}</p>
                                 <p style={{margin: '6px 0'}}><strong>Telefone:</strong> {agente?.telefone ?? 'Não informado'}</p>
                              </div>
                           </div>

                           <div style={{display:'flex', gap:16, marginTop:12, flexWrap:'wrap', alignItems:'stretch' }}>
                              <div className="boxSimpleInfos" style={{flex: 1, minWidth: 200}}>
                                 <div className="headerLine"><h5><b>Pacientes Cadastrados</b></h5><img src={UserManagerIcon} className="headerImage" /></div>
                                 <div className="mainLine" style={{padding:12}}><div style={{fontSize:22, fontWeight:800}}>{totalPacientes}</div><div style={{color:'#666', marginTop:6}}>Total de pacientes vinculados</div></div>
                              </div>
                              <div className="boxSimpleInfos" style={{flex: 1, minWidth: 200}}>
                                 <div className="headerLine"><h5><b>Visitas no Mês</b></h5><img src={query} className="headerImage" /></div>
                                 <div className="mainLine" style={{padding:12}}><div style={{fontSize:22, fontWeight:800}}>{visitasMesCorrente}</div><div style={{color:'#666', marginTop:6}}>Visitas realizadas este mês</div></div>
                              </div>
                              <div className="boxSimpleInfos" style={{flex: 1, minWidth: 200}}>
                                 <div className="headerLine"><h5><b>Imóveis Cobertos</b></h5><img src={HomeAddress} className="headerImage" /></div>
                                 <div className="mainLine" style={{padding:12}}><div style={{fontSize:22, fontWeight:800}}>{imoveisVisitados}</div><div style={{color:'#666', marginTop:6}}>Imóveis únicos visitados</div></div>
                              </div>
                              <div className="boxSimpleInfos" style={{flex: 1, minWidth: 200}}>
                                 <div className="headerLine"><h5><b>Focos de Dengue</b></h5><img src={zoom} className="headerImage" /></div>
                                 <div className="mainLine" style={{padding:12}}><div style={{fontSize:22, fontWeight:800}}>{focosDengue}</div><div style={{color:'#666', marginTop:6}}>Focos encontrados no período</div></div>
                              </div>
                              <div className="boxSimpleInfos" style={{flex: 1, minWidth: 200}}>
                                 <div className="headerLine"><h5><b>Imóveis Fechados</b></h5><img src={close} className="headerImage" /></div>
                                 <div className="mainLine" style={{padding:12}}><div style={{fontSize:22, fontWeight:800}}>{imoveisFechados}</div><div style={{color:'#666', marginTop:6}}>Visitas não realizadas</div></div>
                              </div>
                           </div>

                           <hr style={{margin: '20px 0'}} />

                           <div>
                              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                 <h4 style={{marginBottom:8}}>Novos Pacientes Cadastrados</h4>
                                 <div style={{display:'flex', gap:8, alignItems:'center'}}>
                                    <span style={{fontSize:12, color:'#666', marginRight:6}}>Período:</span>
                                    <button onClick={() => setPeriodo('week')} className={periodo ==='week' ? 'periodBtn active' : 'periodBtn'}>Nesta Semana</button>
                                    <button onClick={() => setPeriodo('month')} className={periodo ==='month' ? 'periodBtn active' : 'periodBtn'}>Neste Mês</button>
                                    <button onClick={() => setPeriodo('year')} className={periodo ==='year' ? 'periodBtn active' : 'periodBtn'}>Neste Ano</button>
                                 </div>
                              </div>
                              {renderChart()}
                           </div>
                        </div>
                     </div>
                     <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
                        <button className="exportBtn" onClick={exportDashboardToPDF}>
                           Exportar para PDF
                        </button>
                     </div>
                  </div>
               )}
            </main>
         </div>
      </div>
   )
}

export default Agente_Dashboards;
