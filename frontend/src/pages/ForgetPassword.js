import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Footer from '../components/Footer'

const ForgetPassword = () => {

    const [email, setEmail] = useState('');

    const submitLink = (e) => {
        e.preventDefault();
        if (email === '') {
            toast.error("Esse campo não pode ser vazio!");
            return false;
        }
        axios.post('/api/v1/forgetpassword', { email })
            .then(res => {
                if (res.data.success === true) {
                    toast.success(`Um e-mail foi enviado nesse endereço: ${email}`)
                }
            })
            .catch(error => {
                console.log(error);
                // toast.error( "Não há usúario com esse e-mail");
                toast.error(error.response.data.error);
            })

    }



    return (
        <>
            <div className="container custom_class">
                <h2 className="signup_title  text-center"> Digite seu e-mail e enviar </h2>
                <form className=" col-sm-6 offset-3 pt-5 signup_form">

                    <div className="form-outline mb-4">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name='email' id="form4Example3" className="form-control" required />
                        <label className="form-label" htmlFor="form4Example3">E-mail</label>
                    </div>

                    <button onClick={submitLink} type="submit" className="btn btn-primary btn-block mb-4">Enviar</button>

                </form>
            </div>
            <Footer />
        </>
    )
}

export default ForgetPassword