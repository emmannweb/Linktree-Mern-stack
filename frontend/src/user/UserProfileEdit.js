import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useDispatch } from 'react-redux'
import Sidebar from './Sidebar'
import axios from 'axios'
import { loadUser } from '../action/userAction'

const UserProfileEdit = ({userId, match, history}) => {
   // const {user} = useSelector(state => state.auth);
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [avatar, setAvatar] = useState('');
   const [avatarPreview, setAvatarPreview] = useState("");
   const [password, setPassword] = useState('');

   const dispatch = useDispatch();

    //console.log(match);
    useEffect(()=>{
       axios.get(`/api/v1/user/view/${match.params.id}`)
       .then(profile =>{
        // console.log("user logado", profile.data.user);
         setName(profile.data.user.name);
         setEmail(profile.data.user.email);
         setAvatarPreview(profile.data.user.avatar.url);
         setPassword(profile.data.user.password);
       })
       .catch(error =>{
           console.log(error);
       })
    }, []);


    //handle image field
    const handleImage = (e) =>{
        const file = e.target.files[0];
        setFileToBase(file);
    }

    const setFileToBase = (file) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setAvatar(reader.result);
        }
    }

  

    //Edit profile
        const editUserProfile =  (e) =>{
            console.log("clicked")
            e.preventDefault();
        
            axios.put(`/api/v1/user/edit/${match.params.id}`, {name, email, password, avatar})
            .then(response =>  {
                if (response){
                    console.log(response);
                    //toast.success(`User: ${name}, updated`);
                    history.push('/dashboard/userprofile');
                    dispatch(loadUser());
                }
            })
            .catch(function (error) {
                console.log(error);
                //toast.error(error.message);
            });
        }
  

  return (
    <>
        <div className='container plano_wrapper'>
            <Header/>
                
            <div className="row pt-5">
              <div className="col-sm-4">
                  <Sidebar />
              </div>

                <div className="col-sm-8">
                  <div className="perfil_wrapper edit_profile">
                     <h2>Editar Perfil</h2>
                     <form onSubmit={editUserProfile} >
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Nome completo </label>
                            <input onChange={(e)=>setName(e.target.value)} type="text" className="form-control" value={name}  />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email </label>
                            <input onChange={(e)=>setEmail(e.target.value)}  type="email" className="form-control" value={email} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Imagem de perfil </label>
                            <input onChange={handleImage}   type="file" className="form-control" name="image"  />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Senha</label>
                            <input onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" value={password} />
                        </div>

                            {
                                avatarPreview != null ?
                                 <>
                                    <div className="mb-3">
                                        <img src={avatarPreview } className='img-fluid' alt="imagem de perfil" />
                                    </div>
                                </>
                                : ''
                            }
                    
                        <button type="submit" className="btn btn-primary">Editar perfil</button>
                    </form>
                  </div>
                </div>
            </div>
           
        </div>
        <Footer/>
    </>
  )
}

export default UserProfileEdit