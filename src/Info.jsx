import { Component } from "react";
import LAUMLogo from './img/laum-logo.png';
import LIUMLogo from './img/Logo-LIUM_Couleurs_WEB.png';
import CNRSLogo from './img/logo_cnrs_blanc.svg';

class Info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,

        }
        this.showInfo = this.showInfo.bind(this);
    }

    componentDidMount() {

    }

    showInfo(e) {
        let info = document.querySelector('.info');
        info.classList.toggle('shown');
    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div>
                <svg onClick={this.showInfo} className="info-show" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{/*<!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->*/}<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                <div className="info">
                <div className="credits">
                    <div className="desc-projet">
                        <p>Cette application est un démonstrateur de la technologie SPART-AC, développée par Guillaume Boucher. SPART-AC est une technologie réalisée en collaboration entre le LAUM et le LIUM.</p>
                    </div>
                    <div className="credits-projet">
                    <p>Conception</p>
                        <div>
                        <p>Guillaume BOUCHER</p>
                        <p>Louis CORTADE</p>
                        <p>Alice DINSENMEYER</p>
                        <p>Luyao DONG</p>
                        <p>Pierre-Arnaud LECOMTE</p>
                        <p>Stéphane LETOURNEUR</p>
                        <p>Pierrick LOTTON</p>
                        <p>Iza MARFISI</p>
                        <p>Laurent SIMON</p>
                        <p>Sebastian SIMON</p>
                        </div>
                    </div>
                    <div className="voix">
                        <p>Voix</p>
                        <div>
                        <p>Vincent AGUEDA</p>
                        <p>Guillaume BOUCHER</p>
                        <p>Clément CHEVREUIL</p>
                        <p>Mohamed Hamza FALIH</p>
                        <p>Alexandra FREITAS ALVES</p>
                        <p>Muriel LEPRETTRE</p>
                        <p>Iza MARFISI</p>
                        </div>
                    </div>
                    <div className="liens">
                        <a href="http://spart-lium.univ-lemans.fr">http://spart-lium.univ-lemans.fr</a>
                    </div>
                    <div className="logos">
                        <img src={LIUMLogo} alt="" />
                        <img className="laumLogo" src={LAUMLogo} alt="" />
                        <img className="cnrs" src={CNRSLogo} alt="" />
                    </div>
                </div>
                </div>
            </div>

        )
    }
}

export default Info;