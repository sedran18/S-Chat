import Conversas from './components/conversas';
import Sala from './components/sala';
import './style/chat.css';
import Menu from './components/menu'

export default function Chat() {

    return (
        <div className='chat'>
            <Menu />
            <Conversas />
            <Sala />
        </div>
    )
}