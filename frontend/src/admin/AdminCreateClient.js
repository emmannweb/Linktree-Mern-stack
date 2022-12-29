import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loading from '../components/Loading';


const AdminCreateClient = ({ history }) => {

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    //state for images
    const [avatar, setAvatar] = useState("");
    const [image, setImage] = useState("");

    const [links, setLinks] = useState([{ socialNetworkName: "", socialLink: "", icon: "" }]);
    //create client state
    const [client, setClient] = useState({
        completeName: "",
        featuringTitle: "",
        status: "",
        youtubeLinkFeaturing: "",
        bannerLink: "",
        plan: ""
    })

    // destructure
    const { completeName, featuringTitle, status, youtubeLinkFeaturing, bannerLink, plan } = client;

    //console.log("links", links)

    // const pushNewObjectInArray = () => {

    //     if (socialNetworkName !== "" && socialLink !== "" && icon !== "") {
    //         setLinks([...links.filter(a => a.socialNetworkName !== linksobj.socialNetworkName), linksobj])
    //         setLinksobj(
    //             {
    //                 socialNetworkName: "",
    //                 socialLink: "",
    //                 icon: ""
    //             }
    //         )
    //     }
    // }


    useEffect(() => {
        axios.get('/api/v1/plan/all')
            .then(p => {
                // console.log(p.data.plans);
                setPlans(p.data.plans);
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    }, []);

    //add new item on click
    const addNewItem = (e) => {
        // links.forEach((item, index) => {
        //     links[index][name] === '';
        //     //check item
        //     let itemCheck;
        //     if (itemCheck = item.socialNetworkName ? item.socialNetworkName : null) {
        //         return false
        //     }
        // })
        // links.forEach(item => {
        // if (item.socialNetworkName !== '' || item.socialNetworkName !== null || item.socialNetworkName !== undefined) {
        // if (item.socialNetworkName !== '' ) {

        //     return false;
        //     console.log("you hit me!")
        // }
        //     console.log("link loop", item.socialNetworkName ? item.socialNetworkName : null)
        // })
        // if (links.socialNetworkName === '', links.socialLink === '', links.icon === '') {
        // }
        // const list = [...links];
        // const { name, value } = e.target;
        // console.log("list", list)
        // list[index][name] = value;
        // if (list[index][name] === '') {
        //     return false;
        // }

        if (links.length === 10) {
            return false;
        }
        setLinks([...links.filter(a => a.socialNetworkName !== links.socialNetworkName), { socialNetworkName: "", socialLink: "", icon: "" }])
    }


    const removeLinks = (index) => {

        const list = [...links];
        if (list.length === 1) {
            return false;
        }
        list.splice(index, 1);
        setLinks(list);

    };





    // handleChange method
    const handleChange = (e) => {
        //console.log("cliked");
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

        else {
            setClient({ ...client, [e.target.name]: e.target.value })
        }
    }

    const handleSocialLinks = (e, index) => {
        const { name, value } = e.target;
        const list = [...links];
        list[index][name] = value;
        if (list[index][name] === '') {
            return false;
        }
        setLinks(list);
    }


    //handle submit
    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        axios.post('/api/v1/client/create',
            { completeName, featuringTitle, description, status, links, youtubeLinkFeaturing, avatar, image, bannerLink, plan })
            .then(u => {
                console.log(u.data.client);
                if (u.data.success === true) {
                    toast.success("Client foi criado com sucesso");
                    setLoading(false);
                    history.push('/dashboard/clients');
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

                    loading ? <><div className="loading"> <Loading /></div></> :
                        <>
                            <div className="pt-3">
                                <form onSubmit={handleSubmit}>

                                    {/* first row */}
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <label className="form-label">Nome do cliente</label>
                                                <input onChange={handleChange} name="completeName" type="text" className="form-control" required />
                                            </div>
                                        </div>

                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <label className="form-label">Bloqueado</label>
                                                <select onChange={handleChange} name="status" className="browser-default custom-select form-control" defaultValue={'DEFAULT'}>
                                                    <option value="DEFAULT" disabled>Selecione</option>
                                                    <option value="yes">Sim</option>
                                                    <option value="no">Não</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-sm-4">
                                            <div className="mb-3">
                                                <label className="form-label">Plano atual</label>
                                                <select onChange={handleChange} name="plan" className="browser-default custom-select form-control" defaultValue={'DEFAULT'} required>
                                                    <option value="DEFAULT" disabled>Selecione</option>
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
                                                <input onChange={handleChange} name="featuringTitle" type="text" className="form-control" required />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Imagem de perfil</label>
                                                <input onChange={handleChange} name="avatar" type="file" className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="mb-3">
                                                <label className="form-label">Link do YouTube / Vimeo</label>
                                                <input onChange={handleChange} name="youtubeLinkFeaturing" type="text" className="form-control" />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="mb-3">
                                                <label className="form-label">Texto de detalhamento </label> <br />
                                                <ReactQuill theme="snow" onChange={(e) => setDescription(e)} name="description" className="form-control" id="" cols="" rows="10" placeholder="Escreva uma descrição..." required />
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
                                                    <input onChange={handleChange} name="image" type="file" className="form-control" required />
                                                </div>
                                            </div>

                                            <div className="col-sm-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Link de redirecionamento</label> <br />
                                                    <input onChange={handleChange} name="bannerLink" type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* end of  fourth row */}
                                    <div id="fourthRow" className="fourthRow pt-4 ">
                                        <h5>Botões / Links</h5>

                                        {
                                            links.map((link, index) => (

                                                <div key={index} className="row multi-item">
                                                    <div className="col-sm-3">
                                                        <div className="mb-3">
                                                            <label className="form-label">Nome do link </label> <br />
                                                            <input onChange={(e) => handleSocialLinks(e, index)} value={links.socialNetworkName} type="text" name="socialNetworkName" className="form-control" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="mb-3">
                                                            <label className="form-label">Link de redirecionamento</label> <br />
                                                            <input onChange={(e) => handleSocialLinks(e, index)} name="socialLink" value={links.socialLink} type="text" className="form-control" required />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="mb-3">

                                                            <label className="form-label">Icone pré-definido</label> <br />
                                                            <span className="caret"></span>
                                                            <select onChange={(e) => handleSocialLinks(e, index)} name="icon" value={links.icon} className="browser-default custom-select form-control" defaultValue={'DEFAULT'} required>
                                                                <option value="DEFAULT" disabled>Selecione</option>
                                                                <option value="fa fa-whatsapp">WhatsApp</option>
                                                                <option value="fa fa-instagram">Instagram</option>
                                                                <option value="fa fa-facebook-official">Facebook</option>
                                                                <option value="fa fa-twitter-square">Twitter</option>
                                                                <option value="fa fa-linkedin-square">LinkedIn</option>
                                                                <option value="fa fa-sitemap">Site Web</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-3 icon_middle">
                                                        <div className="">
                                                            {

                                                                links.length > 1 && <i onClick={() => removeLinks(index)} className='fa fa-trash remove' style={{ fontSize: "18px", color: "red" }}></i>
                                                            }

                                                        </div>
                                                    </div>
                                                </div>


                                            ))
                                        }

                                    </div>
                                    <div className="duplicate pb-5">
                                        <span onClick={addNewItem} className="btn btn-success multi-item-add">+ Adicionar novo</span>
                                        {/* <span onClick={handleEventField} className="btn btn-success add_to_list">+ Adicionar na lista</span> */}
                                    </div>

                                    <button type="submit" className="btn btn-primary">Criar Cliente</button>
                                </form>
                            </div>
                        </>
                }

            </div>



            <Footer />




        </>
    )
}

export default AdminCreateClient

