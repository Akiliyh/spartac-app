import { Component } from "react";
import finAudio from './audio/Fin.mp3';

class Endscreen extends Component {

    componentDidMount() {
        this.audio = new Audio(finAudio);
        this.audio.play();
    }

    componentWillUnmount() {
        this.audio.pause()
    }


    render() {
        return (
            <div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="congrats">Bravo vous avez résolu l'énigme du carnyx perdu ! À bientôt pour de nouvelles aventures peut-être ! </div>
            </div>

        )
    }
}

export default Endscreen;