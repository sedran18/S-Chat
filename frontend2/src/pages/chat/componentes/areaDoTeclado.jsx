import { useState, useRef, useEffect, useContext } from 'react';
import './areaDoTeclado.css';
import { SocketContext } from '../../../socketContext';

export default function AreaDoTeclado({atual, handleMensagensComIa}) {
    const [txt, setTxt] = useState('');
    const [emojisActive, setEmojisActive] = useState(false); 
    const emojisLista = ['😀', '❤️', '🙏','🤡','👍','👽','🤣','😡','🤥','🧑‍💻','👩‍💻','🚀','🛸','💻','💀','😴','🤤'];
    const inputRef = useRef(null);
    const emojiListRef = useRef(null); 
    const toggleButtonRef = useRef(null); 
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                emojisActive && 
                emojiListRef.current && 
                !emojiListRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setEmojisActive(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [emojisActive]); 

    const focusInput = () => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0); 
    };

    const handleSendMessage = e => {
        const textoLimpo = txt.trim();
        if (!textoLimpo) {
            setTxt(''); 
            return;
        }

        if (atual === 'Pública') {
            socket.emit('sendMensagemParaSalas', {mensagem: textoLimpo, sala: 'publica'});
            setTxt(''); 
        } else if (atual === 'sedran') {
            handleMensagensComIa(txt);
            setTxt('');
        }

    }

    return (
        <div className="areaDoTeclado">
            {emojisActive && (
                <div className='emojis-lista' ref={emojiListRef}> 
                    {emojisLista.map((emj) => (
                        <span 
                            key={emj} 
                            tabIndex="-1" 
                            onClick={e=> {
                                e.preventDefault(); 
                                setTxt(prev => prev + emj);
                                focusInput(); 
                            }}
                        >{emj}</span>
                    ))}
                </div>
            )}

            <span 
                className='emojis' 
                tabIndex="-1" 
                ref={toggleButtonRef} 
                onClick={e=> {
                    e.preventDefault(); 
                    setEmojisActive(prev => !prev); 
                    focusInput();
                }}
            >😀</span>
                
            <input 
                type="text" 
                name="teclado" 
                id="teclado" 
                className='teclado'
                value={txt}
                onChange={e=>setTxt(e.target.value)}
                ref={inputRef} 
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            />
            <img onClick={handleSendMessage} className='enviar' width="48" height="48" src="https://img.icons8.com/fluency/48/filled-sent.png" alt="filled-sent"/>
        </div>
    )
}