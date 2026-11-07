import "./Agente.css";
import api from '@services/api.js';
import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { PatternFormat } from "react-number-format";
import { TextField, InputAdornment, IconButton, Pagination, Stack } from "@mui/material";

import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
import PageTitle from "@components/PageTitle/Index.tsx";
import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import HomeAddress from '@components/Sidenav/iconsSideBar/HomeAddress.png';
import AddUserMale from '@components/Sidenav/iconsSideBar/AddUserMale.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';

import Modal_NovoRegistro from "@components/Modal_NovoRegistro/Index.jsx";
import Modal_DetalhesRegistro from "@components/Modal_DetalhesRegistro/Index.jsx";

import { MdContentPasteSearch } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";
import { MdOutlineRefresh } from "react-icons/md";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Search, Clear } from "@mui/icons-material";

function Agente_Historico_Visitas() {
   const [exibirModal_novoRegistro, setNovoRegistro] = useState(false); // Abertura e fechamento do Modal de Novo Registro
   const [exibirModal_detalhesRegistro, setDetalhesRegistro] = useState(false); // Abertura e fechamento do Modal de Novo Registro

   const [recarregar, setRecarregar] = useState(false);
   
   const [registros, setRegistros] = useState([]);

   const [registroId, setRegistroId] = useState(undefined);

   const [busca, setBusca] = useState("");
   const [dataFiltro, setDataFiltro] = useState("");

   const [pagina, setPagina] = useState(1);
   const [linhasPorPagina] = useState(20);

   
   useEffect(() => {
      async function buscarRegistros() {
         try {
            const resposta = await api.get('/registro');
            const respostaArray = resposta.data;
            setRegistros(respostaArray)
            // console.log("Registros: ", resposta.data);
         } catch(err) {
            console.log(err);
         }
      };

      buscarRegistros();
   }, [recarregar]);


   const registrosFiltrados = registros.filter((row) => {
      // Normaliza os textos para minúsculo para facilitar a busca
      const termo = busca.toLowerCase();
      const nomePaciente = row.paciente?.nome?.toLowerCase() || "";
      const cpfPaciente = row.paciente?.cpf || "";
      const nomeAgente = row.agente?.nome_agente?.toLowerCase() || "";
      const dataRow = row.data_visita ? row.data_visita.split('T')[0] : "";

      // Verifica Texto (Nome, CPF ou Agente)
      const matchTexto = nomePaciente.includes(termo) || cpfPaciente.includes(termo) || nomeAgente.includes(termo);

      // Verifica Data (Se dataFiltro estiver vazio, ignora essa checagem retornando true)
      const matchData = dataFiltro ? dataRow === dataFiltro : true;

      return matchTexto && matchData;
   });

   // --- ESTADOS DA ORDENAÇÃO ---
   const [ordemCol, setOrdemCol] = useState(null); // Qual coluna? ex: 'paciente.nome'
   const [ordemDirecao, setOrdemDirecao] = useState('asc'); // 'asc' ou 'desc'

   // --- FUNÇÃO PARA MANIPULAR O CLIQUE NO CABEÇALHO ---
   const handleOrdenar = (coluna) => {
      const isAsc = ordemCol === coluna && ordemDirecao === 'asc';
      setOrdemDirecao(isAsc ? 'desc' : 'asc');
      setOrdemCol(coluna);
   };


   // --- LÓGICA DE ORDENAÇÃO DOS DADOS JÁ FILTRADOS ---
   const registrosOrdenados = [...registrosFiltrados].sort((a, b) => {
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
   
   // Esta é a lista que será renderizada no HTML (ao invés de registrosOrdenados)
   const itensAtuais = registrosOrdenados.slice(indexPrimeiroItem, indexUltimoItem);

   // Calcula o número total de páginas
   const totalPaginas = Math.ceil(registrosOrdenados.length / linhasPorPagina);

   // Função de mudança de página
   const handleChangePagina = (event, value) => {
      setPagina(value);
   };
      
   return (
      <div className="app">
         <Header/>
         <Sidenav/>
         <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />} items={[{ label: 'Home', href: '/agente/home' }, {label: 'Histórico de visitas domiciliares', href: 'agente/historico-visitas'}]} />
         <NavBar items={[
            { label: 'Home', href: '/agente/home', icon: HomeAddress },
            { label: 'Pacientes', href: '/agente/paciente', icon: AddUserMale },
            { label: 'Agenda', href: '/agente/historico-visitas', icon: query },
            { label: 'Dash', href: '/agente/dashboards', icon: dashIcon }
         ]} />
         <main className="content-pages">
            <div className="content-pages-agente">
               <div className="content-agente_histVisitas" >
                  <PageTitle title="Consulta de Visitas Domiciliares" />

                  <div className="cabecalho">
                     <div className="sessao">
                        <h4 className="h4 text-success">Registros realizados</h4>
                        <div className="botoes">
                           <Button variant="outline-success" className="icons" onClick={() => setNovoRegistro(true)}>
                              <MdAssignmentAdd />
                              <span> Novo registro</span>
                           </Button>
                           <Button variant="outline-success" className="icons" onClick={() => setRecarregar(!recarregar)}>
                              <MdOutlineRefresh />
                              <span> Recarregar lista</span>
                           </Button>
                        </div>
                     </div>

                     <div className="filtragem">
                        <h4 className="h4 text-success">Filtrar por</h4>
                        <div className="filtros">
                           {/* Campo de Busca (Texto) */}
                           <TextField
                              // label="Buscar Paciente, CPF ou Agente"
                              variant="outlined"
                              size="small"
                              value={busca}
                              placeholder="  Buscar Paciente, CPF ou Agente"
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

                           {/* Campo de Data */}
                           <TextField
                              label="Data da Visita"
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

                  <table className="table table-hover table-agente_histVisitas">
                     <thead>
                        <tr>
                           <th onClick={() => handleOrdenar('registro_visita')} style={{ cursor: 'pointer' }}>
                              Registro {ordemCol === 'registro_visita' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>

                           {/* Exemplo: Coluna Aninhada (paciente.nome) */}
                           <th onClick={() => handleOrdenar('paciente.nome')} style={{ cursor: 'pointer' }}>
                              Paciente {ordemCol === 'paciente.nome' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>

                           <th onClick={() => handleOrdenar('paciente.cpf')} style={{ cursor: 'pointer' }}>
                              CPF {ordemCol === 'paciente.cpf' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>

                           <th onClick={() => handleOrdenar('data_visita')} style={{ cursor: 'pointer' }}>
                              Data/Hora {ordemCol === 'data_visita' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>

                           <th onClick={() => handleOrdenar('agente.nome_agente')} style={{ cursor: 'pointer' }}>
                              Agente {ordemCol === 'agente.nome_agente' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>

                           <th onClick={() => handleOrdenar('motivo')} style={{ cursor: 'pointer' }}>
                              Motivo {ordemCol === 'motivo' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>

                           <th onClick={() => handleOrdenar('desfecho')} style={{ cursor: 'pointer' }}>
                              Desfecho {ordemCol === 'desfecho' ? (ordemDirecao === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-muted" style={{opacity: 0.3}}/>}
                           </th>
                           <th>Detalhes</th>
                        </tr>
                     </thead>

                     <tbody> 
                        {itensAtuais.length > 0 ? (
                           itensAtuais.map(registro => (
                              <tr key={registro.id}>
                                 <td><PatternFormat displayType="text" value={registro.registro_visita} format="######-###" mask=" "/></td>
                                 <td>{registro.paciente.nome}</td>
                                 <td><PatternFormat displayType="text" value={registro.paciente.cpf} format="###.###.###-##" mask=" "/></td>
                                 <td>{new Date(registro.data_visita).toLocaleString('pt-BR')}</td>
                                 <td>{registro.agente.nome_agente}</td>
                                 <td>{registro.motivo}</td>
                                 <td>{registro.desfecho}</td>
                                 <td>
                                    <div className="table-icons" onClick={() => (setRegistroId(registro.id), setDetalhesRegistro(true))}>
                                       <MdContentPasteSearch />
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="9" className="text-center p-4">Nenhum registro encontrado para sua busca.</td>
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
                     {/* Modal: Novo registro */}
                     {exibirModal_novoRegistro && <Modal_NovoRegistro onClose={() => setNovoRegistro(false)} onSuccess={() => {setRecarregar(!recarregar); setNovoRegistro(false)}} />}
                        
                     {/* Modal: Detalhes (mais informações) */}
                     {exibirModal_detalhesRegistro && <Modal_DetalhesRegistro onClose={() => setDetalhesRegistro(false)} registroId={registroId}/>} 
                  </div>
               </div>
            </div>
         </main>
      </div>
  );
}

export default Agente_Historico_Visitas;