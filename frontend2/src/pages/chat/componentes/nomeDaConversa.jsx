import { useEffect, useState, useContext} from 'react';
import './nomeDaConversa.css';
import { SocketContext } from '../../../socketContext';

export default function NomeDaConversa({nome}) {
    const [total, setTotal] = useState(0);
    const socket = useContext(SocketContext);



    useEffect(() => {
        if (nome === 'Pública') {
            socket.on('usuariosOnline', (data) => {
                setTotal(data);
            })
            socket.emit('usuariosOnline');
        }
        return ()=> {
            socket.off('usuariosOnline')
        }
    }, [nome])
    return (
        <div className="nomeDaConversa">
            {nome === 'Pública' && (<span className='usuarios-ativo'>
                <i className="fa-solid fa-globe"></i>
                {total}
                </span>)}
            <span className='nome-nomeDaConversa'>{nome}</span>
        </div>
    )
}