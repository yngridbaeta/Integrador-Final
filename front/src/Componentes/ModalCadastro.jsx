import estilos from "./ModalCadastro.module.css";
import { useState, useEffect, useRef } from "react";

// componente Modal reutilizável para cadastro/edição de sensor, ambiente ou histórico
function ModalCadastro({ tipo, isOpen, onClose, onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({});
  const [erroMac, setErroMac] = useState("");
  const [macTouched, setMacTouched] = useState(false);

  const modalRef = useRef(null);

  const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

  const unidadesPorSensor = {
    contador: ["uni"],
    luminosidade: ["lux"],
    temperatura: ["°C"],
    umidade: ["%"],
  };

  function formatTimestampForInput(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Preenche os dados iniciais quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialData,
        timestamp: formatTimestampForInput(initialData?.timestamp),
      });
      setErroMac("");
      setMacTouched(false);
    }
  }, [initialData, isOpen]);

  // Foca o modal ao abrir para acessibilidade
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const unidadesDisponiveis = formData.sensor
    ? unidadesPorSensor[formData.sensor] || []
    : [];

  //limpa unidade se sensor mudar
  useEffect(() => {
    if (
      formData.unidade_medida &&
      !unidadesDisponiveis.includes(formData.unidade_medida)
    ) {
      setFormData((prev) => ({ ...prev, unidade_medida: "" }));
    }
  }, [formData.sensor]);

  //não renderiza o modal se estiver fechado
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (name === "mac_address" && macRegex.test(val)) {
      setErroMac("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica do MAC
    if (formData.mac_address && !macRegex.test(formData.mac_address)) {
      setErroMac("Formato inválido. Exemplo: 00:1B:44:11:3A:B9");
      setMacTouched(true);
      return;
    }

    // definindo campos obrigatórios 
    const camposObrigatorios = {
      sensor: ["sensor", "mac_address", "unidade_medida", "latitude", "longitude", "status"],
      ambiente: ["sig", "descricao", "ni", "responsavel"],
      historico: ["sensor", "ambiente", "valor", "timestamp"],
    };

    const campos = camposObrigatorios[tipo] || [];

    for (let campo of campos) {
      if (!formData[campo]) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }
    }

    let dataToSend = { ...formData };

    // Converte timestamp local
    if (formData.timestamp) {
      const localDate = new Date(formData.timestamp);
      dataToSend.timestamp = localDate.toISOString();
    }

    onSubmit(dataToSend);
  };

  //campos dinâmicos que dependem do tipo dele
  const renderCampos = () => {
    switch (tipo) {
      case "sensor":
        return (
          <>
            <div className={estilos.campo}>
              <label htmlFor="sensor">Tipo de Sensor:</label>
              <select
                id="sensor"
                name="sensor"
                value={formData.sensor || ""}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="contador">Contador</option>
                <option value="luminosidade">Luminosidade</option>
                <option value="temperatura">Temperatura</option>
                <option value="umidade">Umidade</option>
              </select>
            </div>

            <div className={estilos.campo}>
              <label htmlFor="mac_address">MAC:</label>
              <input
                id="mac_address"
                name="mac_address"
                value={formData.mac_address || ""}
                onChange={handleChange}
                onBlur={() => setMacTouched(true)}
                placeholder="00:1B:44:11:3A:B9"
                className={erroMac && macTouched ? estilos.inputErro : ""}
              />
              <small className={estilos.dica}>
                Formato: 00:1B:44:11:3A:B9
              </small>
              {erroMac && macTouched && (
                <div className={estilos.erro}>{erroMac}</div>
              )}
            </div>

            <div className={estilos.campo}>
              <label htmlFor="unidade_medida">Unidade:</label>
              <select
                id="unidade_medida"
                name="unidade_medida"
                value={formData.unidade_medida || ""}
                onChange={handleChange}
                disabled={!formData.sensor}
              >
                <option value="">Selecione</option>
                {unidadesDisponiveis.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div className={estilos.campo}>
              <label htmlFor="latitude">Latitude:</label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                value={formData.latitude || ""}
                onChange={handleChange}
                step="any"
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="longitude">Longitude:</label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                value={formData.longitude || ""}
                onChange={handleChange}
                step="any"
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={
                  formData.status === true
                    ? "true"
                    : formData.status === false
                      ? "false"
                      : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value === "true",
                  }))
                }
              >
                <option value="" disabled>
                  Selecione o status
                </option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </>
        );

      case "ambiente":
        return (
          <>
            <div className={estilos.campo}>
              <label htmlFor="sig">SIG:</label>
              <input
                id="sig"
                name="sig"
                type="number"
                value={formData.sig || ""}
                onChange={handleChange}
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="descricao">Descrição:</label>
              <input
                id="descricao"
                name="descricao"
                value={formData.descricao || ""}
                onChange={handleChange}
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="ni">NI:</label>
              <input
                id="ni"
                name="ni"
                value={formData.ni || ""}
                onChange={handleChange}
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="responsavel">Responsável:</label>
              <input
                id="responsavel"
                name="responsavel"
                value={formData.responsavel || ""}
                onChange={handleChange}
              />
            </div>
          </>
        );

      case "historico":
        return (
          <>
            <div className={estilos.campo}>
              <label htmlFor="sensor">ID do Sensor:</label>
              <input
                id="sensor"
                name="sensor"
                type="number"
                value={formData.sensor || ""}
                onChange={handleChange}
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="ambiente">ID do Ambiente:</label>
              <input
                id="ambiente"
                name="ambiente"
                type="number"
                value={formData.ambiente || ""}
                onChange={handleChange}
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="valor">Valor:</label>
              <input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor || ""}
                onChange={handleChange}
              />
            </div>

            <div className={estilos.campo}>
              <label htmlFor="timestamp">Timestamp:</label>
              <input
                id="timestamp"
                name="timestamp"
                type="datetime-local"
                value={formData.timestamp || ""}
                onChange={handleChange}
              />
            </div>
          </>
        );

      default:
        return <p>Tipo inválido</p>;
    }
  };

  return (
    <div
      className={estilos.modalOverlay}
      ref={modalRef}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className={estilos.modalContent}>
        <button onClick={onClose} className={estilos.fechar} aria-label="Fechar modal">
          ×
        </button>

        <h2>
          {initialData?.id ? "Editar" : "Cadastrar"} {tipo}
        </h2>

        <form onSubmit={handleSubmit}>
          {renderCampos()}
          <button type="submit" className={estilos.salvar}>
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalCadastro;