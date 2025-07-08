import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const ManageUsers = () => {
    const { store } = useGlobalReducer();
    const { token } = store;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${url}/api/get-all-users`, {
                headers: { 'Authorization': `Bearer ${token.token}` }
            });
            const data = await response.json();
            if(response.ok) setUsers(data);
            setLoading(false);
        };
        fetchUsers();
    }, [token, url]);
    
    const handleToggleActive = async (userId, isActive) => {
        const endpoint = isActive ? 'user-disable' : 'user-enable';
        await fetch(`${url}/api/${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token.token}` },
            body: JSON.stringify({ user_id: userId })
        });
        setUsers(users.map(u => u.id === userId ? { ...u, is_active: !isActive } : u));
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div>
            <h1 className="font-title mb-4">Gestionar Usuarios</h1>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th><th>Nombre</th><th>Email</th><th>Estado</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                        {user.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className={`btn btn-sm ${user.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                        onClick={() => handleToggleActive(user.id, user.is_active)}
                                    >
                                        {user.is_active ? 'Deshabilitar' : 'Habilitar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};