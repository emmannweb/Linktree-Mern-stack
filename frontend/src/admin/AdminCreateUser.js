import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Footer from '../components/Footer'
import Header from '../components/Header'


const AdminCreateUser = ({history}) => {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    })

    const {name, email, password} = user;

    const [avatar, setAvatar] = useState();

    // handleChange method
    const handleChange = (e) =>{
        //console.log("cliked");
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onloadend = () =>{
                setAvatar(reader.result);
            }

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }


    //handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/api/v1/signup', {name, email, password, avatar})
        .then(u =>{
            console.log(u.data.user);
            if (u.data.success === true){
                toast.success("Usuário foi criado com sucesso");
                history.push('/dashboard/allusers')
            }
        })
        .catch(error =>{
            console.log(error);
            toast.error(error.response.data.error );
        })

    }
 
  return (
    <>
        <div className="container plano_wrapper">
            <Header/>
            <div className="col-sm-6 offset-3  pt-5">
                <h1 className="text-center">Criar Admin</h1>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className="mb-3">
                        <label htmlFor="plano" className="form-label">Nome</label>
                        <input onChange={handleChange}  type="text" name="name" className="form-control" value={name}  required/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="preco" className="form-label">E-mail</label>
                        <input onChange={handleChange}  type="email"  name="email"  className="form-control" value={email}  required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="preco" className="form-label">Senha</label>
                        <input onChange={handleChange}  type="password" name="password"  className="form-control"  value={password}  required />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="preco" className="form-label">Avatar</label>
                        <input onChange={handleChange}  type="file" name="avatar" className="form-control"  />
                    </div>
                
                    <button  type="submit" className="btn btn-primary">Criar usuário</button>
                </form>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default AdminCreateUser