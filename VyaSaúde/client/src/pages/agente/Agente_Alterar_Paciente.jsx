import "./Agente.css";
import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
import PageTitle from "@components/PageTitle/Index.tsx";
import api from '@services/api.js';
import { useNavigate  } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { PatternFormat } from "react-number-format";
import { TextField, InputAdornment, IconButton, Pagination, Stack } from "@mui/material";

import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import HomeAddress from '@components/Sidenav/iconsSideBar/HomeAddress.png';
import AddUserMale from '@components/Sidenav/iconsSideBar/AddUserMale.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';

import Modal_Agente_DetalhesPaciente from "@components/Modal_Agente_DetalhesPaciente/Index.jsx";

import { GoPersonAdd } from "react-icons/go";
import { MdContentPasteSearch, MdRefresh } from "react-icons/md";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Search, Clear } from "@mui/icons-material";

function Agente_Alterar_Paciente() {
   const navigate = useNavigate();

   const [exibirModal_Agente_DetalhesPaciente, setModal_Agente_DetalhesPaciente] = useState(false); // Abertura e fechamento do Modal de Novo Registro

   const [recarregar, setRecarregar] = useState(false);
   const [pacientes, setPacientes] = useState([]);
   const [pacienteId, setPacienteId] = useState(undefined);

   const [busca, setBusca] = useState("");
   const [dataFiltro, setDataFiltro] = useState("");

   const [pagina, setPagina] = useState(1);
   const [linhasPorPagina] = useState(25);
   
   useEffect(() => {
      async function buscarPacientes() {
         try {
            const resposta = await api.get('/paciente');
            setPacientes(resposta.data.response)
            console.log("Pacientes: ", resposta.data);
         } catch(err) {
            console.log(err);
         }
      };
      
      buscarPacientes();
   }, [recarregar]);
   
   
   const pacientesFiltrados = Array.isArray(pacientes) ? pacientes.filter((row) => {
      // Normaliza os textos para minúsculo para facilitar a busca
      const termo = busca.toLowerCase();
      if (!termo) return true
      
      console.log(pacientesFiltrados)
      console.log("foi")
      const nomePaciente = row.nome?.toLowerCase() || "";
      const cpfPaciente = row.cpf || "";
      const numSusPaciente = row.sus?.toLowerCase() || "";
      const telefone = row.telefone?.toLowerCase() || "";
      const email = row.email?.toLowerCase() || "";
      const estado_clinico = row.estado_clinico?.toLowerCase() || "";
      
      // Verifica Texto (Nome, CPF ou Agente)
      return (
         nomePaciente.includes(termo) || cpfPaciente.includes(termo) || numSusPaciente.includes(termo) ||  
         telefone.includes(termo) || email.includes(termo) || 
         estado_clinico.includes(termo)
      );
   }) : [];
   
   // --- ESTADOS DA ORDENAÇÃO ---
   const [ordemCol, setOrdemCol] = useState(null); // Qual coluna? ex: 'nome'
   const [ordemDirecao, setOrdemDirecao] = useState('asc'); // 'asc' ou 'desc'
   
   // --- FUNÇÃO PARA MANIPULAR O CLIQUE NO CABEÇALHO ---
   const handleOrdenar = (coluna) => {
      const isAsc = ordemCol === coluna && ordemDirecao === 'asc';
      setOrdemDirecao(isAsc ? 'desc' : 'asc');
      setOrdemCol(coluna);
   };
   
   
   // --- LÓGICA DE ORDENAÇÃO DOS DADOS JÁ FILTRADOS ---
   const pacientesOrdenados = [...pacientesFiltrados].sort((a, b) => {
      if (!ordemCol) return 0;
      
      // Função auxiliar para pegar valores aninhados (ex: paciente.nome)
      const getValor = (obj, caminho) => {
         return caminho.split('.').reduce((o, i) => (o ? o[i] : null), obj);
      };
      
      const valorA = getValor(a, ordemCol);
      const valorB = getValor(b, ordemCol);
      
      // Tratamento para nulos/undefined
      if (valorA === valorB) return 0;
      if (valorA === null || valorA === undefined) return 1;
      if (valorB === null || valorB === undefined) return -1;
      
      // Comparação
      let comparacao = 0;
      if (typeof valorA === 'string') {
         comparacao = valorA.localeCompare(valorB); // Ordenação alfabética correta
      } else {
         comparacao = valorA < valorB ? -1 : 1; // Números ou Datas
      }
      
      return ordemDirecao === 'asc' ? comparacao : -comparacao;
   });


   
   useEffect(() => {
      setPagina(1);
   }, [busca, dataFiltro]);

   const indexUltimoItem = pagina * linhasPorPagina;
   const indexPrimeiroItem = indexUltimoItem - linhasPorPagina;
   
   // Esta é a lista que será renderizada no HTML (ao invés de pacientesOrdenados)
   const itensAtuais = pacientesOrdenados.slice(indexPrimeiroItem, indexUltimoItem);

   // Calcula o número total de páginas
   const totalPaginas = Math.ceil(pacientesOrdenados.length / linhasPorPagina);

   // Função de mudança de página
   const handleChangePagina = (event, value) => {
      setPagina(value);
   };


   return(
      <div className="app">
         <Header/>
         <Sidenav/>
         <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />} items={[{ label: 'Home', href: '/agente/home' }, {label: 'Cadastro', href: '/agente/paciente'}, {label: 'Alterar cadastro de paciente', href: '/agente/alterar-paciente'}]} />
         <NavBar items={[
            { label: 'Home', href: '/agente/home', icon: HomeAddress },
            { label: 'Pacientes', href: '/agente/paciente', icon: AddUserMale },
            { label: 'Agenda', href: '/agente/historico-visitas', icon: query },
            { label: 'Dash', href: '/agente/dashboards', icon: dashIcon }
         ]} />
         <main className="content-pages">
            <div className="content-pages-agente">
               <div className="content-agente_altUsuario">
                  <div className="title-pages">
                     <PageTitle title="Alterar informações de paciente" />

                     <div className="title-button">
                        <Button variant="outline-success" className="icons" onClick={() => navigate('/agente/cadastrar-paciente')}>
                           <GoPersonAdd />
                           <span> Novo cadastro</span>
                        </Button>

                        <Button variant="outline-success" className="icons" onClick={() => setRecarregar(!recarregar)}>
                           <MdRefresh />
                           <span> Recarregar lista</span>
                        </Button>
                     </div>
                  </div>

                  <div className="cabecalho">
                     <div className="filtragem">
                        <h4 className="h4 text-success">Filtrar por</h4>
                        <div className="filtros">
                           {/* Campo de Busca (Texto) */}
                           <TextField
                              // label="Buscar Paciente, CPF ou Agente"
                              variant="outlined"
                              size="small"
                              value={busca}
                              placeholder=" Buscar paciente pelo nome, CPF, SUS, telefone ou email  "
                              onChange={(e) => setBusca(e.target.value)}
                              InputProps={{
                                 startAdornment: (
                                    <InputAdornment position="start">
                                       <Search color="action" />
                                    </InputAdornment>
                                 ),
                                 endAdornment: busca && (
                                    <InputAdornment position="end">
                                       <IconButton size="small" onClick={() => setBusca("")}>
                                          <Clear fontSize="small" />
                                       </IconButton>
                                    </InputAdornment>
                                 )
                              }}
                           />

                           {/* Campo de filtro pela Data de Nascimento */}
                           <TextField
                              label="Data de nascimento"
                              type="date"
                              variant="outlined"
                              size="small"
                              value={dataFiltro}
                              onChange={(e) => setDataFiltro(e.target.value)}
                              InputLabelProps={{
                                 shrink: true,
                              }}
                           />
                        </div>
                     </div>
                  </div>

                  <br></br>

                  <table className="table table-hover table-agente_altUsuario">
                     <thead>
                        <tr>
                           <th onClick={() => handleOrdenar('nome')}>
                              <div className="nome" >
                                 Nome {ordemCol === 'nome' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           {/* Exemplo: Coluna Aninhada (paciente.nome) */}
                           <th onClick={() => handleOrdenar('cpf')}>
                              <div>
                                 CPF {ordemCol === 'cpf' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           <th onClick={() => handleOrdenar('sus')}>
                              <div>
                                 SUS {ordemCol === 'sus' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           <th onClick={() => handleOrdenar('data_nascimento')}>
                              <div>
                              Data de Nascimento {ordemCol === 'data_nascimento' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           <th onClick={() => handleOrdenar('telefone')}>
                              <div>
                              Telefone {ordemCol === 'telefone' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           <th onClick={() => handleOrdenar('email')}>
                              <div>
                              Email {ordemCol === 'email' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           <th onClick={() => handleOrdenar('estado_clinico')}>
                              <div>
                              Estado Clínico {ordemCol === 'estado_clinico' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                              </div>
                           </th>

                           <th>Detalhes</th>
                        </tr>
                     </thead>

                     <tbody> 
                        {itensAtuais.length > 0 ? (
                           itensAtuais.map(paciente => (
                              <tr key={paciente.id}>
                                 <td>{paciente.nome}</td>
                                 <td><PatternFormat displayType="text" value={paciente.cpf} format="###.###.###-##" mask=" "/></td>
                                 <td><PatternFormat displayType="text" value={paciente.sus} format="### #### #### ####" mask=" "/></td>
                                 <td>{new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}</td>
                                 <td><PatternFormat displayType="text" value={paciente.telefone} format={(paciente.telefone || "").replace(/\D/g, '').length > 10 ? "(##) # ####-####" : "(##) ####-####"} mask=" "/></td>
                                 <td>{paciente.email}</td>
                                 <td>{paciente.estado_clinico}</td>

                                 <td>
                                    <div className="table-icons" onClick={() => (setPacienteId(paciente.cpf), setModal_Agente_DetalhesPaciente(true))}>
                                       <MdContentPasteSearch />
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="9" className="text-center p-4">Nenhum paciente encontrado para sua busca.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
                  
                  <div className="paginacao">
                     <Stack spacing={2}>
                        <Pagination 
                           count={totalPaginas} 
                           page={pagina} 
                           onChange={handleChangePagina} 
                           color="primary" 
                           shape="rounded"
                           showFirstButton 
                           showLastButton
                        />
                     </Stack>
                  </div>

                  <div>
                     {/* Modal: Detalhes (mais informações) */}
                     {exibirModal_Agente_DetalhesPaciente && <Modal_Agente_DetalhesPaciente onClose={() => setModal_Agente_DetalhesPaciente(false)} pacienteId={pacienteId}/>} 
                  </div>
               </div>
            </div>
         </main>
      </div>
   )
}

export default Agente_Alterar_Paciente;