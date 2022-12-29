import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import Footer from '../components/Footer'
import Header from '../components/Header'

const AdminEditUser = ({ history, match }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [password, setPassword] = useState("");


    // Get plan data
    const getSingleUser = () => {
        axios.get(`/api/v1/user/view/${match.params.id}`)
            .then((res) => {
                //console.log(res.data.user);
                setName(res.data.user.name);
                setEmail(res.data.user.email);
                setPassword(res.data.user.password);
                setAvatarPreview(res.data.user.avatar.url);

            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getSingleUser();
    }, []);


    // handleChange avatar method
    const handleChangeAvatar = (e) => {
        // console.log("cliked");
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onloadend = () => {
                setAvatar(reader.result);
            }
        }
    }

    //handle submit
    const handleSubmit = (e) => {
        //setLoading(true);
        e.preventDefault();

        axios.put(`/api/v1/user/edit/${match.params.id}`,
            { name, email, password, avatar })
            .then(u => {
                //console.log(u.data.client);
                if (u.data.success === true) {
                    toast.success("Usúario atualizado com sucesso!");
                    //setLoading(false);
                    history.push('/dashboard/allusers');
                }
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
                <div className="col-sm-6 offset-3  pt-5">
                    <h1 className="text-center">Editar Admin</h1>
                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                        <div className="mb-3">
                            <label htmlFor="plano" className="form-label">Nome</label>
                            <input onChange={(e) => setName(e.target.value)} type="text" name="name" className="form-control" value={name} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="preco" className="form-label">E-mail</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" className="form-control" value={email} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="preco" className="form-label">Senha</label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" className="form-control" value={password} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="preco" className="form-label">Avatar</label>
                            <input onChange={handleChangeAvatar} type="file" name="avatar" className="form-control" />
                        </div>
                        {
                            avatarPreview ?
                                <>
                                    <div className="mb-3 ">
                                        <img className="avatar_preview" src={avatarPreview} alt={name} />
                                    </div>
                                </>
                                : ''
                        }


                        <button type="submit" className="btn btn-primary">Editar Admin</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AdminEditUser