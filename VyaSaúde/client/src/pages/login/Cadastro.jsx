import '../../App.scss';
import './Login.css';
import api from '../../services/api.js';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { toast } from 'react-toastify';

function Cadastro() {
   const navigate = useNavigate();
   const [cpf, setCPF] = useState("");
   const [nome, setNome] = useState("");
   const [senha, setSenha] = useState("");
   const [email, setEmail] = useState("");
   
   async function handleRegister(e) {
      e.preventDefault();

      // Realização do cadastro
      try {
         // Verificação se o usuário já existe
         const payloadVerificacao = {cpf, email};
         const respostaVerificacao = await api.post('/usuarioCadastro/verificarDados', payloadVerificacao);

         if (respostaVerificacao?.data?.response === "Usuário já cadastrado no sistema.") {
            toast.error('Usuário já cadastrado no sistema.', {
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
         };

         // Cadastro do usuário
         const payloadCadastro = {cpf, nome, senha, email, tipoUsuario: "paciente"};
         await api.post('/usuarioCadastro', payloadCadastro);

         toast.success('Cadastro realizado com sucesso. Realize login para continuar', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
         });
         
         navigate("/login");
      } catch(err) {
         console.log(`Erro:`, err.response)
         toast.error('Erro desconhecido.', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
         });
         // alert(err?.response?.data?.response || "Erro desconhecido"); // ? = Verifica se o parametro antecedente ao ? possui algum dado ou se é nulo/indefinido. Caso seja a segunda opção, NÃO QUERBA o código, apenas prossegue com o código.
      }
      console.log("Enviando:", { cpf, nome, senha, email });
   }

   return (
      <main className="content-login_app-css">
         <div className='content-body-login_app-css'>

            {/* Logo */}
            <div className="d-block p-3">
                  <Form.Label className='d-flex justify-content-center fw-bolder h2 m-2 titulosEstilo3'>
                     {/* <img src={logo} id="logoMore"/> */}
                     VyaSaúde
                  </Form.Label>
               </div>

            <Form onSubmit={handleRegister} className="">
               {/* Título */}
               <div className="d-block p-3">
                  <Form.Label className='d-flex justify-content-center fw-bolder h4 m-2'>Cadastrar-se</Form.Label>
               </div>
               
               <div className="m-2">
                  {/* Campo Nome completo */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     width="233px" height="233px" viewBox="-1.12 -1.12 18.24 18.24" xmlns="http://www.w3.org/2000/svg" fill="#292157" className="bi bi-person-lines-fill" stroke="#292157" strokeWidth="0.4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.22400000000000003"></g><g id="SVGRepo_iconCarrier"> <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"></path> </g></svg>
                     <Form.Control value={nome} onChange={(e) => {setNome(e.target.value)}} type="text" placeholder="Nome completo" className="form-control border-2 border-dark border-opacity-25 rounded-3" required/>
                  </div>

                  {/* Campo CPF */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     width="233px" height="233px" viewBox="-1.12 -1.12 18.24 18.24" xmlns="http://www.w3.org/2000/svg" fill="#292157" className="bi bi-person-lines-fill" stroke="#292157" strokeWidth="0.4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.22400000000000003"></g><g id="SVGRepo_iconCarrier"> <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"></path> </g></svg>
                     <Form.Control  maxLength={11}  value={cpf} onChange={(e) => {setCPF(e.target.value)}} type="text" placeholder="CPF" className="form-control border-2 border-dark border-opacity-25 rounded-3" required/>
                  </div>
                  
                  {/* Campo Email */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                     <Form.Control  value={email} onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder="E-mail" className="form-control border-2 border-dark border-opacity-25 rounded-3" required/>
                  </div>

                  {/* Campo Confirmação de Email */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                     <Form.Control minLength={8} type="email" placeholder="Confirme o E-mail" className="form-control border-2 border-dark border-opacity-25 rounded-3"/>
                  </div>
                  
                  {/* Campo senha */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" /></svg>
                     <Form.Control value={senha} onChange={(e) => {setSenha(e.target.value)}} type="password" placeholder="Senha" className="form-control border-2 border-dark border-opacity-25 rounded-3" required/>
                  </div>

                  {/* Campo Confirmação de Senha */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" /></svg>
                     <Form.Control type="password" placeholder="Confirme a senha" className="form-control border-2 border-dark border-opacity-25 rounded-3"/>
                  </div>

                  {/* Divisória */}
                  <div className="d-block py-3">
                     <hr className="border border-dark border-2 opacity-50"/>
                  </div>

                  {/* Botão pra realizar cadastro */}
                  <div className="d-flex justify-content-center py-2">
                     <button type="submit" className="btn btn-light border-dark border-opacity-75 px-4 py-2">Realizar cadastro</button>
                  </div>

                  {/* Voltar pra tela de login */}
                  <div className="pt-4 forgotMyPassword">
                     <Link to="/login">Voltar pra tela de login</Link>
                  </div>
               </div>
            </Form>
         </div>

         <br />
         <span className='etecWaterMark'>Projeto desenvolvido para Etec de Embu das Artes - 2025</span>

      </main>
    )
}

export default Cadastro