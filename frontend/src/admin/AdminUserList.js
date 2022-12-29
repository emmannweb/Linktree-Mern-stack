import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import 'antd/dist/antd.css';
import { Pagination } from 'antd';
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const AdminUserList = () => {
    const {isAuthenticated, user} = useSelector(state => state.auth);

    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const fetUsers =  () =>{
        // try {
        //     const {data} = await axios.get('/api/v1/users/all')
        //     setUsers(data);
        //     console.log(users);
        // } catch (error) {
        //     console.log(error)
        // }
        axios.get(`/api/v1/users/all?pageNumber=${pageNumber}`)
        .then(res=>{
            //console.log(res.data.users);
            setUsers(res.data.users);
            setCount(res.data.count)
            setPage(res.data.page)
        })
        .catch(error=>{
            console.log(error.response.data.error );
        })
    }

    useEffect(()=>{
        fetUsers();
    }, [count, pageNumber, page]);

    //remove user
    const removeUser = (id, name) =>{
        console.log(id);
        if (window.confirm(`Você tem certeza de querer deletar o usuário: ${name}`)){
            //console.log(id);
            axios.delete(`/api/v1/user/delete/${id}`)
            .then(del =>{
               if (del.data.success === true){
                console.log("usuário deleted");
                fetUsers();
                toast.success(`o usuário: ${name} foi deletado`);
               }
            })
            .catch(error =>{
                console.log(error.response.data.error );
                toast.error(error.response.data.error );
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
                        {
                             isAuthenticated && user.role === 1 ? <> <th scope="col">Ações</th></> : ''
                        }
                       
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.map((u, id) =>(

                            <tr key={id}>
                                <th scope="row">{u.name}</th>
                                <td>{u.email}</td> 
                                <td><img className='img-fluid avatar_list' src={u.avatar ? u.avatar.url: '' } alt={u.name} /></td>
 
                                {
                                    isAuthenticated && user.role === 1 ?
                                    <>
                                        <td>
                                            <span className='btn_plan'><Link to={`/dashboard/user/edit/${u._id}`}>Alterar</Link></span> 
                                            <span onClick={() => removeUser(u._id, u.name)} className='btn_plan'>Excluir</span>
                                        </td>
                                    </>
                                    : ""
                                } 
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

export default AdminUserList
