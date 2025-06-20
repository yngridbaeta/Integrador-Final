import estilos from "./ModalExcluir.module.css";
import { useEffect, useRef } from "react";

function ModalExcluir({ isOpen, onClose, onConfirm, tipo, item }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && dialogRef.current) dialogRef.current.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <section
      className={estilos.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      aria-describedby="modal-desc"
      tabIndex="-1"
      ref={dialogRef}
    >
      <article className={estilos.modalContent}>
        <header>
          <h2 id="modal-titulo">Excluir {tipo}</h2>
        </header>

        <p id="modal-desc">
          Tem certeza que deseja excluir este {tipo.toLowerCase()}?
        </p>

        {/* Container dos botões*/}
        <div className={estilos.botoes}>
          <button onClick={onClose} autoFocus className={estilos.cancelar}>
            Cancelar
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onConfirm(item?.id);
            }}
            className={estilos.excluir}
            aria-label={`Confirmar exclusão de ${tipo}`}
          >
            Excluir
          </button>
        </div>
      </article>
    </section>
  );
}

export default ModalExcluir;
