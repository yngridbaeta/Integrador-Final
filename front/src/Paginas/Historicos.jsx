import axios from "axios";
import { useEffect, useState } from "react";

//componentes
import Menu from "../Componentes/Menu";
import ModalCadastro from "../Componentes/ModalCadastro";
import ModalExcluir from "../Componentes/ModalExcluir";
import Rodape from "../Componentes/Rodape";

//imagens de ações
import imgExportar from "../assets/exportar.png";
import imgExcluir from "../assets/excluir.png";
import imgEditar from "../assets/editar.png";
import imgMais from "../assets/mais.png";

//estilo 
import estilos from "./Dados.module.css";

function Historico() {
    // Estados principais
    const [historico, setHistorico] = useState([]);
    const [idBusca, setIdBusca] = useState("");
    const [timestampStart, setTimestampStart] = useState("");
    const [timestampEnd, setTimestampEnd] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const [historicoEditando, setHistoricoEditando] = useState(null);
    const [registroSelecionado, setRegistroSelecionado] = useState(null);

    const token = localStorage.getItem("access");

    //Carrega registros de histórico com filtros aplicados
    const carregarHistorico = () => {
        if (!token) return;

        const params = new URLSearchParams();
        if (timestampStart) params.append("timestamp__gte", timestampStart);
        if (timestampEnd)   params.append("timestamp__lte", timestampEnd);
        if (idBusca)        params.append("id", idBusca);

        axios.get(`http://localhost:8000/api/historicos/?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setHistorico(response.data))
        .catch((error) => console.error("Erro ao buscar histórico", error));
    };

    // tempo da busca
    useEffect(() => {
        const delay = setTimeout(carregarHistorico, 400);
        return () => clearTimeout(delay);
    }, [idBusca, timestampStart, timestampEnd]);

    //exporta os dados do histórico em Excel
    const baixarExcel = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/historicos/export/", {
                responseType: "blob",
                headers: { Authorization: `Bearer ${token}` },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "historico.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao exportar:", error);
            alert("Falha ao exportar dados.");
        }
    };

    // formulário criação ou edição
    const handleSubmit = (dados) => {
        const url = historicoEditando
            ? `http://localhost:8000/api/historicos/${historicoEditando.id}/`
            : "http://localhost:8000/api/historicos/";

        const method = historicoEditando ? axios.patch : axios.post;

        method(url, dados, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            alert(historicoEditando ? "Registro atualizado!" : "Registro criado!");
            setModalAberto(false);
            setHistoricoEditando(null);
            carregarHistorico();
        })
        .catch((err) => {
            console.error("Erro ao salvar histórico:", err);
            alert("Erro ao salvar histórico.");
        });
    };

    //Excluir registro do histórico
    const handleExcluir = (id) => {
        axios.delete(`http://localhost:8000/api/historicos/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            alert("Registro excluído com sucesso.");
            setModalExcluirAberto(false);
            carregarHistorico();
        })
        .catch((error) => {
            console.error("Erro ao excluir registro", error);
            alert("Erro ao excluir registro.");
        });
    };

    return (
        <>
            <Menu />

            <main className={estilos.main}>
                <header className={estilos.header}>
                    <h1>Histórico</h1>
                </header>

                <div className={estilos.maior}>
                    {/* Filtros por ID e data*/}
                    <section className={estilos.filtros}>
                        <label htmlFor="id">ID:</label>
                        <input
                            type="number"
                            id="id"
                            value={idBusca}
                            onChange={(e) => setIdBusca(e.target.value)}
                            placeholder="Digite o ID"
                        />

                        <label htmlFor="timestampStart">Início:</label>
                        <input
                            type="datetime-local"
                            id="timestampStart"
                            value={timestampStart}
                            onChange={(e) => setTimestampStart(e.target.value)}
                        />

                        <label htmlFor="timestampEnd">Fim:</label>
                        <input
                            type="datetime-local"
                            id="timestampEnd"
                            value={timestampEnd}
                            onChange={(e) => setTimestampEnd(e.target.value)}
                        />
                    </section>

                    {/*botões principais */}
                    <section className={estilos.botoesAcao}>
                        <button type="button" className={estilos.botao} onClick={baixarExcel}>
                            <img src={imgExportar} alt="Exportar" />
                            <span>Exportar</span>
                        </button>

                        <button type="button" className={estilos.botao} onClick={() => setModalAberto(true)}>
                            <img src={imgMais} alt="Adicionar" />
                            <span>Novo Registro</span>
                        </button>
                    </section>
                </div>

                {/*Tabela de registros */}
                <section className={estilos.tabelaContainer}>
                    <div className={estilos.tabelaWrapper}>
                        <table className={estilos.tabela}>
                            <thead>
                                <tr>
                                    <th>Sensor</th>
                                    <th>Ambiente</th>
                                    <th>Valor</th>
                                    <th>Timestamp</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.length > 0 ? (
                                    historico.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.sensor}</td>
                                            <td>{item.ambiente}</td>
                                            <td>{item.valor}</td>
                                            <td>{item.timestamp_formatado || item.timestamp}</td>
                                            <td className={estilos.acoes}>
                                                <img
                                                    src={imgEditar}
                                                    alt="Editar"
                                                    onClick={() => {
                                                        setRegistroSelecionado(item);
                                                        setHistoricoEditando(item);
                                                        setModalAberto(true);
                                                    }}
                                                />
                                                <img
                                                    src={imgExcluir}
                                                    alt="Excluir"
                                                    onClick={() => {
                                                        setRegistroSelecionado(item);
                                                        setModalExcluirAberto(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Nenhum registro encontrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <Rodape />

            {/* Modal para criar/editar histórico */}
            <ModalCadastro
                tipo="historico"
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    setHistoricoEditando(null);
                }}
                onSubmit={handleSubmit}
                initialData={historicoEditando}
            />

            {/*Modal de exclusão */}
            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={() => setModalExcluirAberto(false)}
                onConfirm={() => handleExcluir(registroSelecionado?.id)}
                tipo="histórico"
                item={registroSelecionado}
            />
        </>
    );
}

export default Historico;
