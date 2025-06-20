import Menu from "../Componentes/Menu";
import estilos from "./Home.module.css";
import Rodape from "../Componentes/Rodape";
import ambienteImg from "../assets/ambiente.png";
import historicoImg from "../assets/historico.png";
import sensorImg from "../assets/sensor.png";
import GraficoPizza from "../Componentes/GraficoPizza";

function Home() {
    return (
        <>
            
            <Menu />
         
            <main>
                <div className={estilos.imagemPrincipal} aria-hidden="true"></div>

                <section className={estilos.cardsContainer} aria-label="Funcionalidades do sistema">

                    {/* Cada card representa uma funcionalidade */}
                    <article className={estilos.card}>
                        <img src={ambienteImg} alt="Ícone de ambiente" className={estilos.icone} />
                        <h2>Ambiente</h2>
                        <p>
                            Lista os locais onde os sensores estão instalados, como praças, corredores e pátios.
                            Cada ambiente possui sensores que coletam dados em tempo real.
                        </p>
                    </article>

                    <article className={estilos.card}>
                        <img src={historicoImg} alt="Ícone de histórico" className={estilos.icone} />
                        <h2>Histórico</h2>
                        <p>
                            Aqui você pode visualizar o registro completo dos dados coletados ao longo do tempo,
                            facilitando o acompanhamento das variações da cidade.
                        </p>
                    </article>

                    <article className={estilos.card}>
                        <img src={sensorImg} alt="Ícone de sensores" className={estilos.icone} />
                        <h2>Sensores</h2>
                        <p>
                            Visualize e gerencie os sensores que monitoram temperatura, umidade, luminosidade e fluxo de pessoas,
                            garantindo dados atualizados e confiáveis.
                        </p>
                    </article>
                </section>

                {/*seção de resumo e status dos sensores na cidade */}
                <section className={estilos.resumoCidade} aria-labelledby="resumo-cidade">
                    <h2 id="resumo-cidade">Resumo da Cidade</h2>

                    {/*legenda explicando o significado do gráfico */}
                    <article className={estilos.legendaSensores}>
                        <h4>Status dos Sensores</h4>
                        <p>
                            <span className={estilos.bolinhaAtivo}></span>
                            Ativo: Representa os sensores que estão funcionando e enviando dados normalmente.
                        </p>
                        <p>
                            <span className={estilos.bolinhaInativo}></span>
                            Inativo: Representa os sensores que não estão coletando ou transmitindo dados no momento.
                        </p>
                    </article>

                    {/* Gráfico de pizza com a representação do status */}
                    <article className={estilos.graficoPizza} aria-label="Gráfico de status dos sensores">
                        <GraficoPizza />
                        <div className={estilos.legSensores}>
                            <p><span className={estilos.bolinhaAtivo}></span>Ativo</p>
                            <p><span className={estilos.bolinhaInativo}></span>Inativo</p>
                        </div>
                    </article>
                </section>
            </main>

            {/* Rodapé com informações*/}
            <Rodape />
        </>
    );
}

export default Home;
