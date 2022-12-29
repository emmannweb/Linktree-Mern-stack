import React, { useState } from 'react'
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const AdminCreatePlan = ({ history }) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    // submit plan
    const submitPlan = (e) => {
        e.preventDefault();
        axios.post('/api/v1/plan/create', { name, price })
            .then(res => {
                console.log("plan created successfully");
                history.push('/dashboard/plan');
                toast.success('O plano foi criado com successo!')
            })
            .catch(error => {
                console.log(error.response.data.error);
                toast.error(error.response.data.error);
            })

    }

    return (
        <>

            <div className="container plano_wrapper">
                <Header />
                <div className="col-sm-6 offset-3 pt-5">
                    <h1 className="text-center">Criar Plano</h1>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Plano</label>
                            <input onChange={(e) => setName(e.target.value)} type="text" className="form-control" value={name} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Preço</label>
                            <input onChange={(e) => setPrice(e.target.value)} type="text" className="form-control" value={price} />
                        </div>

                        <button onClick={submitPlan} type="submit" className="btn btn-primary">Criar Plano</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AdminCreatePlan