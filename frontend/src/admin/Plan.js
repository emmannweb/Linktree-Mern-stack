import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'
import {loadUser} from '../action/userAction'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Plan = () => {
    const dispatch = useDispatch();

    const [plans, setPlans] = useState([]);

    const showPlan =  () =>{
        axios.get('/api/v1/plan/all')
        .then(res=>{
            //console.log(res.data.plans);
            setPlans(res.data.plans);
        })
        .catch(error=>{
            console.log(error);
        })
    }


    useEffect(()=>{
        dispatch(loadUser());
        showPlan();
    },[]);

    // delete plan
    const deletePlan = (id, name) =>{
        if (window.confirm(`Você tem certeza de querer deletar o plano: ${name}`)){
            //console.log(id);
            axios.delete(`/api/v1/plan/delete/${id}`)
            .then(del =>{
               if (del.data.success === true){
                console.log("plan deleted");
                showPlan();
                toast.success(`o plano: ${name} foi deletado`);
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
                <span><Link to={'/dashboard/create/plan'}>Adicionar +</Link></span>
            </div>
            <table className="table table-bordered">
                
                <thead className="thead-dark table-striped table-dark ">
                    <tr>
                        <th scope="col">Plano</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        plans && plans.map((plan, id) =>(

                            <tr key={id}>
                                <th scope="row">{plan.name}</th>
                                <td>R${plan.price}</td>
                                <td><span className='btn_plan'><Link to={`/dashboard/plan/${plan._id}`}>Alterar</Link></span> <span onClick={()=>deletePlan(plan._id, plan.name)} className='btn_plan'>Excluir</span> </td>
                                {/* <td>{product.category? product.category.name : "" }</td>
                                <td><Link to={`/admin/product/edit/${product._id}`}> <i class="fas fa-edit btn-primary"></i></Link></td>
                                <td style={{cursor: "pointer"}} onClick={()=>deleteProduct(product._id, product.name)}><i class="far fa-trash-alt btn-danger"></i></td> */}
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
        <Footer/>
    </>
  )
}

export default Plan