import { Component } from "react";
import { BiX } from 'react-icons/bi';

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.modalAnimationValue = null;
        this.isClosed = false;
        this.state = {
            isClosable: false,
        }
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal(e) {
            if (!this.isClosed) {
            this.modalAnimationValue = "none";
            setTimeout(() => {
                this.modalAnimationValue = "modalShowing .8s ease-in forwards reverse 1";
            }, 100);
            setTimeout(() => {
                this.isClosed = true;
            }, 1000);
        }

    }

    componentDidMount() {
        console.log(this.state.isActive);
    }

    componentWillUnmount() {

    }

    render() {
        setTimeout(() => {
            this.setState({isClosable: true})
        }, 100);
        const modalAnimationStyle = {
            animation: this.modalAnimationValue,
        }
        return (
            <div>
            {!this.isClosed ? 

            <div className="overlay" onClick={this.closeModal}>
            <div  style={modalAnimationStyle} className="modalContainer" onClick={(e) => {e.stopPropagation();}}>
                <BiX className="cross" onClick={this.closeModal}/>
                <p className="welcomeText modalText">
                <strong> Bienvenue sur le campus du Mans ! </strong> Pour commencer l'aventure, <strong>déplacez</strong> la <strong>tablette</strong> sur le fond de carte. Vous pourrez interagir avec le décor. Essayez tout d’abord de retrouver le score du match de rugby !
                </p>
            </div>
            </div>
            :null}
            </div>
        )
    }

}

export default Welcome;