import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const PrivateAdminRoute = ({ ...rest }) => {
    const { user } = useSelector(state => state.auth);

    if (user) {
        return user.role === 0 || user.role === 1 ? <Route {...rest} /> : <Redirect to="/" />
    }
    return <Redirect to="/" />;
}

export default PrivateAdminRoute