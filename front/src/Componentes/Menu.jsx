// Importa a imagem da logo
import Logo from '../assets/Logo.png';
import estilos from './Menu.module.css';
import { NavLink } from 'react-router-dom';

// Componente que renderiza o menu de navegação 
const Menu = () => {
    return (
        <nav className={estilos.nav} aria-label="Menu principal de navegação">
            
            <div className={estilos.logo}>
                <NavLink to="/home">
                    <img 
                        src={Logo} 
                        alt="Logo do site"
                    />
                </NavLink> 
            </div>
             
            {/* Lista de navegação principal */}
            <ul className={estilos.menu}>

                {/* Link para a página de ambientes */}
                <li>
                    <NavLink 
                        to="/ambientes" 
                        // Se o link estiver ativo, aplica a classe 'ativo' para estilização
                        className={({ isActive }) => isActive ? estilos.ativo : undefined}
                    >
                        Ambientes
                    </NavLink>
                </li>

                {/* Link para a página de sensores */}
                <li>
                    <NavLink 
                        to="/sensores" 
                        className={({ isActive }) => isActive ? estilos.ativo : undefined}
                    >
                        Sensores
                    </NavLink>
                </li>

                {/* Link para a página de históricos */}
                <li>
                    <NavLink 
                        to="/historicos" 
                        className={({ isActive }) => isActive ? estilos.ativo : undefined}
                    >
                        Históricos
                    </NavLink>
                </li>

                <li className={estilos.buttonLogin}>
                    <NavLink 
                        to="/" 
                        //estilo específico se o link estiver ativo, senao usa o estilo padrão de login
                        className={({ isActive }) => isActive ? estilos.loginAtivo : estilos.loginLink}
                    >
                        Login
                    </NavLink>
                </li>

            </ul>
        </nav>
    );
}

export default Menu;
