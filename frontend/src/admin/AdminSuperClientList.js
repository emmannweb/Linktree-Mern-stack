import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import 'antd/dist/antd.css';
import { Pagination } from 'antd';

const AdminSuperClientList = () => {
    // /clients/all

    const [clients, setClients] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    // console.log("count", count)
    console.log("log user details", JSON.stringify(localStorage.getItem('userdetails')))
    useEffect(() => {
        axios.get(`/api/v1/clients/all?pageNumber=${pageNumber}`)
            .then(res => {
                //console.log(res.data);
                setClients(res.data.clients);
                setCount(res.data.count);
                setPage(res.data.page);
            })
            .catch(error => {
                console.log(error);
            })
    }, [count, pageNumber, page]);

    return (
        <>

            <div className="container plano_wrapper">
                <Header />
                <div className="add_plan">
                    <span><Link to={'/dashboard/client/create'}>Adicionar +</Link></span>
                </div>
                <table className="table table-bordered">

                    <thead className="thead-dark table-striped table-dark ">
                        <tr>

                            <th scope="col">Nome do cliente</th>
                            <th scope="col">Link público</th>
                            <th scope="col">Bloqueado?</th>
                            <th scope="col">Plano</th>
                            <th scope="col">Ações </th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            clients && clients.map((client, id) => (

                                <tr key={id}>
                                    <th scope="row">{client.completeName}</th>
                                    <td><a target="_blank" href={client.slug ? "/" + "linktree/" + client.slug : ""}>{client.slug ? client.slug : "Ainda, não tem link"}</a></td>
                                    <td>{client.status ? "Sim" : "Não"}</td>
                                    <td>{client.plan ? client.plan.name : ''}</td>
                                    <td><span className='btn_plan'><Link to={''}>Alterar</Link></span> <span className='btn_plan'>Excluir</span> </td>
                                </tr>
                            ))
                        }


                    </tbody>
                </table>

                <Pagination current={pageNumber} total={count} onChange={(value) => setPageNumber(value)} pageSize={6} />
            </div>


            <Footer />
        </>
    )
}

export default AdminSuperClientList