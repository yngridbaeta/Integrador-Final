import { Routes, Route } from 'react-router-dom';
import Home from '../Paginas/Home';
import Login from '../Paginas/Login';
import Sensores from '../Paginas/Sensores';
import Ambientes from '../Paginas/Ambientes';
import Historicos from '../Paginas/Historicos';

export const Rotas = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sensores" element={<Sensores />} />
            <Route path="/ambientes" element={<Ambientes />} />
            <Route path="/historicos" element={<Historicos />} />
        </Routes>
    );
};
