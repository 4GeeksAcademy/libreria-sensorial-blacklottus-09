import React, { useState } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

export const Perfil = () => {
    const { store, dispatch } = useGlobalReducer();
    const { user, token } = store;
    const url = import.meta.env.VITE_BACKEND_URL;

    if (!user) {
        return <p>Cargando perfil...</p>;
    }

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        shipping_address: user.shipping_address || ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const textResponse = await fetch(`${url}/api/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: formData.name, shipping_address: formData.shipping_address })
            });

            if (!textResponse.ok) throw new Error("Error al actualizar los datos.");
            const updatedUser = await textResponse.json();

            if (avatarFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', avatarFile);
                
                const avatarResponse = await fetch(`${url}/api/me/avatar`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: avatarFormData
                });

                if (!avatarResponse.ok) throw new Error("Error al subir el nuevo avatar.");
                const avatarData = await avatarResponse.json();
                updatedUser.avatar = avatarData.avatar_url;
            }

            dispatch({ type: 'UPDATE_USER', payload: updatedUser });
            setMessage({ type: 'success', text: '¡Perfil actualizado exitosamente!' });
            setAvatarFile(null);

        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="font-title mb-4">Mis Datos</h2>
            <form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                    <img 
                        src={avatarPreview || 'https://via.placeholder.com/150'} 
                        alt="Avatar" 
                        className="rounded-circle" 
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                    />
                    <div className="mt-3">
                        <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-secondary">Cambiar foto</label>
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>
                </div>
                
                <div className="mb-3">
                    <label className="form-label text-muted">Nombre</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted">Correo Electrónico</label>
                    <input type="email" className="form-control" value={formData.email} readOnly disabled />
                </div>
                <div className="mb-3">
                    <label className="form-label text-muted">Dirección de Envío</label>
                    <textarea name="shipping_address" className="form-control" rows="3" value={formData.shipping_address || ''} onChange={handleChange}></textarea>
                </div>

                {message && (
                    <div className={`alert small p-2 mt-3 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {message.text}
                    </div>
                )}
                
                <button type="submit" className="btn btn-custom-submit mt-3" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
};