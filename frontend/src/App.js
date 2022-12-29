import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Plan from './admin/Plan'
import Home from './pages/Home'
import AdminCreatePlan from './admin/AdminCreatePlan';
import AdminCreateClient from './admin/AdminCreateClient'
import PrivateAdminRoute from './components/PrivateAdminRoute';
import Client from './admin/Client';
import ClientPage from './pages/ClientPage';
import AdminUserList from './admin/AdminUserList';
import NotFound from './pages/NotFound';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import { useDispatch } from 'react-redux';
import { loadUser } from './action/userAction';
import React, {useEffect} from 'react'
import AdminPlanEdit from './admin/AdminPlanEdit';
import UserProfile from './user/UserProfile';
import UserProfileEdit from './user/UserProfileEdit';
import AdminCreateUser from './admin/AdminCreateUser';
import PrivateSuperAdminRoute from './components/PrivateSuperAdminRoute';
import AdminSuperUserList from './admin/AdminSuperUserList';
import AdminSuperClientList from './admin/AdminSuperClientList';
import AdminEditCLient from './admin/AdminEditCLient';
import AdminEditClientSocialNetwork from './admin/AdminEditClientSocialNetwork';
import AdminEditUser from './admin/AdminEditUser';
import ForgetPassword  from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';


const App = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    store.dispatch(loadUser());
  }, []);
  
  return (
    <>
          <ToastContainer/>
          <Router>
              <Switch> 
                
                <Route path='/' exact component={Home} />
                <PrivateAdminRoute path="/dashboard/client/edit/:slug" component={AdminEditCLient} />
                <Route path="/dashboard/link/edit/:clientSlugName/:clientNetworkId" component={AdminEditClientSocialNetwork} />
                {/* <PrivateSuperAdminRoute path='/dashboard/superadmin/users' exact component={AdminSuperUserList} />
                <PrivateSuperAdminRoute path='/dashboard/superadmin/clients' exact component={AdminSuperClientList} /> */}
                <Route path='/linktree/:slug' exact component={ClientPage} />
                <PrivateAdminRoute path='/dashboard/plan/:id' exact component={AdminPlanEdit} />
                <PrivateAdminRoute path='/dashboard/clients' exact component={Client} />
                <PrivateAdminRoute path="/dashboard/client/create" component={AdminCreateClient} />
                <PrivateAdminRoute path="/dashboard/plan" component={Plan} />
                <PrivateAdminRoute path="/dashboard/create/plan" component={AdminCreatePlan} />
                <PrivateAdminRoute path="/dashboard/allusers" component={AdminUserList } />
                <PrivateSuperAdminRoute path="/dashboard/user/create" component={AdminCreateUser } />
                <PrivateSuperAdminRoute path="/dashboard/user/edit/:id" component={AdminEditUser } />
                <PrivateAdminRoute path="/dashboard/userprofile" component={UserProfile } />
                <PrivateAdminRoute path="/dashboard/editprofile/:id" component={UserProfileEdit } />
                <Route path="/user/forgetpassword" component={ForgetPassword } />
                <Route path="/api/v1/resetpassword/:token" component={ResetPassword } />
                
                <Route path='*' exact component={NotFound} />
              </Switch>
          </Router>
    </>
   )
}

export default App