import React, {useState} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify';


const AdminEditClientSocialNetwork = ({match, history}) => {
    const [linkUpdate, setLinkUpdate] = useState({});

    //handle onchange object
    const handleChangeLink = (e) =>{
        if (e.target.name === 'socialNetworkName'
         || e.target.name === 'socialLink'
         || e.target.name === 'icon'
         ||  e.target.name === 'visible'){
            setLinkUpdate({ ...linkUpdate,  [e.target.name]: e.target.value })
        } 
    }

     console.log(linkUpdate);
    // console.log(match);

    const submitSingleLinkChange = ( ) =>{
        //console.log(socialNetworkName, socialLink, icon, id);
        axios.put(`/api/v1/client/link/update/${match.params.clientNetworkId}`, 
        linkUpdate)
        .then(u =>{
            console.log(u.data.client);
            if (u.data.success === true){
                toast.success(`Dados  foram atualizados`);
                //setLoading(false);
                setTimeout(()=>{
                    history.push(`/dashboard/client/edit/${match.params.clientSlugName}`);
                }, 1000)
            }
        })
        .catch(error =>{
            console.log(error);
            toast.error(error.response.data.error );
        })
    }

    //go back
    const goBackPrevious = () =>{
        setTimeout(()=>{
            history.push(`/dashboard/client/edit/${match.params.clientSlugName}`);
        }, 500)
    }
  return (
    <>

           <div className='container plano_wrapper '>
               <Header/>
                <div className="row multi-item pt-5">
                    <h2>Alterar o(os) campo(s)</h2>
                    <div className="col-sm-3">
                        <div className="mb-3">
                            <label   className="form-label">Nome do link </label> <br/>
                            <input onChange={handleChangeLink} type="text"  name="socialNetworkName" className="form-control"   />
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <div className="mb-3">
                            <label  className="form-label">Link de redirecionamento</label> <br/>
                            <input onChange={handleChangeLink} name="socialLink"   type="text" className="form-control"    />
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <div className="mb-3">

                            <label  className="form-label">Icone pré-definido</label> <br/>
                            <span className="caret"></span>
                            <select onChange={handleChangeLink} name="icon" className="browser-default custom-select form-control" defaultValue="Selecione"   >
                                <option  value="Selecione"  disabled> </option>
                                <option value="fa fa-whatsapp">WhatsApp</option>
                                <option value="fa fa-instagram">Instagram</option>
                                <option value="fa fa-facebook-official">Facebook</option>
                                <option value="fa fa-twitter-square">Twitter</option>
                                <option value="fa fa-linkedin-square">LinkedIn</option>
                                <option value="fa fa-sitemap">Site Web</option>
                            </select>
                        </div>
                    </div>

                    {/* <div className="col-sm-3 icon_middle">
                        <div className="duplicate pb-5">
                            <span onClick={submitSingleLinkChange} className="btn btn-success multi-item-add">Alterar e salvar dados</span>
                        </div>
                    </div> */}


                    <div className="col-sm-3  ">
                        <div className="btn_wrapper ">
                            <div className="duplicate pb-5">
                                <label  className="form-label">Visível </label> <br/>
                                <span className="caret"></span>
                                <select onChange={handleChangeLink} name="visible" className="browser-default custom-select form-control" defaultValue='sim'   >
                                    <option  value='yes'  disabled>Sim</option>
                                    <option value="yes">Sim</option>
                                    <option value="no">Não</option>
                                </select>
                            </div>
                            <div className="duplicate modify_btn">
                                <span onClick={submitSingleLinkChange} className="btn btn-success multi-item-add">Alterar e salvar dados</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* voltar */}
                <div className="duplicate pb-5">
                    <span onClick={goBackPrevious} className="btn btn-primary multi-item-add">Voltar</span>
                </div>


           </div>                                                             
           <Footer/>
    </>
  )
}

export default AdminEditClientSocialNetwork