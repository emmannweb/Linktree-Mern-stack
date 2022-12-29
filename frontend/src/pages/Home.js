import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOutAuto, signin } from '../action/userAction'
import Footer from '../components/Footer'




const Home = (props) => {

  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  //sign in field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        props.history.push('/dashboard/clients');
        dispatch(logOutAuto());

      }, 1000);
    }
  }, [user]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  }

  return (
    <>

      <div className="container custom_class">
        <h2 className="signup_title  text-center"> LOGIN </h2>
        <form className=" col-sm-6 offset-3 pt-5 signup_form">

          <div className="form-outline mb-4">
            <input onChange={(e) => setEmail(e.target.value)} type="email" id="form4Example2" className="form-control" value={email} />
            <label className="form-label" htmlFor="form4Example2">Email </label>
          </div>

          <div className="form-outline mb-4">
            <input onChange={(e) => setPassword(e.target.value)} type="password" id="form4Example3" className="form-control" value={password} />
            <label className="form-label" htmlFor="form4Example3">Password</label>
          </div>

          <button onClick={handleSubmit} type="submit" className="btn btn-primary btn-block mb-4">LOGIN</button>
          <span><a href="/user/forgetpassword">Esqueceu a senha?</a></span>
        </form>
      </div>

      <Footer />

    </>
  )
}

export default Home