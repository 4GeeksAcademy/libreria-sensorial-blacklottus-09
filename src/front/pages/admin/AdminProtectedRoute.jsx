import React from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminProtectedRoute = () => {
    const {store, dispatch} =useGlobalReducer()
    const { token, user, authIsReady } = store;

    if (!authIsReady) {
        return <div>Verificando...</div>; 
    }

    
    if (!token || !user?.is_admin) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    return <Outlet />;
};