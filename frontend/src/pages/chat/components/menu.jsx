export default function menu() {

    const toggleConversas = () => {
        const conversas = document.querySelector('#conversas');
        conversas.classList.toggle('mostrar');
    }

    return (
    <i class="fa-solid fa-bars menu" onClick={toggleConversas}></i>
)
}