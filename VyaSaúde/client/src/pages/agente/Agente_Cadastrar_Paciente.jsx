import "./Agente.css";
import Header from "@components/Header/Index.jsx";
import Sidenav from "@components/Sidenav/Index.tsx";
import PageTitle from "@components/PageTitle/Index.tsx";
import api from '@services/api.js';
import cboData from '../../data/cbo2002_KeyedJson.json';
import { useNavigate  } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useVerificarCEP } from '@hooks/useVerificarCEP.js';
import { TextField, Select, MenuItem, FormControl, InputLabel, ListSubheader, Switch, Autocomplete } from "@mui/material";
import { PatternFormat } from 'react-number-format';
// import { Button } from 'react-bootstrap';

import Breadcrumb from "@components/Breadcrumb/Index.jsx";
import NavBar from "@components/NavBar/Index.jsx";
import HomeAddress from '@components/Sidenav/iconsSideBar/HomeAddress.png';
import AddUserMale from '@components/Sidenav/iconsSideBar/AddUserMale.png';
import query from '@components/Sidenav/iconsSideBar/query.png';
import dashIcon from '@components/Sidenav/iconsSideBar/dashIcon.png';
import { toast } from 'react-toastify';


// Função para remover acentos e deixar minúsculo
const normalizarTexto = (texto) => {
   return texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ""; // Tudo minúsculo
};

