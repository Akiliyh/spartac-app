import { Component } from "react";
import { BiX } from 'react-icons/bi';
import laum from './img/chercheur.svg';
import music from './img/musique.svg';
import livre from './img/bu-livre-modal.svg';
import poster from './img/carnyx-modal.svg';
import carnyx from './img/carnyx-player.svg';
import info from './img/info.svg';
import yoga from './img/yoga-modal.svg';
import personnel from './img/personnel.svg';

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
        }
        this.closeModal = this.closeModal.bind(this);
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
                    break;
                    case 'laum-chercheurs':
                        this.setState({modalImg: laum})
                        break;
                case 'bu-livre':
                    this.setState({modalImg: livre})
                    break;
                case 'bu-personnel':
                    this.setState({modalImg: personnel})
                    break;
                case 'carnyx-player':
                    this.setState({modalImg: carnyx})
                    break;
                case 'lium-poster':
                    this.setState({modalImg: poster})
                    break;
                case 'lium-info':
                    this.setState({modalImg: info})
                    break;
                case 'joueur-de-musique':
                    this.setState({modalImg: music})
                    break;
        
            default:
                this.setState({modalImg: null})
                break;
        }
    }

    componentDidMount() {
        console.log(this.state.isActive);
        this.setImg()
    }

    componentWillUnmount() {

    }

    render() {
        setTimeout(() => {
            this.setState({isClosable: true})
            this.setImg()
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
            <div style={imgAnimationStyle} className={this.state.modalImg === livre ? 'personDialog bu-livre-modal' : 'personDialog' } >
                        <img src={this.state.modalImg} alt=""/>
            </div>
            </div>
        )
    }

}

export default Modal;