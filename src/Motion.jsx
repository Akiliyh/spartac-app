import { Component } from "react";
import motion from "./videos/motiondesignspart.mp4";

class Motion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({isPlaying : true});
        }, 11000);
    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div>
                {!this.state.isPlaying ?
                <div>
                    <div className="motion" >
                        <video autoPlay muted>
                            <source src={motion} type="video/mp4" />
                        </video>
                    </div>
                    <div className="white"></div>
                    </div>
                     : null} 
            </div>

        )
    }
}

export default Motion;