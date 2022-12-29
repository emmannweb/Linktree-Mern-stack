import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const AdminPlanEdit = ({match, history}) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');


    // Get plan data
    const getUserData = () =>{
        axios.get(`/api/v1/plan/${match.params.id}`)
        .then((res)=>{
            // console.log(res.data.plan);
            setName(res.data.plan.name);
            setPrice(res.data.plan.price);
        })
        .catch(error=>{
            console.log(error.response.data.error );
        })
    }
    useEffect(()=>{
        getUserData();
    },[]);

    //EDIT PLAN
    const editPlan = (e) =>{
        e.preventDefault();
        axios.put(`/api/v1/plan/edit/${match.params.id}`, {name, price})
        .then(res =>{
            console.log(res)
            if (res.data.success === true){
                console.log("plan was edited  successfully");
               history.push('/dashboard/plan');
                toast.success('O Plano foi editado com sucesso!')
            }
        })
        .catch(error =>{
            console.log(error);
            toast.error(error.response.data.error );
        })

    }

  return (
    <>
       
         {/* const navigate = useNavigate() */}
        <div className="container plano_wrapper">
            <Header/>
            <div className="col-sm-6 offset-3  pt-5">
                <h1 className="text-center">Editar Plano</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="plano" className="form-label">Plano</label>
                        <input onChange={(e)=>setName(e.target.value)} type="text" className="form-control"  value={name}  />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="preco" className="form-label">Preço</label>
                        <input onChange={(e)=>setPrice(e.target.value)}  type="text" className="form-control" value={price} />
                    </div>
                
                    <button onClick={editPlan} type="submit" className="btn btn-primary">Alterar Plano</button>
                </form>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default AdminPlanEdit