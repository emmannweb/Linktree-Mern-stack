import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { loadUser } from '../action/userAction'
import defaultProfilePicture from '../images/profile.png'
import Sidebar from './Sidebar'

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  //console.log(user)
  return (
    <>
      <div className='container plano_wrapper'>
        <Header />

        <div className="row pt-5">
          <div className="col-sm-4">
            <Sidebar userId={user._id} />
          </div>

          <div className="col-sm-8">
            <div className="perfil_wrapper text-center">
              <h1 className="text-center">Perfil</h1>
              <img src={user && user.avatar != null ? user.avatar.url : defaultProfilePicture} className='img-fluid profile_picture' alt="default profile picture" />
              <div className="wrapper_user_details">
                <h4>Nome completo: {user.name}</h4>
                <h4>E-mail: {user.email}</h4>
                <h4>Data de criação: {new Date(user.createdAt).toLocaleDateString()}</h4>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}

export default UserProfile