function Agente_Cadastrar_Paciente() {
   const navigate = useNavigate();

   const [buscaCBO, setBuscaCBO] = useState('');
   const [categoriaSelecionadaCBO, setCategoriaSelecionadaCBO] = useState('');
   const [profissaoAchada, setProfissaoAchada] = useState(null); // Estado para o item selecionado (objeto final)

   // 1. Extrair categorias únicas para o Select (dinamicamente)
   const categorias = useMemo(() => {
      const uniqueGroups = [
         ...new Set(cboData.map((item) => item.desc_grande_grupo)),
      ];
      return uniqueGroups.sort();
   }, []);

   const handleProfissao = (event, novoValor) => {
      // novoValor é o objeto selecionado (ex: { cbo2002ocupacao: 123, cbo_descricao: 'Médico' })
      setProfissaoAchada(novoValor);

      if (novoValor && typeof novoValor === 'object') {
         // Formata a string como você queria
         const stringFormatada = `${novoValor.cbo2002ocupacao} - ${novoValor.cbo_descricao}`;

         // Atualiza o formulário principal AQUI, apenas quando houver seleção
         setFormNovoPaciente((dados) => ({
            ...dados,
            profissao: stringFormatada,      // Campo visual/formatado
         }));
      } else {
         // Caso o usuário limpe o campo (se permitir limpar)
         setFormNovoPaciente((dados) => ({
            ...dados,
            profissao: null,
         }));
      }
   };

      // 2. Lógica de Filtragem
   const resultados = useMemo(() => {
      if (buscaCBO.length < 3 && !categoriaSelecionadaCBO) return []; // Regra dos 3 caracteres

      const termoBuscaLimpo = normalizarTexto(buscaCBO); // Termo de buscaCBO limpo uma única vez aqui para performance

      return cboData.filter((item) => {
         // 1. Filtro de Categoria
         const matchCategoria = categoriaSelecionadaCBO ? item.desc_grande_grupo === categoriaSelecionadaCBO : true;

         // 2. Filtro de Texto (Inteligente)
         let matchTexto = true;
         
         if (buscaCBO.length >= 3) {
            // Normalizamos a descrição do item do JSON
            const descricaoLimpa = normalizarTexto(item.cbo_descricao);
            const codigoString = item.cbo2002ocupacao.toString();

            // Verifica se o termo limpo está dentro da descrição limpa OU no código
            matchTexto = descricaoLimpa.includes(termoBuscaLimpo) || codigoString.includes(termoBuscaLimpo);
         }
         return matchCategoria && matchTexto;
      });
   }, [buscaCBO, categoriaSelecionadaCBO, cboData]);

   
   const [formNovoPaciente, setFormNovoPaciente] = useState({
      nome: '',
      nome_social: '',
      cpf: null,
      sus: null,
      data_nascimento: '',
      genero: '',
      etnia: '',
      estado_civil: '',
      nacionalidade: '',
      naturalidade_estado: '',
      naturalidade_municipio: '',
      filiacao_mae: null,
      filiacao_pai: null,

      logradouro: '',
      numero: null,
      complemento: null,
      bairro: '',
      cidade: '',
      estado: '',
      cep: null,
      ponto_referencia: null,
      zonaId: '',

      tipo_imovel: '',
      tipo_material_imovel: '',
      tipo_animal: '',
      
      telefone: '',
      email: '',
      escolaridade: '',
      nome_instituicao: '',
      tipo_instituicao: '',
      estado_clinico: '',
      leitura: true,
      escrita: true,
      responsavel_legal: null,

      profissao: null
   });

   const handleFormChange = (e) => {
      const {name, value, type, checked} = e.target; // Recebe o tipo do input (input normal ou checkbox-switch), seu identificador (name) e o valor.
      const valor = type === 'checkbox' ? checked : value; // Se for um input do tipo checkbox, utiliza a prop checked, caso contrário, value.

      setFormNovoPaciente((dados) => ({
         ...dados,
         [name]: valor
      }));
   };

   const {cep, cepDados, erro, handleChangeCEP} = useVerificarCEP(setFormNovoPaciente);

   async function handleRegister(e) {
      e.preventDefault();

      // Realização do cadastro
      const { cpf, nome, email, numero, complemento, ponto_referencia, tipo_material_imovel, tipo_imovel, tipo_animal} = formNovoPaciente;
      
      try {
         try { // Verifica se o indivíduo a ser cadastrado existe
            const dados = {cpf, email};
            
            const verificarPaciente = await api.get(`/paciente/${formNovoPaciente.cpf}`, dados);
            
            if (verificarPaciente.data) {
               toast.error('Paciente já existe.', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light"
               });
               return;
            }
         } 
         catch (err) {
            if (err.response && err.response.status === 404) {
               console.log("Paciente não encontrado. Prosseguindo com cadastro...");
            } else {
               throw err; 
            }
         }
         
         // Primeiro: Será cadastrado um usuário pra permitir o acesso ao sistema, sendo o cpf a PK.
         const usuarioPayload = {cpf, nome, email, senha: "123456789", tipoUsuario: "paciente"};
         await api.post('/usuario', usuarioPayload);
         console.log("\n Usuário cadastrado com sucesso. \n")
         
         // Segundo: Após a criação do usuário, será cadastrado em seguida o endereço e o tipo de usuário com seus dados.
         const buscarZona = await api.get(`/zona/${formNovoPaciente.bairro}`);
         const novaZonaId = buscarZona.data.id;
         console.log("novaZonaId", novaZonaId);

         setFormNovoPaciente((dados) => ({...dados, zonaId: novaZonaId}));

         const enderecoPayload = {cep, numero: numero, complemento: complemento, logradouro: cepDados.logradouro, bairro: cepDados.bairro, cidade: cepDados.localidade, 
            estado: cepDados.uf, pais: "Brasil", ponto_referencia: ponto_referencia, id_zona: 112, id_material: tipo_material_imovel, id_imovel: tipo_imovel, id_animal: tipo_animal};

         const {data: enderecoResponse} = await api.post('/endereco', enderecoPayload);
         const enderecoCriadoId = enderecoResponse.id;
         console.log("\n Endereço cadastrado com sucesso. \n")

         // Terceiro: Com essa PK, esse usuário será salvo de acordo com seu tipo. Se for paciente, terá que completar o cadastro caso incompleto.
         const cadastroPayload = {...formNovoPaciente, zonaId: 1, id_endereco: enderecoCriadoId, id_agente: 1};
         try {
            await api.post(`/paciente`, cadastroPayload);
            console.log(`\n Paciente cadastrado com sucesso. \n`)
            toast.success('Paciente cadastrado com sucesso.', {
               position: "top-right",
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: false,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light"
            });
         }
         catch (err) {
            console.log(err);
         }
      } 
      catch(err) {
         console.error("Erro no fluxo de cadastro:", err);
         
         const mensagemErro = err.response?.data?.response || 'Erro interno ao cadastrar.';
         
         toast.error(mensagemErro, {
            position: "top-right", autoClose: 2000, theme: "light"
         });
      }
   }

   useEffect(() => {
      console.log("formNovoPaciente", formNovoPaciente);
   }, [formNovoPaciente])

   return(
      <div className="app">
         <Header/>
         <Sidenav/>
         <Breadcrumb homeIcon={<img src={HomeAddress} alt="Home" className="breadcrumb-home-icon" />} items={[{ label: 'Home', href: '/agente/home' }, {label: 'Cadastro', href: '/agente/paciente'}, {label: 'Cadastro de novo paciente', href: 'Agente_cad-usuario'}]} />
         <NavBar items={[
            { label: 'Home', href: '/agente/home', icon: HomeAddress },
            { label: 'Pacientes', href: '/agente/paciente', icon: AddUserMale },
            { label: 'Agenda', href: '/agente/historico-visitas', icon: query },
            { label: 'Dash', href: '/agente/dashboards', icon: dashIcon }
         ]} />
         <main className="content-pages">
            <div className="content-pages-agente">
               <div className="content-agente_cadUsuario">
                  <PageTitle title="Cadastrar novo paciente" />

                  <div className="elements-agente_cadUsuario">
                     <form id="form-novo_paciente-agente" onSubmit={handleRegister}>
                        <span className="h4 text-success subtitle">Informações de registro</span>
                        <div className="grid grid_1">
                           <TextField name="nome" label="Nome do Paciente" value={formNovoPaciente.nome} required variant="outlined" onChange={(e) => handleFormChange(e)}/>
                           <TextField name="nome_social" label="Nome Social (Opcional)" value={formNovoPaciente.nome_social} variant="outlined" onChange={(e) => handleFormChange(e)}/>
                        </div>
                        
                        <div className="grid grid_1">
                           <TextField name="filiacao_mae" label="Nome da mãe" value={formNovoPaciente.filiacao_mae} required variant="outlined" onChange={(e) => handleFormChange(e)}/>
                           <TextField name="filiacao_pai" label="Nome do pai" value={formNovoPaciente.filiacao_pai} required variant="outlined" onChange={(e) => handleFormChange(e)}/>
                        </div>

                        <div className="grid grid_2">
                           <PatternFormat name="cpf" required label="Número do CPF" value={formNovoPaciente.cpf} format="###.###.###-##" mask="_" customInput={TextField} variant="outlined" onValueChange={(values) => { handleFormChange({ target: { name: 'cpf', value: values.value }})}}/>
                           <PatternFormat name="sus" required label="Número do SUS" value={formNovoPaciente.sus} format="###.####.####.####" mask="_" customInput={TextField} variant="outlined" onValueChange={(values) => { handleFormChange({ target: { name: 'sus', value: values.value }})}}/>
                           <TextField name="data_nascimento" required label="Data de Nascimento" value={formNovoPaciente.data_nascimento} InputLabelProps={{ shrink: true }} type="date" variant="outlined" onChange={(e) => handleFormChange(e)}/>
                        </div>

                        <div className="grid grid_2">
                           <FormControl variant="outlined" required>
                              <InputLabel id="selectGenero">Gênero</InputLabel>
                              <Select className="select-agente_cadUsuario" name="genero" value={formNovoPaciente.genero} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectGenero" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Masculino">Masculino</MenuItem>
                                 <MenuItem value="Feminino">Feminino</MenuItem>
                                 <MenuItem value="Não-Binário">Não-binário</MenuItem>
                                 <MenuItem value="Outro">Outro</MenuItem>
                              </Select>
                           </FormControl>

                           <FormControl variant="outlined" required>
                              <InputLabel id="selectEtnia">Etnia</InputLabel>
                              <Select className="select-agente_cadUsuario" name="etnia" value={formNovoPaciente.etnia} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectEtnia" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Branco">Branco(a)</MenuItem>
                                 <MenuItem value="Pardo">Pardo(a)</MenuItem>
                                 <MenuItem value="Preto">Preto(a)</MenuItem>
                                 <MenuItem value="Indígena">Indígena</MenuItem>
                                 <MenuItem value="Amarelo">Amarelo</MenuItem>
                                 <MenuItem value="Asiático">Asiático(a)</MenuItem>
                                 <MenuItem value="Outro">Outro</MenuItem>
                              </Select>
                           </FormControl>

                           <FormControl variant="outlined" required>
                              <InputLabel id="selectEstadoCivil">Estado Civil</InputLabel>
                              <Select className="select-agente_cadUsuario" name="estado_civil" value={formNovoPaciente.estado_civil} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectEstadoCivil" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Solteiro">Solteiro(a)</MenuItem>
                                 <MenuItem value="Casado">Casado(a)</MenuItem>
                                 <MenuItem value="Separado">Separado(a)</MenuItem>
                                 <MenuItem value="Viúvo">Viúvo</MenuItem>
                                 <MenuItem value="Outro">Outro</MenuItem>
                              </Select>
                           </FormControl>
                        </div>
                        
                        <div className="grid grid_2">
                           <FormControl variant="outlined" required>
                              <InputLabel id="selectNacionalidade">Nacionalidade</InputLabel>
                              <Select className="select-agente_cadUsuario" name="nacionalidade" value={formNovoPaciente.nacionalidade} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectNacionalidade" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Brasileiro">Brasileiro(a)</MenuItem>
                                 <MenuItem value="Estrangeiro">Estrangeiro(a)</MenuItem>
                                 <MenuItem value="Naturalizado">Naturalizado(a)</MenuItem>
                              </Select>
                           </FormControl>

                           <FormControl variant="outlined" required>
                              <InputLabel id="selectNaturalidade">Naturalidade</InputLabel>
                              <Select className="select-agente_cadUsuario" name="naturalidade_estado" value={formNovoPaciente.naturalidade_estado} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectNaturalidade" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <ListSubheader>Norte</ListSubheader>
                                    <MenuItem value="AC">Acre</MenuItem>
                                    <MenuItem value="AP">Amapá</MenuItem>
                                    <MenuItem value="AM">Amazonas</MenuItem>
                                    <MenuItem value="PA">Pará</MenuItem>
                                    <MenuItem value="RO">Rondônia</MenuItem>
                                    <MenuItem value="RR">Roraima</MenuItem>
                                    <MenuItem value="TO">Tocantins</MenuItem>
                                    
                                 <ListSubheader>Nordeste</ListSubheader>
                                    <MenuItem value="AL">Alagoas</MenuItem>
                                    <MenuItem value="BA">Bahia</MenuItem>
                                    <MenuItem value="CE">Ceará</MenuItem>
                                    <MenuItem value="MA">Maranhão</MenuItem>
                                    <MenuItem value="PB">Paraíba</MenuItem>
                                    <MenuItem value="PE">Pernambuco</MenuItem>
                                    <MenuItem value="PI">Piauí</MenuItem>
                                    <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                                    <MenuItem value="SE">Sergipe</MenuItem>

                                 <ListSubheader>Centro-Oeste</ListSubheader>
                                    <MenuItem value="DF">Distrito Federal</MenuItem>
                                    <MenuItem value="GO">Goiás</MenuItem>
                                    <MenuItem value="MT">Mato Grosso</MenuItem>
                                    <MenuItem value="MS">Mato Grosso do Sul</MenuItem>

                                 <ListSubheader>Sudeste</ListSubheader>
                                    <MenuItem value="ES">Espírito Santo</MenuItem>
                                    <MenuItem value="MG">Minas Gerais</MenuItem>
                                    <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                                    <MenuItem value="SP">São Paulo</MenuItem>

                                 <ListSubheader>Sul</ListSubheader>
                                    <MenuItem value="PR">Paraná</MenuItem>
                                    <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                                    <MenuItem value="SC">Santa Catarina</MenuItem>
                              </Select>
                           </FormControl>

                           <TextField name="naturalidade_municipio" label="Municipio" value={formNovoPaciente.naturalidade_municipio} required variant="outlined" onChange={(e) => handleFormChange(e)}/>
                        </div>
                              
                        <hr/>

                        <span className="h4 text-success subtitle">Endereço atual</span>
                        <div className="grid grid_2">
                           <PatternFormat name="cep" required label="CEP" value={formNovoPaciente.cep} variant="outlined" format="#####-###" mask=" " customInput={TextField}  onChange={handleChangeCEP}/>
                           <TextField name="logradouro" required value={formNovoPaciente.logradouro} variant="outlined" onChange={(e) => handleFormChange(e)} label="Logradouro"/>
                           <PatternFormat name="numero" required label="Número" value={formNovoPaciente.numero} format={(formNovoPaciente.numero || "").replace(/\D/g, '').length > 3 ? "#.###" : "###"} mask=" " customInput={TextField} variant="outlined" onChange={(e) => handleFormChange(e)}/>
                        </div>

                        <div className="grid grid_3">
                           <TextField name="complemento" value={formNovoPaciente.complemento} variant="outlined" onChange={(e) => handleFormChange(e)} label="Complemento (Opcional)"/>
                           <TextField name="ponto_referencia" readOnly value={formNovoPaciente.ponto_referencia} variant="outlined" onChange={(e) => handleFormChange(e)} label="Ponto de Referência (Opcional)"/>
                        </div>

                        <div className="grid grid_2">
                           <TextField name="bairro" readOnly required value={formNovoPaciente.bairro} variant="outlined" onChange={handleChangeCEP} label="Bairro"/>
                           <TextField name="cidade" readOnly required value={formNovoPaciente.cidade} variant="outlined" onChange={handleChangeCEP} label="Município"/>
                           <TextField name="estado" readOnly required value={formNovoPaciente.estado} variant="outlined" onChange={handleChangeCEP} label="Estado"/>
                        </div>

                        <div className="grid grid_2">
                           <FormControl variant="outlined" required>
                              <InputLabel id="selectTipoImovel">Tipo de imóvel</InputLabel>
                              <Select className="select-agente_cadUsuario" name="tipo_imovel" value={formNovoPaciente.tipo_imovel} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectTipoImovel" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="1">Casa</MenuItem>
                                 <MenuItem value="2">Apartamento</MenuItem>
                                 <MenuItem value="3">Comercial</MenuItem>
                                 <MenuItem value="4">Terreno</MenuItem>
                              </Select>
                           </FormControl>

                           <FormControl variant="outlined" required>
                              <InputLabel id="selectTipoMaterialImovel">Material do imóvel</InputLabel>
                              <Select className="select-agente_cadUsuario" name="tipo_material_imovel" value={formNovoPaciente.tipo_material_imovel} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectTipoMaterialImovel" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="1">Alvenaria</MenuItem>
                                 <MenuItem value="2">Madeira</MenuItem>
                                 <MenuItem value="3">Misto</MenuItem>
                                 <MenuItem value="4">Pré-fabricado</MenuItem>
                              </Select>
                           </FormControl>

                           <FormControl variant="outlined" required>
                              <InputLabel id="selectTipoAnimal">Possui animais domésticos?</InputLabel>
                              <Select className="select-agente_cadUsuario" name="tipo_animal" value={formNovoPaciente.tipo_animal} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectTipoAnimal" >
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="null">Não possui</MenuItem>
                                 <MenuItem value="1">Cachorro</MenuItem>
                                 <MenuItem value="2">Gato</MenuItem>
                                 <MenuItem value="3">Pássaro</MenuItem>
                                 <MenuItem value="4">Outros</MenuItem>
                              </Select>
                           </FormControl>
                        </div>

                        <hr/>

                        <span className="h4 text-success subtitle">Contato</span>
                        <div className="grid grid_1">
                           <PatternFormat 
                              name="telefone" 
                              required
                              label="Telefone" 
                              value={formNovoPaciente.telefone} 
                              format={
                                 (formNovoPaciente.telefone || "").replace(/\D/g, '')[2] === '9' ? "(##) # ####-####"  : "(##) ####-####"}
                              mask=" " 
                              customInput={TextField} 
                              variant="outlined" 
                              onValueChange={(values) => { 
                                 handleFormChange({ target: { name: 'telefone', value: values.value }})
                              }}
                           />

                           <TextField required name="email" label="Email" value={formNovoPaciente.email} type="email" variant="outlined" onChange={(e) => handleFormChange(e)}/>
                        </div>

                        <hr/>

                        <span className="h4 text-success subtitle">Profissão e Escolaridade</span>
                        <div className="grid grid_1">
                           <FormControl variant="outlined">
                              <InputLabel id="selectCBO">Categoria da Ocupação (Opcional)</InputLabel>
                              <Select defaultValue="0" className="select-agente_cadUsuario" name="escolaridade" value={categoriaSelecionadaCBO} variant="outlined" onChange={(e) => setCategoriaSelecionadaCBO(e.target.value)} labelId="selectCBO">
                                 <MenuItem disabled value="0">Selecione a categoria..</MenuItem>
                                 <MenuItem value="">Todas as categoria</MenuItem>
                                 {categorias.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                       {cat}
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>

                           <FormControl variant="outlined">
                              <Autocomplete
                                 id="cbo-autocomplete"
                                 className="form-autocompleteCBO"
                                 
                                 disableClearable={false}
                                 options={resultados}
                                 value={profissaoAchada}
                                 inputValue={buscaCBO}
                                 filterOptions={(items) => items} 

                                 onInputChange={(event, valor_input) => {setBuscaCBO(valor_input)}}
                                 onChange={handleProfissao}
                                 noOptionsText={buscaCBO.length < 3 ? "Digite pelo menos 3 caracteres..." : "Nenhum CBO encontrado."}
                                 
                                 getOptionLabel={(option) => {
                                    if (typeof option === 'string') return option;
                                    return `${option.cbo2002ocupacao} - ${option.cbo_descricao}`;
                                 }}
                                 
                                 renderOption={(props, option) => {
                                    const { key, ...otherProps } = props;
                                    return (
                                       <li key={key} {...otherProps} style={{ display: 'block'}}>
                                          <div className="form-autocomplete-li" >
                                             <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', color: '#666' }}>
                                                <span className="category-label">{option.desc_grande_grupo}</span>
                                             </div>
                                             <div style={{ display: "flex", fontWeight: '500'}} className="form-autocomplete-badge">
                                                <span className="form-autocomplete-badge-cod" style={{ marginRight: '5px' }}>{option.cbo2002ocupacao}</span>
                                                <span className="form-autocomplete-badge-desc">{option.cbo_descricao}</span>
                                             </div>
                                          </div>
                                       </li>
                                    );
                                 }}
                                 
                                 renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Ocupação ou Código (Opcional)"
                                    variant="outlined"
                                    type= 'search'
                                    InputProps={{
                                       ...params.InputProps,
                                    }}
                                    />
                                 )}
                              />
                           </FormControl>
                        </div>

                        <div className="grid grid_2">
                           <FormControl variant="outlined" required>
                              <InputLabel id="selectEscolaridade">Escolaridade</InputLabel>
                              <Select className="select-agente_cadUsuario" name="escolaridade" value={formNovoPaciente.escolaridade} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectEscolaridade">
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Não frequentou/Não sabe">Não frequentou/Não sabe</MenuItem>
                                 <MenuItem value="Ensino Infantil Incompleto">Ensino Infantil Incompleto</MenuItem>
                                 <MenuItem value="Ensino Infantil Completo">Ensino Infantil Completo</MenuItem>
                                 <MenuItem value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</MenuItem>
                                 <MenuItem value="Ensino Fundamental Completo">Ensino Fundamental Completo</MenuItem>
                                 <MenuItem value="Ensino Médio Incompleto">Ensino Médio Incompleto</MenuItem>
                                 <MenuItem value="Ensino Médio Completo">Ensino Médio Completo</MenuItem>
                                 <MenuItem value="Ensino Superior Incompleto">Ensino Superior Incompleto</MenuItem>
                                 <MenuItem value="Ensino Superior Completo">Ensino Superior Completo</MenuItem>
                              </Select>
                           </FormControl>

                           <TextField required name="nome_instituicao" label="Instituição de Ensino" value={formNovoPaciente.nome_instituicao} variant="outlined" onChange={(e) => handleFormChange(e)}/>
                           
                           <FormControl variant="outlined" required>
                              <InputLabel id="selectTipoInstituicao">Tipo de Instituição</InputLabel>
                              <Select className="select-agente_cadUsuario" name="tipo_instituicao" value={formNovoPaciente.tipo_instituicao} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectTipoInstituicao">
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Instituição Pública">Instituição Pública</MenuItem>
                                 <MenuItem value="Instituição Privada">Instituição Privada</MenuItem>
                              </Select>
                           </FormControl>
                        </div>

                        <div className="grid grid_2">
                           <FormControl variant="outlined" required>
                              <InputLabel id="selectEstadoClinico">Estado Clínico</InputLabel>
                              <Select className="select-agente_cadUsuario" name="estado_clinico" value={formNovoPaciente.estado_clinico} variant="outlined" onChange={(e) => handleFormChange(e)} labelId="selectEstadoClinico">
                                 <MenuItem hidden selected value>Selecione..</MenuItem>
                                 <MenuItem value="Saudável">Saudável</MenuItem>
                                 <MenuItem value="Em tratamento">Em tratamento</MenuItem>
                                 <MenuItem value="Observação">Observação</MenuItem>
                                 <MenuItem value="Paliativo">Paliativo</MenuItem>
                              </Select>
                           </FormControl>

                           <TextField name="responsavel_legal" label="Responsável Legal (se menor de 18 anos)" value={formNovoPaciente.responsavel_legal} type="text" variant="outlined" onChange={(e) => handleFormChange(e)}/>
                           
                           <div className="d-flex justify-content-around">
                              <div className="d-flex gap-5">
                                 <div>
                                    <InputLabel id="switchLeitura">Saber ler?</InputLabel>
                                    <Switch name="leitura" checked={formNovoPaciente.leitura} required id="switchLeitura" onChange={handleFormChange}/>
                                 </div>
                                 <div>
                                    <InputLabel id="switchEscrever">Saber escrever?</InputLabel>
                                    <Switch name="escrita" checked={formNovoPaciente.escrita} required id="switchEscrever" onChange={handleFormChange}/>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <hr/>
                     </form>
                  </div>
                  
                  {/* Botões pra voltar pra tela inicial/realizar cadastro */}
                  <div className="form-buttons">
                     <button className="btn btn-light border-dark border-opacity-75 px-4 py-2" onClick={() => {navigate('/agente/home')}}>Voltar pra tela inicial</button>
                     <button form="form-novo_paciente-agente" className="btn btn-light border-dark border-opacity-75 px-4 py-2">Realizar cadastro</button>
                     {/* <div style={{display: "flex", gap: "20px"}}>
                        {modoEdicao === false ? <Button variant="outline-success" onClick={() => {''}}>Cancelar</Button> : ""}
                        <Button variant="outline-success" onClick={() => setModoEdicao(!modoEdicao)}>{modoEdicao === false ? "Salvar alterações" : "Alterar Cadastro"}</Button>
                     </div> */}
                  </div>
               </div>
            </div>
         </main>
      </div>
   )
}

export default Agente_Cadastrar_Paciente;