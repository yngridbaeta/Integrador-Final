import Logo from '../assets/Logo.png';
import estilos from './Rodape.module.css'

const Rodape = () => {
  return (
    <footer>
      {/* Container principal */}
      <div className={estilos.conteudo}>
        
        {/* Logo com link para homepage  */}
        <a href="/home" aria-label="Ir para a página inicial" className={estilos.logo}>
          <img 
            src={Logo} 
            alt="Logo do site"
          />
        </a>
        
        {/* Texto de copyright */}
        <p className={estilos.descricaoRodape}>© 2025 Yngrid Baeta</p>
        
        {/* Link para documentação */}
       <a 
          href="./public/smartcity-documentacao.pdf" 
          className={estilos.linkDoc} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Clique aqui e acesse a documentação!
        </a>
      </div>
    </footer>
  )
}

export default Rodape;
