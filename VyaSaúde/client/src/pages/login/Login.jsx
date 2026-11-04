import '../../App.scss';
import './Login.css';
import api from '../../services/api.js';
import { Form } from 'react-bootstrap';
import { IoPerson } from "react-icons/io5";
import { IoLockClosed } from "react-icons/io5";
import { Link, useNavigate  } from "react-router-dom";
import { useState } from 'react';
import { toast } from 'react-toastify';

function Login() {
   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [senha, setSenha] = useState("");
   const [loading, setLoading] = useState(false);
   
   async function handleLogin(e) {
      e.preventDefault();
      setLoading(true);

      // Tentativa de realização de login
      try {
         const loginPayload = {email, senha};

         const response = await api.post('/login', loginPayload); // Etapa de verificação dos dados inseridos
         sessionStorage.setItem("token", response.data.token);
         
         const token = sessionStorage.getItem("token");
         
         const usuarioLogado = await api.get('/login/me', {
            headers: {Authorization: `Bearer ${token}`}
         });

         toast.success('Login efetuado com sucesso.', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
         });
         
         console.log(`usuarioLogado: `, usuarioLogado.data);  
         navigate(`/${usuarioLogado.data.tipoUsuario}/home`);
      }
      catch(error) {
         console.log(error.response);
         
         toast.error('Erro ao realizar login.', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
         });
         
         if (!error.response) {
            // Erro de conexão (backend desligado)
            toast.error("Erro de conexão. Verifique se o servidor está online.");
            setLoading(false);
            return;
         };

         const status = error.response.status;
         const mensagemBackend = error.response.data.message;
         
         switch (status) {
            case 400:
               // Erro de validação (email sem @, campos vazios)
               toast.warning(mensagemBackend || "Preencha os campos corretamente.");
               break;

            case 401:
               // Credenciais Inválidas
               toast.error("E-mail ou senha incorretos.");
               break;

            case 403:
               // Usuário Inativo (Lógica que criamos no backend)
               toast.warning("Acesso negado: Usuário inativo no sistema.\n Regularize o seu cadastro em uma UBS.");
               break;

            case 500:
               // Erro no Servidor
               toast.error("Erro interno no servidor. Tente novamente mais tarde.");
               break;

            default:
               toast.error(`Erro inesperado: ${status}`);
         }
      } 
      finally {
         setLoading(false);
      };
   };

   return (
      <main className="content-login_app-css"> 
         <div className='content-body-login_app-css'>
            <form onSubmit={handleLogin}>
               <div className="d-block p-3">
                  <Form.Label className='d-flex justify-content-center fw-bolder h2 m-2 titulosEstilo3'>
                     VyaSaúde
                  </Form.Label>
               </div>
               <div className="d-block p-3">
                  <Form.Label className='d-flex justify-content-center fw-bolder h4 m-2'>Acesso ao sistema</Form.Label>
               </div>

               <div className="m-2">
                  <div className="fieldsEmailandPassword py-1">
                     <IoPerson/>
                     <Form.Control value={email} onChange={(e) => {setEmail(e.target.value)}} required type="email" placeholder="E-mail" className="form-control border-2 border-dark border-opacity-25 rounded-3"/>
                  </div>
                  
                  <div className="d-flex py-1 fieldsEmailandPassword">
                     <IoLockClosed />
                     <Form.Control value={senha} onChange={(e) => {setSenha(e.target.value)}} required type="password" placeholder="Senha" className="form-control border-2 border-dark border-opacity-25 rounded-3"/>
                  </div>

                  <div className="pt-4 forgotMyPassword">
                     <Link to="/recuperar">Esqueci minha senha</Link>
                  </div>

                  <div className="d-block py-2">
                     <hr className='border border-gray border-2 opacity-50'></hr>
                  </div>

                  <div className="d-flex justify-content-center py-2">
                     <button className="btn btn-light border-dark border-opacity-75 px-4 py-2" type='submit'>Acessar</button>
                  </div><br />
                  
                  <div className='py-2' id='sLogin-newCad'>
                     <p className='px-0 justify-content-end'>Ainda não possui login? <Link to="/cadastro" id='preRegister'>Realizar pré-cadastro</Link></p>
                  </div>
               </div>
            </form>
         </div>

         <br />
         <span className='etecWaterMark'>Projeto desenvolvido para Etec de Embu das Artes - 2025</span>
      </main>
   )
};

export default Login;