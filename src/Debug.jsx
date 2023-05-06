import { Component } from "react";

class Debug extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            iteration: 0
        }
        this.showSettings = this.showSettings.bind(this);
        this.goToLocation = this.goToLocation.bind(this);
        this.fetchDebug = this.fetchDebug.bind(this);
    }

    componentDidMount() {

    }

    showSettings(e) {
        let debug = document.querySelector('.debug');
        debug.classList.toggle('shown');
    }

    goToLocation(e){
        var element = e.target
        var inputElementX = document.getElementById('x');
        var inputElementY = document.getElementById('y');
        if (inputElementX || inputElementY != null) {
        if (element.className === 'lium-btn') {
                inputElementX.value = 36;
                inputElementY.value = 24;
            }
            if (element.className === 'laum-btn') {
                inputElementX.value = 17;
                inputElementY.value = 33;
            }
            if (element.className === 'bu-btn') {
                inputElementX.value = 32;
                inputElementY.value = 55;
            }
            if (element.className === 'parc-btn') {
                inputElementX.value = 35;
                inputElementY.value = 49;
            }
            if (element.className === 'score-btn') {
                inputElementX.value = 30;
                inputElementY.value = 12;
            }    
            if (element.className === 'yoga-btn') {
                inputElementX.value = 20;
                inputElementY.value = 6;
            } 
        }
    }

    fetchDebug() {
        this.props.fetch();
        setTimeout(() => {
            this.props.fetch();
        }, 500);
    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div>
                <svg onClick={this.showSettings} className="settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*<!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->*/}<path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
                <div className="debug">
                    <button className="setOffsets" onClick={this.props.setOffsets}>Offsets</button>
                    <div>
                        <p>{this.props.xOffset + ' xOffset'}</p>
                        <p>{this.props.yOffset + ' yOffset'}</p>
                    </div>
                    <button className="progressionUp" onClick={this.props.setProgression}>ProgressionUP</button>
                    <button className="progressionDown" onClick={this.props.setProgression}>ProgressionDOWN</button>
                    <button className="hasInstrument" onClick={this.props.setProgression}>Toggle Instrument</button>
                    <form className="form-pos">
                        <input type="number" max="600" name="x" id="x" placeholder="x" ref={this.props.refX} />
                        <input type="number" max="600" name="y" id="y" placeholder="y" ref={this.props.refY} />
                        <button type="button" className="submitBtn" onClick={this.fetchDebug}>Set</button>
                    </form>
                    Je suis à {this.props.rawPosition.x + ' ,' + this.props.rawPosition.y + ' ' + this.props.backgroundPosition}

                    <button type="button" className="resetBtn" onClick={this.props.handleReset}>Reset scenario</button>
                    <button type="button" className="introduction" onClick={this.props.toggleModal}>Show Introduction</button>
                    <button type="button" className="lium-btn" onClick={this.goToLocation}>LIUM</button>
                    <button type="button" className="bu-btn" onClick={this.goToLocation}>BU</button>
                    <button type="button" className="laum-btn" onClick={this.goToLocation}>LAUM</button>
                    <button type="button" className="parc-btn" onClick={this.goToLocation}>Parc</button>
                    <button type="button" className="score-btn" onClick={this.goToLocation}>Score</button>
                    <button type="button" className="yoga-btn" onClick={this.goToLocation}>Yoga</button>
                </div>
            </div>

        )
    }
}

export default Debug;