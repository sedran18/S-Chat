export default function Menu() {

  const toggleConversas = () => {
    const conversas = document.querySelector('#conversas');
    const sala = document.querySelector('#sala');

    conversas.classList.toggle('open'); // abre/fecha o painel lateral no mobile
    sala.classList.toggle('tamanhoCem'); // opcional, se quiser ajustar largura total
  };

  return (
    <i className="fa-solid fa-bars menu" onClick={toggleConversas}></i>
  );
}
