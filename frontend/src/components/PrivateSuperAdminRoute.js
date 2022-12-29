import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const PrivateSuperAdminRoute = ({ ...rest }) => {
    const { user } = useSelector(state => state.auth);

    if (user) {

        if (user.role === 0) {
            toast.error("Você não é o super Admin, para acessar esse recurso");
            return <Redirect to="/dashboard/clients" />
        }

        if (user.role === 1) {
            return user.role === 1 ? <Route {...rest} /> : <Redirect to="/" />
        }
    }
    return <Redirect to="/" />;
}

export default PrivateSuperAdminRoute