import React from "react";
import { Link } from "react-router-dom";
import'../../App.scss';
import "./Index.css";
import WipIcon from "./wip.png"; // Substitua pelo caminho do seu ícone de ajuda

function PageWIP() {
  return (
      <>
         <section className="wipSection">
            <img src={WipIcon} className="wipIcon" />
            <h1 className="wipTitle tituloEstilo2">Página em Desenvolvimento</h1>
            <h4 className="wipSubTitle">Está página ainda está em construção</h4>
            <h5 className="wipText">Em breve está interface estará disponível, aguarde atualizações do desenvolvedor.<br />Caso precise, acesse a guia <Link to="/ajuda">Ajuda</Link>. Agradecemos a compreensão.</h5>
         </section>
      </>
  );
}

export default PageWIP;