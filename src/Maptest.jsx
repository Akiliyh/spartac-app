import { createRef, Component } from "react";
import Modal from './Modal.jsx';
import Lock from './Lock.jsx';
import LAUM from './laum1.svg';
import LAUMOpened from './laum2.svg';
import LIUMOpened from './lium2.svg';
import LIUM from './lium1.svg';
import desk from './desk-lium.svg';
import bu from './bu.svg';
import personnel from './bu-personnel.svg';
import whiteNoise from './white-noise.mp3';

class Map extends Component {

    constructor(props) {
        super(props);
        this.audio = new Audio(whiteNoise);
        this.ratio = 1.5625;
        this.refX = createRef();
        this.refY = createRef();
        this.previousRefX = null;
        this.previousRefY = null;
        this.dataChange = null; /*Change data.x to data.y, because it's reversed in the */
        this.state = {
            isPlaying: false,
            isPlaced: false,
            relativePosX: 0,
            relativePosY: 0,
            isCalculating: false, /* Is the position currently being calculated */
            isModalActive: false, /* Is the modal currently being displayed */
            curModalText: null, /* Text shown inside the modal*/
            progression: 0, /* Increments each time a problem is resolved until the end of the game*/
            isLockOpenable: false, /* Increments each time a problem is resolved until the end of the game*/
            isLaumOpened: false,
            isLiumOpened: false,
            hasInstrument: false,
            reset: false,
            backgroundPosition: '0cm 0cm'
        }
        this.displayData = this.displayData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchDialogs = this.fetchDialogs.bind(this);
        this.handleSubmitBtn = this.handleSubmitBtn.bind(this);
        this.handleResetBtn = this.handleResetBtn.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleBuildingsChange = this.handleBuildingsChange.bind(this);
        this.convertPxToCm = this.convertPxToCm.bind(this);
    }

    componentDidMount() {
        this.fetchDialogs();
        this.fetchData();
        window.addEventListener('keydown', this.fetchData);
    }

    convertPxToCm(value){
        return value*0.0415; /* for 150 dpi*/
    }

    setOffsets() {
        /* manual manipulation of offsets ONLY FOR ONE SPECIFIC TABLET */
        if (this.state.rawPosition.x < 31) {
            this.setState({
                xOffset: 15,
            })
        } else if (this.state.rawPosition.x > 31 && this.state.rawPosition.x < 42) {
            this.setState({
                xOffset: 10,
            })
        } else if (this.state.rawPosition.y < 32) {
            this.setState({
                yOffset: 8,
            })
        } else if (this.state.rawPosition.y > 32) {
            this.setState({
                yOffset: 3,
            })
        }
        if (this.state.rawPosition.x > 42) {
            this.setState({
                xOffset: 0,
            })
        }
        console.log(this.state.rawPosition);
        console.log(this.state.xOffset);
        console.log(this.state.yOffset);
    }

    displayData(data) {
        /* data coords are reversed */
        console.log(data);
        console.log(window.innerHeight);
        if (this.refX.current.value !== this.previousRefX || this.refY.current.value !== this.previousRefY) {
            if (this.refX.current.value !== "" && this.refX.current !== null && this.refY.current.value !== "" && this.refY.current.value !== null) {
                data.x = this.refX.current.value;
                data.y = this.refY.current.value;
            }
        }
        document.body.style.backgroundPosition =  -(46 - data.y) + 'cm ' +  -(55 - data.y) + 'cm'; /* SPART x becomes y */
        this.refX.current.value = data.y;
        this.refY.current.value = data.x;
        this.previousRefX = this.refX.current.value;
        this.previousRefY = this.refY.current.value;
        this.setState({
            relativePosX: -(55 - data.x),
            relativePosY: -(46 - data.y),
            isCalculating: false,
            backgroundPosition: -(46 - data.y) + 'cm ' + -(55 - data.x) + 'cm',
        })

    }

    handleBuildingsChange(e) {
        let thisLock = e.currentTarget;
        console.log(thisLock.className);
        setTimeout(() => {
            if (thisLock.className === "lock lium-lock") {
                this.setState({
                    isLiumOpened: true
                })
            } else {
                this.setState({
                    isLaumOpened: true
                })
            }
        }, 1500);
    }

    handleSubmitBtn(e) {
        this.fetchData();
    }

    handleResetBtn(e) {
        console.log("object");
        this.setState({
            progression: 0,
            reset: true,
            isLiumOpened: false,
            isLaumOpened: false
        })
        setTimeout(() => {
            this.setState({
                reset: false
            })
        }, 100);
        this.fetchData();

    }

