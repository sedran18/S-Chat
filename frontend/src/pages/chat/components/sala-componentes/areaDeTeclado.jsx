import { useState } from 'react';

export default function AreaDoTeclado() {
    const [mostrarEmojis, setMostrarEmojis] = useState(false);
    const emjlist = ['👍', '👽', '😢', '😀', '😍', '😠', '🤑', '🤖', '❤️️', '🧐', '🖖', '🙏'];
    const [texto, setTexto] = useState("");

    const adicionarEmoji = (emoji) => {
        setTexto(texto + emoji); 
    };

    const toggleEmojis = () => {
        setMostrarEmojis(!mostrarEmojis);
    };

    return (
        <div className="areaDoTeclado">
           {mostrarEmojis && (
             <div className="emojisLista">
               {emjlist.map((emoji, index) => (
                 <span key={index} onClick={() => adicionarEmoji(emoji)}>
                   {emoji}
                 </span>
               ))}
             </div>
           )}

            <span className="emojis" id="emojis" onClick={toggleEmojis}>
              😀
            </span>

            <textarea 
                name="texto" 
                id="texto" 
                value={texto} 
                onChange={(e) => setTexto(e.target.value)}
            />

            <i className="fa-solid fa-paper-plane enviar"></i>
        </div>
    );
}