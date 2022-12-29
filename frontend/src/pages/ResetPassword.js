import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Footer from '../components/Footer'

const ResetPassword = (props) => {

    //console.log("props", props)

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitLink = (e) => {
        e.preventDefault();
        if (password === '' || confirmPassword === '') {
            toast.error("Preencher os dois campos!");
            return false;
        } else if (password !== confirmPassword) {
            toast.error("As senhas são diferentes!");
            return false;
        }

        axios.put(`/api/v1/resetpassword/${props.match.params.token}`, { password })
            .then(res => {
                if (res.data.success === true) {
                    toast.success("Senha atualizada")
                }
            })
            .catch(err => {
                console.log("error", err.response.data.error);
                toast.error(err.response.data.error);
            })

    }



    return (
        <>
            <div className="container custom_class">
                <h2 className="signup_title  text-center">Resetar senha</h2>
                <form className=" col-sm-6 offset-3 pt-5 signup_form">

                    <div className="form-outline mb-4">
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name='password' id="form4Example3" className="form-control" required />
                        <label className="form-label" htmlFor="form4Example3">Senha</label>
                    </div>
                    <div className="form-outline mb-4">
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" name='confimpassword' id="form4Example4" className="form-control" required />
                        <label className="form-label" htmlFor="form4Example4">Confirmar Senha</label>
                    </div>

                    <button onClick={submitLink} type="submit" className="btn btn-primary btn-block mb-4">Resetar</button>

                </form>
            </div>
            <Footer />
        </>
    )
}

export default ResetPassword