import axios from "axios";
import { useEffect, useState } from "react";

// Componentes 
import Menu from "../Componentes/Menu";
import ModalCadastro from "../Componentes/ModalCadastro";
import ModalExcluir from "../Componentes/ModalExcluir";
import Rodape from "../Componentes/Rodape";

//imagens de acoes
import imgExportar from "../assets/exportar.png";
import imgExcluir from "../assets/excluir.png";
import imgEditar from "../assets/editar.png";
import imgMais from "../assets/mais.png";

// Estilo
import estilos from "./Dados.module.css";

function Sensores() {
    //Estados principais
    const [sensores, setSensores] = useState([]);
    const [sensorBusca, setSensorBusca] = useState("");
    const [idBusca, setIdBusca] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [sensoresEditando, setSensoresEditando] = useState(null);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [sensorSelecionado, setSensorSelecionado] = useState(null);

    const token = localStorage.getItem("access");

    // Função para carregar sensores com base nos filtros
    const carregarSensores = () => {
        if (!token) {
            console.warn("Token não encontrado");
            return;
        }

        const params = new URLSearchParams();
        if (sensorBusca) params.append("sensor__icontains", sensorBusca);
        if (idBusca) params.append("id", idBusca);

        axios.get(`http://localhost:8000/api/sensores/?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setSensores(response.data))
        .catch((error) => {
            console.error("Erro ao buscar sensores", error);
        });
    };

    // tempo para a busca
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            carregarSensores();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [sensorBusca, idBusca]);

    //Exportação para Excel
    const baixarExcel = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/sensores/export/", {
                responseType: "blob",
                headers: { Authorization: `Bearer ${token}` },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sensores.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro ao exportar:", error);
            alert("Falha ao exportar dados.");
        }
    };

    // Criação ou edição de sensor
    const handleSubmit = (dados) => {
        const url = sensoresEditando
            ? `http://localhost:8000/api/sensores/${sensoresEditando.id}/`
            : "http://localhost:8000/api/sensores/";

        const method = sensoresEditando ? axios.patch : axios.post;

        method(url, dados, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            alert(sensoresEditando ? "Sensor atualizado!" : "Sensor cadastrado!");
            setModalAberto(false);
            setSensoresEditando(null);
            carregarSensores();
        })
        .catch((err) => {
            console.error("Erro ao salvar sensor:", err);
            alert("Erro ao salvar sensor.");
        });
    };

    // Excluir sensor
    const handleExcluir = (id) => {
        axios.delete(`http://localhost:8000/api/sensores/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            alert("Sensor excluído com sucesso.");
            setModalExcluirAberto(false);
            carregarSensores();
        })
        .catch((error) => {
            console.error("Erro ao excluir sensor", error);
            alert("Erro ao excluir sensor.");
        });
    };

    return (
        <>
            <Menu />

            <main className={estilos.main}>
                <header className={estilos.header}>
                    <h1>Sensores</h1>
                </header>

                <div className={estilos.maior}>
                    {/* 🔍 Filtros por ID ou tipo */}
                    <section className={estilos.filtros}>
                        <label htmlFor="id">ID:</label>
                        <input
                            type="number"
                            id="id"
                            name="id"
                            placeholder="Digite o ID"
                            value={idBusca}
                            disabled={sensorBusca.trim() !== ""}
                            onChange={(e) => setIdBusca(e.target.value)}
                        />

                        <label htmlFor="sensor">Tipo do sensor:</label>
                        <select
                            id="sensor"
                            name="sensor"
                            value={sensorBusca}
                            disabled={idBusca.trim() !== ""}
                            onChange={(e) => setSensorBusca(e.target.value)}
                            className={estilos.sensor}
                        >
                            <option value="">Selecione</option>
                            <option value="contador">Contador</option>
                            <option value="luminosidade">Luminosidade</option>
                            <option value="temperatura">Temperatura</option>
                            <option value="umidade">Umidade</option>
                        </select>
                    </section>

                    {/* Ações principais */}
                    <section className={estilos.botoesAcao}>
                        <button type="button" className={estilos.botao} onClick={baixarExcel}>
                            <img src={imgExportar} alt="Ícone de exportar" />
                            <span>Exportar Dados</span>
                        </button>

                        <button type="button" className={estilos.botao} onClick={() => setModalAberto(true)}>
                            <img src={imgMais} alt="Ícone de adicionar" />
                            <span>Novo Sensor</span>
                        </button>
                    </section>
                </div>

                {/* Tabela de sensores */}
                <section className={estilos.tabelaContainer}>
                    <div className={estilos.tabelaWrapper}>
                        <table className={estilos.tabela}>
                            <thead>
                                <tr>
                                    <th>Sensor</th>
                                    <th>Mac Address</th>
                                    <th>Unidade de medida</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sensores.length > 0 ? (
                                    sensores.map((sensor) => (
                                        <tr key={sensor.id}>
                                            <td>{sensor.sensor}</td>
                                            <td>{sensor.mac_address}</td>
                                            <td>{sensor.unidade_medida}</td>
                                            <td>{sensor.latitude}</td>
                                            <td>{sensor.longitude}</td>
                                            <td>{sensor.status ? "Ativo" : "Inativo"}</td>
                                            <td className={estilos.acoes}>
                                                <img
                                                    src={imgEditar}
                                                    alt="Ícone de Editar"
                                                    onClick={() => {
                                                        setSensorSelecionado(sensor);
                                                        setSensoresEditando(sensor);
                                                        setModalAberto(true);
                                                    }}
                                                />
                                                <img
                                                    src={imgExcluir}
                                                    alt="Ícone de excluir"
                                                    onClick={() => {
                                                        setSensorSelecionado(sensor);
                                                        setModalExcluirAberto(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">Nenhum sensor encontrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <Rodape />

            {/* Modal de cadastro/edição */}
            <ModalCadastro
                tipo="sensor"
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    setSensoresEditando(null);
                }}
                onSubmit={handleSubmit}
                initialData={sensoresEditando}
            />

            {/*Modal de exclusão */}
            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={() => setModalExcluirAberto(false)}
                onConfirm={() => handleExcluir(sensorSelecionado?.id)}
                tipo="sensor"
                item={sensorSelecionado}
            />
        </>
    );
}

export default Sensores;
