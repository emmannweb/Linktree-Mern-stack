import React from 'react'
import { useDispatch } from 'react-redux'
import { NavLink} from 'react-router-dom'
import {logOut} from '../action/userAction' 
import {useHistory} from 'react-router-dom'
import onexlogo  from '../images/onex.png'

const Header = () => {
    
    let history = useHistory();
    const dispatch = useDispatch();

    const logOutuser = () =>{
        dispatch(logOut());
        history.push('/');
    }
    

  return (
    <>
        <div className="row">
           
                <div className="col-sm-3">
                    <img className='img-fluid' src={onexlogo} alt="Onex logo" />
                </div>
                <div className="col-sm-7 menu_wrapper">
                    <span className="admin"><NavLink   to={'/dashboard/allusers'}  style={isActive => ({color: isActive ? "#18355e" : ""})} >Administradores</NavLink> </span>
                    <span className="client"><NavLink to={'/dashboard/clients'}  style={isActive => ({color: isActive ? "#18355e" : ""})}>Clientes</NavLink> </span>
                    <span className="plan"><NavLink to={'/dashboard/plan'}  style={isActive => ({color: isActive ? "#18355e" : ""})}>Planos</NavLink> </span> 
                    <span className="plan"><NavLink to={'/dashboard/userprofile'}  style={isActive => ({color: isActive ? "#18355e" : ""})}>Meus dados</NavLink> </span> 
                </div>
                <div className="col-sm-2 logout_wrapper">
                    <span onClick={()=>logOutuser()} className="log_out">Sair </span> 
                </div>
                
        </div>
    </>
  )
}

export default Header