    toggleModal(e) {
        if (e !== undefined) {
            this.fetchDialogs(e.target);
            console.log(e.target);
        }
        if (this.state.isModalActive) {
            setTimeout(() => {
                console.log('test');
                this.setState({ isModalActive: false });
            }, 1000);
        } else {
            this.setState({ isModalActive: true });
        }
    }

    fetchDialogs(el) {
        fetch('dialogs.json')
            .then(response => response.json())
            .then(data => this.getDialog(data, el));
    }

    getDialog(data, el) {
        if (el !== undefined) {
            let elName = el.className;
            console.log(elName);
            elName = elName.replace(' interactive','') /* On retire la classe interactive pour faire correspondre les chaines de caractères avec le json*/
            console.log(elName);
            console.log(data[elName]);
            this.setState({ curModalText: data[elName] });
            this.evaluateProgression(elName)
        }
    }

    evaluateProgression(e) {
        console.log(this.state.progression);
        switch (e) {
            case "score":
                if (this.state.progression === 0) {
                    this.setState({ progression: 1 });
                }
                break;
            case "yoga":
                if (this.state.progression === 1) {
                    this.setState({ progression: 2 });
                }
                break;
            case "laum-chercheurs":
                if (this.state.progression === 2) {
                    this.setState({ progression: 3 });
                }
                break;
            case "joueur-de-musique":
                if (this.state.progression === 3) {
                    this.setState({ progression: 4 });
                }
                this.setState({ hasInstrument: true });
                break;
            case "bu-personnel":
                if (this.state.progression === 4) {
                    this.setState({ progression: 5 });
                }
                break;
            case "test3":
                break;
            default:
                break;
        }
    }

    /* Get position */

