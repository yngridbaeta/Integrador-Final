import { useEffect, useState } from "react";
import axios from "axios";

// Componentes 
import Menu from "../Componentes/Menu";
import Rodape from "../Componentes/Rodape";
import ModalCadastro from "../Componentes/ModalCadastro";
import ModalExcluir from "../Componentes/ModalExcluir";

// Estilo da pagina
import estilos from "./Dados.module.css";

// Imagens de ação
import imgExportar from "../assets/exportar.png";
import imgMais from "../assets/mais.png";
import imgExcluir from "../assets/excluir.png";
import imgEditar from "../assets/editar.png";

function Ambientes() {
    // Estados da página
    const [ambientes, setAmbientes] = useState([]);
    const [sigBusca, setSigBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [ambienteEditando, setAmbienteEditando] = useState(null);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);

    const token = localStorage.getItem("access");

    //Função para buscar ambientes na API com filtro SIG
    const carregarAmbientes = () => {
        if (!token) {
            console.warn("Token de autenticação não encontrado.");
            return;
        }

        axios
            .get(`http://localhost:8000/api/ambientes/?sig=${sigBusca}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => setAmbientes(response.data))
            .catch((error) => console.error("Erro ao buscar ambientes:", error));
    };

    // Delay da busca por SIG
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            carregarAmbientes();
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [sigBusca]);

    // Exportar dados da API para planilha Excel
    const baixarExcel = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/ambientes/export/", {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ambientes.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao exportar:", error);
            alert("Falha ao exportar dados.");
        }
    };

    // enviar dados do formulário (criar ou editar)
    const handleSubmit = (dados) => {
        const url = ambienteEditando
            ? `http://localhost:8000/api/ambientes/${ambienteEditando.id}/`
            : "http://localhost:8000/api/ambientes/";

        const method = ambienteEditando ? axios.put : axios.post;

        method(url, dados, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert(ambienteEditando ? "Ambiente atualizado!" : "Ambiente cadastrado!");
                setModalAberto(false);
                setAmbienteEditando(null);
                carregarAmbientes();
            })
            .catch((err) => {
                console.error("Erro ao salvar ambiente:", err);
                alert("Erro ao salvar ambiente.");
            });
    };

    // Excluir ambiente
    const handleExcluir = (id) => {
        axios
            .delete(`http://localhost:8000/api/ambientes/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                alert("Ambiente excluído com sucesso.");
                setModalExcluirAberto(false);
                carregarAmbientes();
            })
            .catch((error) => {
                console.error("Erro ao excluir ambiente:", error);
                alert("Erro ao excluir ambiente.");
            });
    };

    return (
        <>
            {/* Cabeçalho principal com navegação */}
            <Menu />

            <main className={estilos.main}>
                <header className={estilos.header}>
                    <h1>Ambientes</h1>
                </header>

                {/* Filtros e botões de ação */}
                <div className={estilos.maior}>
                    <section className={estilos.filtros}>
                        <label htmlFor="sig">SIG:</label>
                        <input
                            type="text"
                            id="sig"
                            name="sig"
                            placeholder="Digite o SIG"
                            value={sigBusca}
                            onChange={(e) => setSigBusca(e.target.value)}
                        />
                    </section>

                    <section className={estilos.botoesAcao}>
                        <button type="button" className={estilos.botao} onClick={baixarExcel}>
                            <img src={imgExportar} alt="Ícone de exportar" />
                            <span>Exportar Dados</span>
                        </button>

                        <button type="button" className={estilos.botao} onClick={() => setModalAberto(true)}>
                            <img src={imgMais} alt="Ícone de adicionar" />
                            <span>Novo Ambiente</span>
                        </button>
                    </section>
                </div>

                {/* Tabela de dados */}
                <section className={estilos.tabelaContainer}>
                    <div className={estilos.tabelaWrapper}>
                        <table className={estilos.tabela}>
                            <thead>
                                <tr>
                                    <th>SIG</th>
                                    <th>Descrição</th>
                                    <th>NI</th>
                                    <th>Responsável</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ambientes.length > 0 ? (
                                    ambientes.map((ambiente) => (
                                        <tr key={ambiente.id}>
                                            <td>{ambiente.sig}</td>
                                            <td>{ambiente.descricao}</td>
                                            <td>{ambiente.ni}</td>
                                            <td>{ambiente.responsavel}</td>
                                            <td className={estilos.acoes}>
                                                <img
                                                    src={imgEditar}
                                                    alt="Ícone de Editar"
                                                    onClick={() => {
                                                        setAmbienteEditando(ambiente);
                                                        setModalAberto(true);
                                                    }}
                                                />
                                                <img
                                                    src={imgExcluir}
                                                    alt="Ícone de Excluir"
                                                    onClick={() => {
                                                        setAmbienteSelecionado(ambiente);
                                                        setModalExcluirAberto(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Nenhum ambiente encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Rodapé da aplicação */}
            <Rodape />

            {/* Modal para adicionar ou editar ambiente */}
            <ModalCadastro
                tipo="ambiente"
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    setAmbienteEditando(null);
                }}
                onSubmit={handleSubmit}
                initialData={ambienteEditando}
            />

            {/* Modal de confirmação de exclusão */}
            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={() => setModalExcluirAberto(false)}
                onConfirm={handleExcluir}
                tipo="Ambiente"
                item={ambienteSelecionado}
            />
        </>
    );
}

export default Ambientes;
