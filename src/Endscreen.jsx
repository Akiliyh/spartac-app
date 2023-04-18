import { Component } from "react";

class Endscreen extends Component {

    componentDidMount() {
    }

    componentWillUnmount() {

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