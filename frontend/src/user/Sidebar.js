import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({userId}) => {
  return (
    <>
        <ul className="list-group">
            <li className="list-group-item active" aria-current="true">Dashboard do usuário</li>
            <li className="list-group-item"><Link to={'/dashboard/userprofile'}>Ver Perfil</Link></li>
            <li className="list-group-item"><Link to={`/dashboard/editprofile/${userId}`}>Editar Perfil</Link></li>
        </ul>
    </>
  )
}

export default Sidebar