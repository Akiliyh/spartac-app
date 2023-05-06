import { Component } from "react";
import { BiX } from 'react-icons/bi';
import laum from './img/chercheur.svg';
import music from './img/musique.svg';
import livre from './img/carnyx-modal.svg';
import poster from './img/carnyx-modal.svg';
import carnyx from './img/carnyx-player.svg';
import info from './img/info.svg';
import yoga from './img/yoga-modal.svg';
import personnel from './img/personnel.svg';

import personnelAudio from './audio/BuPersonnel.mp3';
import bienvenueAudio from './audio/BienvenueComplet.mp3';
import carnyxAudio from './audio/Carnyx.mp3';
import livreAudio from './audio/Livre.mp3';
import laumAudio from './audio/Laum.mp3';
import posterAudio from './audio/Poster.mp3';
import infoAudio from './audio/Info.mp3';
import reverbeAudio from './audio/Reverbe.mp3';
import yogaAudio from './audio/Yoga.mp3';
import musiqueAudio from './audio/Musique.mp3';
import fermeAudio from './audio/Porte fermée.mp3';
import scoreAudio from './audio/Score.mp3';
import boutRougeAudio from './audio/BoutRouge.mp3';

class Modal extends Component {

    constructor(props) {
        super(props);
        this.modalAnimationValue = null;
        this.imgAnimationValue = null;
        this.isClosed = false;
        this.state = {
            isActive: this.props.isActive,
            isClosable: false,
            modalImg: null,
            srcAudio: null,
            iteration: 0,
        }
        this.closeModal = this.closeModal.bind(this);
        this.setImg = this.setImg.bind(this);
        this.playAudio = this.playAudio.bind(this);
    }

    componentDidMount() {
        console.log(this.state.isActive);
        this.setImg();
    }

    playAudio(){
        this.audio = new Audio(this.state.srcAudio);
        this.audio.play();
        console.log(this.audio);
    }

    closeModal(e) {
        if (this.state.isClosable) {
            if (!this.isClosed) {
            this.modalAnimationValue = "none";
            setTimeout(() => {
                this.modalAnimationValue = "modalShowing .8s ease-in forwards reverse 1";
            }, 100);
            this.imgAnimationValue = "none";
            setTimeout(() => {
                this.imgAnimationValue = "personAnimation .8s ease reverse .2s";
            }, 100);
            this.props.toggleModal();     
            this.isClosed = true;              
        }
        }

    }

    setImg(){
        switch (this.props.modalImg) {
                case 'yoga':
                    this.setState({modalImg: yoga})
                    this.setState({srcAudio: yogaAudio})
                    break;
                    case 'laum-chercheurs':
                        this.setState({modalImg: laum})
                        this.setState({srcAudio: laumAudio})
                        break;
                case 'bu-livre':
                    this.setState({modalImg: livre})
                    this.setState({srcAudio: livreAudio})
                    break;
                case 'bu-personnel':
                    this.setState({modalImg: personnel})
                    this.setState({srcAudio: personnelAudio})
                    break;
                case 'carnyx-player':
                    this.setState({modalImg: carnyx})
                    this.setState({srcAudio: carnyxAudio})
                    break;
                case 'lium-poster':
                    this.setState({modalImg: poster})
                    this.setState({srcAudio: posterAudio})
                    break;
                case 'lium-info':
                    this.setState({modalImg: info})
                    this.setState({srcAudio: infoAudio})
                    break;
                case 'joueur-de-musique':
                    this.setState({modalImg: music})
                    this.setState({srcAudio: musiqueAudio})
                    break;
                case 'score':
                        this.setState({srcAudio: scoreAudio})
                    break;
                case 'introduction':
                        this.setState({srcAudio: bienvenueAudio})
                break;    
                case 'salle-reverberante':
                        this.setState({srcAudio: reverbeAudio})
                break; 
                case 'lium-ferme':
                        this.setState({srcAudio: fermeAudio})
                break; 
                case 'bout-rouge':
                        this.setState({srcAudio: boutRougeAudio})
                break; 
        
            default:
                this.setState({modalImg: null});
                this.setState({srcAudio: null})
                break;
        }
        setTimeout(() => {
            if (this.state.iteration === 0 ) {
                this.playAudio();
                this.setState({iteration: this.state.iteration+1});
            }
        }, 200);


    }

    componentWillUnmount() {
        this.audio.pause()
    }

    render() {
        setTimeout(() => {
            this.setState({isClosable: true})
            this.setImg();
        }, 100);
        const modalAnimationStyle = {
            animation: this.modalAnimationValue,
        }
        const imgAnimationStyle = {
            animation: this.imgAnimationValue,
        }
        return (

            <div className="overlay" onClick={this.closeModal}>
            <div  style={modalAnimationStyle} className="modalContainer" onClick={(e) => {e.stopPropagation();}}>
                <BiX className="cross" onClick={this.closeModal}/>
                <p className="modalText" dangerouslySetInnerHTML={{ __html: this.props.text }}></p> {/* dangerouslySetInnerHTML can allow malicious injection but we have full control of the JSON being fetched so no problems to worry about */}
            </div>
            <div style={imgAnimationStyle} className='personDialog'>
                        <img src={this.state.modalImg} alt=""/>
            </div>
            </div>
        )
    }

}

export default Modal;