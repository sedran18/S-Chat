import { useEffect, useState } from "react"
import Conversa from "./conversa";
import './area1.css';

export default function Area1({nome, none, setConversaAtual, conversas, setConversas, atual}) {

    useEffect(() => {
        setConversas(prevConversas => {
            if (prevConversas.includes(atual)) {
                return prevConversas;
            }
            
            return [...prevConversas, atual];
        });
        
    }, [atual]);

    return (
        <div className={`area1 ${none && 'none'}`}>
            <div className="name">
                <i className="fa-solid fa-user"></i>
                <span>{nome}</span>
            </div>
            {conversas.map((conversa, i) => (
                <Conversa conversa={conversa} atual={atual} key={i} setConversaAtual={setConversaAtual}/>
            ))}
        </div>
    )
}