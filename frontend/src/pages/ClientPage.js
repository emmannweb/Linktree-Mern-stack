import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import renderHTML from 'react-render-html';
import Loading from '../components/Loading';

const ClientPage = ({ match }) => {

  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState({});
  const [description, setDescription] = useState("");


  useEffect(() => {
    setLoading(true);
    axios.get(`/api/v1/client/${match.params.slug}`)
      .then(res => {
        console.log(res.data.client);
        setClient(res.data.client);
        setDescription(res.data.client.description);
        setLoading(false);

      })
      .catch((error) => {
        console.log(error)
      })
  }, []);

  console.log(client)

  return (
    <>

      <div className="container plano_wrapper">
        {
          loading ? <Loading /> :
            <>
              <div className="row">
                {
                  client.status ?

                    <>
                      <div className="blockuser">
                        <div className="wrapper_blockuser">
                          <i class="fa fa-frown-o" aria-hidden="true"></i>
                          <h2 className='text-center'>Cliente bloqueado,<br /> entre em contato com o administrador. </h2>
                        </div>
                      </div>
                    </> :
                    <>
                      <div className="col-sm-6 offset-3">
                        <div className="content">
                          <div className="avatar">
                            <img className='img-fluid avatar_feat' src={client && client.avatar != null ? client.avatar.url : ''} alt="" />
                          </div>

                          <div className="title_and_text">
                            <h4>{client && client.featuringTitle}</h4>
                            <p> {renderHTML(description)}</p>
                          </div>

                          <div className="banner">
                            <a href={client.bannerLink ? client.bannerLink : ''}>
                              <img className='img-fluid banner_destaque' src={client && client.image != null ? client.image.url : ''} alt="" />
                            </a>
                          </div>

                          {
                            client && client.youtubeLinkFeaturing !== '' ?
                              <>
                                <div className="youtube_embbeded_link">
                                  <iframe width="100%" height="250" src={`${client.youtubeLinkFeaturing}?rel=0`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                              </>
                              : ''
                          }


                          {
                            client.links && client.links.length > 0 ?
                              <>
                                {
                                  client.links.map(link => {
                                    return (
                                      <>
                                        {
                                          link.socialLink && link.socialNetworkName ?
                                            <>
                                              {link.visible &&

                                                <>
                                                  <div key={link._id} className="social_network" >
                                                    <a target="_blank" href={link.socialLink} rel="noopener noreferrer"><i className={link.icon}></i>{link.socialNetworkName}</a>
                                                  </div>
                                                </>

                                              }

                                            </> : ''
                                        }

                                      </>
                                    )

                                  }


                                  )
                                }

                              </>
                              : ''
                          }


                        </div>
                      </div>
                    </>
                }
              </div>
            </>
        }
      </div>
      <Footer />
    </>
  )
}

export default ClientPage