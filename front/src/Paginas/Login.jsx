import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import estilos from "./Login.module.css";

// Imagens
import imageLogin from "../assets/imageLogin.png";
import userIcon from "../assets/user.png";
import cadeadoIcon from "../assets/cadeado.png";

function Login() {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                username: nome,
                password: senha,
            });

            const { access } = response.data;
            localStorage.setItem('access', access);
            navigate('/home');

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Credenciais inválidas!');
        }
    };

    return (
        <main className={estilos.container}>
            {/*seção da esquerda com imagem e título */}
            <section className={estilos.ladoEsquerdo} aria-label="Apresentação da plataforma">
                <img src={imageLogin} alt="Cidade ao entardecer" className={estilos.fundoImagem} />
                <div className={estilos.textoOverlay}>
                    <p>Seja Bem-Vindo(a) à</p>
                    <h1>
                        <span className={estilos.nomeLogo1}>Smart</span>
                        <span className={estilos.nomeLogo2}>City</span>
                    </h1>
                    <p>Monitore, transforme a cidade com tecnologia inteligente!</p>
                </div>
            </section>

            {/*seção da direita com formulário de login */}
            <section className={estilos.ladoDireito} aria-label="Área de login do sistema">

                <form onSubmit={handleSubmit} className={estilos.boxLogin} aria-labelledby="titulo-login">
                    <h2 id="titulo-login">Login</h2>

                    <fieldset className={estilos.campo}>
                        <img src={userIcon} alt="" aria-hidden="true" />
                        <input
                            type="text"
                            id="usuario"
                            placeholder="Username"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </fieldset>

                    <fieldset className={estilos.campo}>
                        <img src={cadeadoIcon} alt="" aria-hidden="true" />
                        <input
                            type="password"
                            id="senha"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </fieldset>

                    <button type="submit" className={estilos.botao}>Entrar</button>
                </form>
            </section>
        </main>
    );
}

export default Login;
