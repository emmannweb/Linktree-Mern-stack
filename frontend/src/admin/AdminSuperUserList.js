import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import 'antd/dist/antd.css';
import { Pagination } from 'antd';
import { toast } from 'react-toastify'

const AdminSuperUserList = () => {
    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const fetUsers =  () =>{
    
        axios.get(`/api/v1/users/all?pageNumber=${pageNumber}`)
        .then(res=>{
            //console.log(res.data.users);
            setUsers(res.data.users);
            setCount(res.data.count)
            setPage(res.data.page)
        })
        .catch(error=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        fetUsers();
    }, [count, pageNumber, page]);


    //delete user
    const deleteUser = (id, name) =>{
        if (window.confirm(`Você tem certeza de querer deletar o usúario: ${name}`)){
            //console.log(id);
            axios.delete(`/api/v1/user/delete/${id}`)
            .then(del =>{
                if (del.data.success === true){
                    console.log("usúario deletado");
                    toast.success(`usúario: ${name} foi deletado`);
                    fetUsers();
                }
            })
            .catch(error =>{
                console.log(error);
                toast.error(error);
            });
        }
    }

  return (
    <>
     
        <div className="container plano_wrapper">
            <Header/>
            <div className="add_plan">
                <span><Link to={'/dashboard/user/create'}>Adicionar admin +</Link></span>
            </div>
            <table className="table table-bordered">
                
                <thead className="thead-dark table-striped table-dark ">
                    <tr>
                        <th scope="col">Nome completo</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Avatar</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.map((user, id) =>(

                            <tr key={id}>
                                <th scope="row">{user.name}</th>
                                <td>{user.email}</td> 
                                <td><img className='img-fluid avatar_list' src={user.avatar ? user.avatar.url: '' } alt={user.name} /></td>
                                <td><span className='btn_plan'><Link to={''}>Alterar</Link></span> <span onClick={()=>deleteUser(user._id, user.name)} className='btn_plan'>Excluir</span> </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
            <Pagination current={pageNumber} total= { count } onChange={(value)=>setPageNumber(value)}  pageSize={6}/>
        </div>
   
        <Footer/>

    </>
  )
}

export default AdminSuperUserList
