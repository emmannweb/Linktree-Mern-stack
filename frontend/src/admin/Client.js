import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import 'antd/dist/antd.css';
import { Pagination } from 'antd';
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Client = () => {

    const { isAuthenticated, user } = useSelector(state => state.auth);

    const [clients, setClients] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    // console.log("count", count)

    const showClients = () => {
        axios.get(`/api/v1/clients/all?pageNumber=${pageNumber}`)
            .then(res => {
                //console.log(res.data.clients);
                setClients(res.data.clients);
                setCount(res.data.count);
                setPage(res.data.page);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        showClients();
    }, [count, pageNumber, page]);


    //remove client
    const removeClient = (name, slug) => {
        //console.log(id, name, slug)
        if (window.confirm(`Você tem certeza de querer deletar o cliente: ${name}`)) {
            //console.log(id);
            axios.delete(`/api/v1/client/delete/${slug}`)
                .then(del => {
                    if (del.data.success === true) {
                        console.log("client deleted");
                        showClients();
                        toast.success(`o cliente: ${name} foi deletado`);
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error);
                    toast.error(error.response.data.error);
                });
        }
    }

    return (
        <>

            <div className="container plano_wrapper">
                <Header />
                <div className="add_plan">
                    <span><Link to={'/dashboard/client/create'}>Adicionar cliente +</Link></span>
                </div>
                <table className="table table-bordered">

                    <thead className="thead-dark table-striped table-dark ">
                        <tr>

                            <th scope="col">Nome do cliente</th>
                            <th scope="col">Link público</th>
                            <th scope="col">Bloqueado?</th>
                            <th scope="col">Plano</th>
                            {
                                isAuthenticated && user.role === 1 ?
                                    <><th scope="col">Criado por</th></>
                                    : ''
                            }

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
                                    {
                                        isAuthenticated && user.role === 1 ?
                                            <><td>{client.user ? client.user.name : ''}</td></>
                                            : ''
                                    }
                                    <td>
                                        <span className='btn_plan'><Link to={`/dashboard/client/edit/${client.slug}`}>Alterar</Link></span>
                                        {
                                            isAuthenticated && user.role === 1 ?
                                                <><span onClick={() => removeClient(client.completeName, client.slug)} className='btn_plan'>Excluir</span> </>
                                                : ""
                                        }

                                    </td>
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

export default Client