import '../../App.scss';
import './Login.css';
import api from '../../services/api.js';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Recuperar() {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");

   async function handleRecovery(e) {
      e.preventDefault();
      
      try {
         const solicitarSenha = await api.put('/login/nova-senha', {email});
         toast.success('Senha solicitada com sucesso.', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
         });
         console.log(solicitarSenha.data.response)
         navigate("/login")
      } catch(err) {
         console.log(err);
         toast.success('Erro ao solicitar a senha.', {
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

            <Form className="" onSubmit={handleRecovery}>
               {/* Título */}
               <div className="d-block p-3">
                  <Form.Label className='d-flex justify-content-center fw-bolder h4 m-2'> Recuperação de senha</Form.Label>
               </div>
               
               <div className="m-2">
                  {/* Campo Email */}
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <svg 
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                     <Form.Control value={email} onChange={(e) => {setEmail(e.target.value)}} type='email' placeholder='E-mail' className='border-2 border-dark border-opacity-25 rounded-3'/>
                  </div>

                  {/* Divisória */}
                  <div className="d-block py-3">
                     <hr className="border border-dark border-2 opacity-50"/>
                  </div>

                  {/* Botão pra solicitar recuperação */}
                  <div className="d-flex justify-content-center py-2">
                     <button id="btn_acessar" className="btn btn-light border-dark border-opacity-75 px-4 py-2" type='submit'>Solicitar recuperação</button>
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

export default Recuperar