    fetchData(){
        this.audio.play();
        //1 ask backend to record
        fetch('http://192.168.0.254:5000/getposition', {
            mode: 'cors',
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }})
              .then(response => {console.log(response); return response.json()})
              .then(data => {
                console.log("now treating data");
                console.log(data.status);
                if(data.status==="success"){
                    this.displayData(data)
                }
                else {
                    this.displayData("undefined")
                  console.log("error finding position");
                }
                
                });
        //2 start sound
        /*this.audio.play();*/
      }

    fetchDataBeforePHP(e) {
        if (e instanceof KeyboardEvent) {
            if (e.key === "Enter") {
                this.setState({ isCalculating: true });
                let limitedCoord = [(594 - window.innerWidth * 2.54 / 150), (420 - window.innerHeight * 2.54 / 150)]; /* A2 value in px - viewport dimensions in order to prevent blank space */
                fetch('http://localhost/spart/position.php?xSize=' + limitedCoord[0] + '&ySize=' + limitedCoord[1] + '&delay=1')
                    .then(response => response.json())
                    .then(data => this.displayData(data));
            }
        } else {
            this.setState({ isCalculating: true });
            let limitedCoord = [(594 - window.innerWidth * 2.54 / 150), (420 - window.innerHeight * 2.54 / 150)]; /* A2 value in px - viewport dimensions in order to prevent blank space */
            fetch('http://localhost/spart/position.php?xSize=' + limitedCoord[0] + '&ySize=' + limitedCoord[1] + '&delay=1')
                .then(response => response.json())
                .then(data => this.displayData(data));
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.fetchDataBeforePHP);
    }


    render() {
        let loading = 'Loaded';
        if (this.state.isCalculating) {
            loading = "Loading";
        }

        return (
            <div>
                {/* {!this.state.isCalculating ? */}
                {!this.state.reset ?
                    <div>
                        <div className="progression">{this.state.progression}/10</div>
                        <div className="map">
                        <div className="debug">
                            <form className="form-pos">
                                <input type="number" max="600" name="x" id="x" placeholder="x" ref={this.refX} />
                                <input type="number" max="600" name="y" id="y" placeholder="y" ref={this.refY} />
                                <button type="button" className="submitBtn" onClick={this.handleSubmitBtn}>Set</button>
                            </form>
                            <button onClick={this.fetchData}>Où suis-je?</button>
                        Je suis à {-this.state.relativePosX + ' ,' + -this.state.relativePosY  + ' ' + this.state.backgroundPosition}

                            <button type="button" className="resetBtn" onClick={this.handleResetBtn}>Reset scenario</button>
                            </div>
                            {/* 1.53 is the ratio between A3 to A2 approx. */}

                            {/* TERRAIN */}

                            <div className="yoga interactive" style={{ top: (this.convertPxToCm(1100) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(2000) + this.state.relativePosX) + 'cm' }} onTouchStart={this.state.progression > 0 ? this.toggleModal : null}></div>
                            <div className="score" style={{ top: (this.convertPxToCm(540) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1735) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></div>
                            {/* LAUM */}

                            <div onTouchStart={this.state.progression >= 2 ? this.handleBuildingsChange : null} className="lock laum-lock" style={{ top: (this.convertPxToCm(1200) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1080) + this.state.relativePosX) + 'cm' }}>
                                <Lock inInterior={false} isOpenable={this.state.progression >= 2 ? true : false} ></Lock> {/* progression 2 equals yoga is done*/}
                            </div>

                            {/* Interior locks */}
                            <div onTouchStart={this.state.progression >= 6 ? this.handleBuildingsChange : null} className="lock laum-lock interior" style={{ top: (this.convertPxToCm(1080) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1100) + this.state.relativePosX) + 'cm' }}>
                                <Lock inInterior={true} isOpenable={this.state.progression >= 6 ? true : false} ></Lock> {/* progression 6 equals carnyx is obtained*/}
                            </div>
                            <div onTouchStart={this.state.progression >= 6 ? this.handleBuildingsChange : null} className="lock laum-lock interior" style={{ top: (this.convertPxToCm(1190) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(910) + this.state.relativePosX) + 'cm' }}>
                                <Lock inInterior={true} isOpenable={this.state.progression >= 6 ? true : false} ></Lock> {/* progression 6 equals carnyx is obtained*/}
                            </div>

                            <img src={this.state.isLaumOpened ? LAUMOpened : LAUM} alt="" className={this.state.isLaumOpened ? "LAUM opened" : "LAUM hidden"} style={{ top: (this.convertPxToCm(900) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-100) + this.state.relativePosX) + 'cm' }} />
                            {/* zone de détection des chercheurs*/}
                            <div className="laum-chercheurs" style={{ top: (this.convertPxToCm(1150) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1250) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></div>
                            <img src={LAUM} alt="" className={this.state.isLaumOpened ? "LAUM hidden exterior" : "LAUM opened exterior"} style={{ top: (this.convertPxToCm(900) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-100) + this.state.relativePosX) + 'cm' }} />

                            {/* LIUM */}

                            <div onTouchStart={this.state.progression >= 0 ? this.handleBuildingsChange : null} className="lock lium-lock" style={{ top: (this.convertPxToCm(225) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1330) + this.state.relativePosX) + 'cm' }}>
                                <Lock inInterior={false} isOpenable={this.state.progression >= 0 ? true : false} ></Lock>
                            </div>
                            <img src={this.state.isLiumOpened ? LIUMOpened : LIUM} alt="" className={this.state.isLiumOpened ? "LIUM opened" : "LIUM hidden"} style={{ top: (this.convertPxToCm(-45) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1053) + this.state.relativePosX) + 'cm' }} />

                            <img src={LIUM} alt="" className={this.state.isLiumOpened ? "LIUM hidden exterior" : "LIUM opened exterior"} style={{ top: (this.convertPxToCm(-45) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1053) + this.state.relativePosX) + 'cm' }} />
                            <img alt="" src={desk} className={this.state.hasInstrument ? "lium-info" : "lium-ferme"} style={{ top: (this.convertPxToCm(140) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1400) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>

                            {/* cadenas informaticienne */}

                            <div className="lock lium-lock interior" style={{ top: (this.convertPxToCm(160) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1310) + this.state.relativePosX) + 'cm' }}>
                                <Lock inInterior={true} isOpenable={this.state.progression >= 2 ? true : false} ></Lock> {/* progression 2 equals yoga is done*/}
                            </div>

                            {/* TRAM */}

                            <div className="tram" style={{ top: (/*1130*1.53*/ this.convertPxToCm(830) + this.state.relativePosY) + 'cm', left: (/*2535*1.53*/ this.convertPxToCm(740) + this.state.relativePosX) + 'cm' }} onTouchStart={() => { console.log('tram touched'); }}></div>

                            {/* PARC */}

                            <div className="joueur-de-musique interactive" style={{ top: this.convertPxToCm(190) + this.state.relativePosY + 'cm', left: (this.convertPxToCm(495) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></div>
                            <div className="note" style={{ top: (this.convertPxToCm(220) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(600) + this.state.relativePosX) + 'cm' }}></div>

                            {/* BU */}

                            <img alt="" src={personnel} className="bu-personnel interactive" style={{ top: (this.convertPxToCm(650) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(225) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <div className="bu-livre" style={{ top: (this.convertPxToCm(750) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(290) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></div>
                            <img alt="" src={bu} className="bu" style={{ top: (this.convertPxToCm(300) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-400) + this.state.relativePosX) + 'cm' }}></img>

                            {/* MODAL */}

                            {this.state.isModalActive ?
                                <Modal text={this.state.curModalText} toggleModal={this.toggleModal} isActive={this.state.isModalActive}></Modal>
                                : null}
                        </div>
                        {/* : null} */}
                        <div>{loading}</div>
                    </div>
                    : null}
            </div>

        )
    }
}

export default Map;