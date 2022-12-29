import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loading from '../components/Loading';


const AdminEditCLient = ({ history, match }) => {


    //const [socialLinkArray, setSocialLinkArray] = useState([]);
    const [links, setLinks] = useState([{ socialNetworkName: "", socialLink: "", icon: "", visible: "" }]);
    const [plans, setPlans] = useState([]);
    const [plan, setPlan] = useState({});
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [completeName, setCompleteName] = useState("");
    const [featuringTitle, setFeaturingTitle] = useState("");
    const [bannerLink, setBannerLink] = useState("");
    const [youtubeLinkFeaturing, setYoutubeLinkFeaturing] = useState("");
    const [status, setStatus] = useState(""); // block user 
    //state for images
    const [avatar, setAvatar] = useState("");
    const [image, setImage] = useState("");
    //adding new link
    const [newlinks, setNewlinks] = useState({ socialNetworkName: "", socialLink: "", icon: "" });



    // console.log("links", links)

    //load the current client
    const currentCLientLoad = () => {
        axios.get(`/api/v1/client/${match.params.slug}`)
            .then(c => {
                // console.log("single client", c.data.client);
                setCompleteName(c.data.client.completeName);
                setFeaturingTitle(c.data.client.featuringTitle);
                setDescription(c.data.client.description);
                setStatus(c.data.client.status);
                setBannerLink(c.data.client.bannerLink);
                setPlan(c.data.client.plan);
                setYoutubeLinkFeaturing(c.data.client.youtubeLinkFeaturing);
                setLinks(c.data.client.links);
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        currentCLientLoad();
    }, [])


    //show all the plans
    useEffect(() => {
        axios.get('/api/v1/plan/all')
            .then(p => {
                // console.log(p.data.plans);
                setPlans(p.data.plans);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    // handleChange method
    const handleChange = (e) => {
        // console.log("cliked");
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onloadend = () => {
                setAvatar(reader.result);
            }

        } else if (e.target.name === 'image') {
            const reader1 = new FileReader();
            reader1.readAsDataURL(e.target.files[0])
            reader1.onloadend = () => {
                setImage(reader1.result);
            }
        }
    }

    //on change event social network
    const handleSocialLinks = (e, index) => {
        const { name, value } = e.target;
        const list = [...links];
        list[index][name] = value;
        setLinks(list);
    }

    //handle submit form
    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        axios.put(`/api/v1/client/update/${match.params.slug}`,
            { completeName, featuringTitle, description, status, youtubeLinkFeaturing, avatar, image, bannerLink, plan, links })
            .then(u => {
                //console.log(u.data.client);
                if (u.data.success === true) {
                    toast.success("Cliente foi atualizado com sucesso!");
                    setLoading(false);
                    history.push('/dashboard/clients');
                }
            })
            .catch(error => {
                console.log(error);
                toast.error(error.response.data.error);
            })
    }


    //New links event 
    const newLinkOnChange = (e) => {
        setNewlinks({ ...newlinks, [e.target.name]: e.target.value })
    }

    // adding method to add new social network
    const addNewLink = (e) => {
        e.preventDefault();
        //destructure from newlinks
        const { socialNetworkName, socialLink, icon } = newlinks;

        axios.put(`/api/v1/client/addlink/${match.params.slug}`, {
            socialNetworkName, socialLink, icon
        })
            .then(u => {
                //console.log(u.data.client);
                if (u.data.success === true) {
                    setNewlinks({ socialNetworkName: "", socialLink: "", icon: "" })
                    toast.success("Link adionado com sucesso!");
                    currentCLientLoad();
                }
            })
            .catch(error => {
                console.log(error);
                toast.error(error.response.data.error);
            })
    }


    return (
        <>
            <div className=' container plano_wrapper'>
                <Header />

                <div className="title_create_plan">
                    <h2 className="pt-5"> Dados gerais do cliente</h2>
                </div>
                {

                    loading ? <Loading /> :
                        <>
                            <div className="pt-3">
                                <form onSubmit={handleSubmit}>

                                    {/* first row */}
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <label className="form-label">Nome do cliente</label>
                                                <input onChange={(e) => setCompleteName(e.target.value)} name="completeName" type="text" className="form-control" value={completeName} />
                                            </div>
                                        </div>

                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <label className="form-label">Bloqueado</label>
                                                <select onChange={(e) => setStatus(e.target.value)} name="status" className="browser-default custom-select form-control" defaultValue={status}>
                                                    <option value={status} disabled>{status ? "Sim" : "Não"} </option>
                                                    <option value="yes">Sim</option>
                                                    <option value="no">Não</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <label className="form-label">Plano atual</label>
                                                <select onChange={(e) => setPlan(e.target.value)} name="plan" className="browser-default custom-select form-control" defaultValue={plan.name} >
                                                    {/* <option  defaultValue={plan._id }  >{plan.name }</option> */}
                                                    {
                                                        plans && plans.map(singleP => (
                                                            <option key={singleP._id} value={singleP._id}>{singleP.name}</option>
                                                        ))
                                                    }

                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* end of  first row */}


                                    {/* second row */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <label className="form-label">Título de destaque</label>
                                                <input onChange={(e) => setFeaturingTitle(e.target.value)} name="featuringTitle" type="text" className="form-control" value={featuringTitle} required />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Imagem de perfil</label>
                                                <input onChange={handleChange} name="avatar" type="file" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <label className="form-label">Link do YouTube / Vimeo</label>
                                                <input onChange={(e) => setYoutubeLinkFeaturing(e.target.value)} name="youtubeLinkFeaturing" type="text" className="form-control" value={youtubeLinkFeaturing ? youtubeLinkFeaturing : ''} />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <label className="form-label">Texto de detalhamento </label> <br />
                                                <ReactQuill theme="snow" onChange={(e) => setDescription(e)} name="description" className="form-control" id="" cols="" rows="10" placeholder="Escreva uma descrição..." value={description} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* end of  second row */}

                                    {/* end of  third row */}
                                    <div className="thirdRow">
                                        <h5>Banner / Imagem de destaque</h5>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="mb-3">
                                                    <label className="form-label">banner </label> <br />
                                                    <input onChange={handleChange} name="image" type="file" className="form-control" />
                                                </div>
                                            </div>

                                            <div className="col-sm-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Link de redirecionamento</label> <br />
                                                    <input onChange={(e) => setBannerLink(e.target.value)} name="bannerLink" type="text" className="form-control" value={bannerLink} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* end of  fourth row */}
                                    <div id="fourthRow" className="fourthRow pt-4 ">
                                        <h5>Botões / Links</h5>

                                        {
                                            links && links.map((link, index) => (


                                                <div key={index} className="row multi-item">
                                                    <div className="col-sm-3">
                                                        <div className="mb-3">
                                                            <label className="form-label">Nome do link </label> <br />
                                                            <input onChange={(e) => handleSocialLinks(e, index)} type="text" name="socialNetworkName" className="form-control" value={link.socialNetworkName} />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="mb-3">
                                                            <label className="form-label">Link de redirecionamento</label> <br />
                                                            <input onChange={(e) => handleSocialLinks(e, index)} name="socialLink" type="text" className="form-control" value={link.socialLink} />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="mb-3">

                                                            <label className="form-label">Icone pré-definido</label> <br />
                                                            <span className="caret"></span>
                                                            <select onChange={(e) => handleSocialLinks(e, index)} name="icon" className="browser-default custom-select form-control" defaultValue={link.icon}   >
                                                                <option value={link.icon} disabled>{link.icon} </option>
                                                                <option value="fa fa-whatsapp">WhatsApp</option>
                                                                <option value="fa fa-instagram">Instagram</option>
                                                                <option value="fa fa-facebook-official">Facebook</option>
                                                                <option value="fa fa-twitter-square">Twitter</option>
                                                                <option value="fa fa-linkedin-square">LinkedIn</option>
                                                                <option value="fa fa-sitemap">Site Web</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3  ">
                                                        <div className="btn_wrapper ">
                                                            <div className="duplicate pb-5">
                                                                <label className="form-label">Visível </label> <br />
                                                                <span className="caret"></span>
                                                                <select onChange={(e) => handleSocialLinks(e, index)} name="visible" className="browser-default custom-select form-control" defaultValue={link.visible}  >
                                                                    <option value={link.visible} disabled>{link.visible === false ? "Não" : "Sim"}</option>
                                                                    <option value="yes">Sim</option>
                                                                    <option value="no">Não</option>
                                                                </select>
                                                            </div>
                                                            {/* <div className="duplicate modify_btn">
                                                                <a href={`/dashboard/link/edit/${match.params.slug}/${link._id}`} className="btn btn-success multi-item-add">Alterar dados</a>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>


                                            ))
                                        }

                                    </div>

                                    <button type="submit" className="btn btn-primary">Alterar Cliente</button>
                                </form>
                            </div>


                            {/* adding new link */}
                            <div className="title_add_link pt-5 ">
                                <h2 style={{ color: "green" }}>Adicionar novo link</h2>
                            </div>
                            <form onSubmit={addNewLink}>
                                <div className="row multi-item">
                                    <div className="col-sm-3">
                                        <div className="mb-3">
                                            <label className="form-label">Nome do link </label> <br />
                                            <input onChange={newLinkOnChange} name="socialNetworkName" type="text" className="form-control" value={newlinks.socialNetworkName} required />
                                        </div>
                                    </div>

                                    <div className="col-sm-3">
                                        <div className="mb-3">
                                            <label className="form-label">Link de redirecionamento</label> <br />
                                            <input onChange={newLinkOnChange} name="socialLink" type="text" className="form-control" value={newlinks.socialLink} required />
                                        </div>
                                    </div>

                                    <div className="col-sm-3">
                                        <div className="mb-3">

                                            <label className="form-label">Icone pré-definido</label> <br />
                                            <span className="caret"></span>
                                            <select onChange={newLinkOnChange} name="icon" className="browser-default custom-select form-control" value={newlinks.icon} required >
                                                <option disabled> </option>
                                                <option value="fa fa-whatsapp">WhatsApp</option>
                                                <option value="fa fa-instagram">Instagram</option>
                                                <option value="fa fa-facebook-official">Facebook</option>
                                                <option value="fa fa-twitter-square">Twitter</option>
                                                <option value="fa fa-linkedin-square">LinkedIn</option>
                                                <option value="fa fa-sitemap">Site Web</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-sm-12  pt-3 ">
                                        <div className="duplicate ">
                                            <button type='submit' className="btn btn-primary ">+ Adicionar novo link</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            {/* end of adding new link */}
                        </>
                }

            </div>



            <Footer />




        </>
    )
}

export default AdminEditCLient

