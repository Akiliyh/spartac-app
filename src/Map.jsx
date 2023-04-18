import { createRef, Component } from "react";
import Modal from './Modal.jsx';
import Endscreen from './Endscreen.jsx';
import Lock from './Lock.jsx';
import Debug from './Debug.jsx';
import LAUM from './img/laum1.svg';
import LAUMOpened from './img/laum2.svg';
import LAUMChercheurs from './img/laum-chercheurs.svg';
import LAUMReverb from './img/laum-reverb.svg';
import LAUMAnech from './img/laum-anech.svg';
import LAUMAllOpened from './img/laum-all-opened.svg';
import LIUMOpened from './img/lium2.svg';
import LAUMFeet from './img/feet.svg';
import carnyx from './img/carnyx-player.svg';
import LIUM from './img/lium1.svg';
import panneauBU from './img/panneau-bu.svg';
import panneauLIUM from './img/panneau-lium.svg';
import panneauLAUM from './img/panneau-laum.svg';
import desk from './img/desk-lium.svg';
import poster from './img/carnyx-poster.svg';
import bu from './img/bu.svg';
import livre from './img/livre.svg';
import personnel from './img/bu-personnel.svg';
import boutRouge from './img/bout-rouge.svg';
import whiteNoise from './white-noise.mp3';
import score from './img/score.svg';
import arbres from './img/trees.svg';
import poteaux from './img/poteaux.svg';
import calculateMotion from './videos/calculateMotion.mp4';



class Map extends Component {

    constructor(props) {
        super(props);
        this.audio = new Audio(whiteNoise);
        this.refX = createRef(); /* x coord manually stored in the x debug input */
        this.refY = createRef(); /* y coord manually stored in the y debug input */
        this.previousRefX = null;
        this.previousRefY = null;
        this.state = {
            relativePosX: 0,
            relativePosY: 0,
            isCalculating: false, /* Is the position currently being calculated */
            isModalActive: false, /* Is the modal currently being displayed */
            curModalText: null, /* Text shown inside the modal */
            progression: 0, /* Increments each time a problem is resolved until the end of the game */
            isLockOpenable: false,
            isLaumOpened: false,
            isLiumOpened: false,
            isAnechOpened: false,
            isReverbOpened: false,
            laumImage: LAUM,
            hasInstrument: false,
            modalImg: null,
            reset: false,
            backgroundPosition: '0cm 0cm',
            rawPosition: {
                y: 0,
                x: 0,
            },
            yOffset: 3, /* Offsets by default */
            xOffset: 5,
        }
        this.displayData = this.displayData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchDialogs = this.fetchDialogs.bind(this);
        this.debugFetch = this.debugFetch.bind(this);
        this.handleResetBtn = this.handleResetBtn.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleBuildingsChange = this.handleBuildingsChange.bind(this);
        this.convertPxToCm = this.convertPxToCm.bind(this);
        this.setOffsets = this.setOffsets.bind(this);
        this.getPosition = this.getPosition.bind(this);
        this.setProgression = this.setProgression.bind(this);
        this.handleLAUMImages = this.handleLAUMImages.bind(this);
    }

    componentDidMount() {
        /*  */
        this.fetchDialogs();
        this.fetchData();
        window.addEventListener('keydown', this.fetchData);
    }

    /* Debug functions */

    debugFetch(e) {
        this.fetchData();
    }

    setProgression(e) {   /* Modifie la progression depuis la fenêtre de Dev */
        console.log(this.state.progression);
        console.log(this.state.isCalculating);
        if (e.target.className === "progressionUp") {
            this.setState({
                progression: this.state.progression + 1,
            })
        } else {
            this.setState({
                progression: this.state.progression - 1,
            })
        }
        console.log(e.target);
    }

    /* Reset l'aventure depuis la fenêtre de debug */

    handleResetBtn(e) {
        this.setState({
            progression: 0,
            reset: true,
            isLiumOpened: false,
            isLaumOpened: false,
            isAnechOpened: false,
            isReverbOpened: false,
        })
        setTimeout(() => {
            this.setState({
                reset: false
            })
        }, 100);
        this.fetchData();
    }

    /* Map functions */

    fetchData(e) {
        if (e instanceof KeyboardEvent) {
            if (e.key === "Enter") {
                this.setOffsets();
                this.getPosition();
            }
        } else {
            this.setOffsets();
            this.getPosition();
        }
    }

    /* Fetch la position */

    getPosition() {
        this.setOffsets();
        this.setState({ isCalculating: true });
        //1 ask backend to record
        fetch('http://192.168.0.254:5000/getposition', {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => { console.log(response); return response.json() })
            .then(data => {
                console.log("now treating data");
                console.log(data.status);
                if (data.status === "success") {
                    this.displayData(data);
                    this.audio.load();
                }
                else {
                    this.displayData("undefined")
                    console.log("error finding position");
                }

            })
            .catch(error => this.displayData(error))
        //2 start sound
        this.audio.play();
    }

    /* On récupère les données de la position (que cela soit depuis la position de debug ou par le fetch) et on l'associe au style de l'image de fond */
    /* On associe le x du prototype avec l'y de l'application pour faire correspondre les coords */

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
        this.setState({
            rawPosition: {
                y: data.y,
                x: data.x
            }
        })
        this.setOffsets();
        /* Pour mettre en place la position du background on prend la position que l'on a récupéré que l'on soustrait à la valeur maximale possible sur le prototype puis on ajoute les offsets */
        document.body.style.backgroundPosition = -(55 - data.y + this.state.yOffset) + 'cm ' + -(46 - data.x + this.state.xOffset) + 'cm'; /* SPART x becomes y// 55 and 46 are max ranges we reverse the whole thing*/
        this.refX.current.value = data.x;
        this.refY.current.value = data.y;
        this.previousRefX = this.refX.current.value;
        this.previousRefY = this.refY.current.value;
        this.setState({
            relativePosX: -(55 - data.y + this.state.yOffset),
            relativePosY: -(46 - data.x + this.state.xOffset),
            backgroundPosition: -(55 - data.y + this.state.yOffset) + 'cm ' + -(46 - data.x + this.state.xOffset) + 'cm',
        })
        setTimeout(() => {
            this.setState({
                isCalculating: false,
            })
        }, 1000);

    }

    /* Fetch les dialogues */

    fetchDialogs(el) {
        fetch('dialogs.json')
            .then(response => response.json())
            .then(data => this.getDialog(data, el));
    }

    /* On récupère l'élément et les paragraphes du json. En fonction de la classe de l'élément correspondant on l'associe à un paragraphe du json */

    getDialog(data, el) {
        if (el !== undefined) {
            let elName = el.className;
            elName = elName.replace(' interactive', '') /* On retire la classe interactive pour faire correspondre les chaines de caractères avec le json*/
            console.log(elName);
            console.log(data[elName]);
            this.setState({ curModalText: data[elName] });
            this.setState({ modalImg: elName });
            this.evaluateProgression(elName)
        }
    }

    convertPxToCm(value) {
        return value * 0.0415; /* converts pixel value to cm for 150 dpi */
    }

    /* On définit manuellement l'offset en fonction de la position car les éléments dans les coins de la carte sont durs à atteindre */
    /* Problème surement dû à autre chose mais pour le moment ça fait le travail */

    setOffsets() {
        /* manual manipulation of offsets ONLY FOR ONE SPECIFIC TABLET */
        if (this.state.rawPosition.x < 21) {
            this.setState({
                xOffset: 10,
            })
        } else if (this.state.rawPosition.x > 31 && this.state.rawPosition.x < 42) {
            this.setState({
                xOffset: 0,
            })
        } else if (this.state.rawPosition.y < 32) {
            this.setState({
                yOffset: 9,
            })
        } else if (this.state.rawPosition.y > 55) {
            this.setState({
                yOffset: -20,
            })
        }
        if (this.state.rawPosition.x > 42) {
            this.setState({
                xOffset: 10,
            })
        }
        console.log(this.state.rawPosition);
        console.log(this.state.xOffset);
        console.log(this.state.yOffset);
    }

    /* Animation des bâtiments  */

    handleBuildingsChange(e) {
        let thisLock = e.currentTarget;
        console.log(thisLock.className);
        setTimeout(() => {
            if (thisLock.className === "lock lium-lock") {
                this.setState({
                    isLiumOpened: true
                })
            }
            if (thisLock.className === "lock laum-lock") {
                this.setState({
                    isLaumOpened: true
                })
            }
            if (thisLock.className === "lock laum-lock interior anech") {
                this.setState({
                    isAnechOpened: true
                })
            }
            if (thisLock.className === "lock laum-lock interior reverb") {
                this.setState({
                    isReverbOpened: true
                })
            }
            this.handleLAUMImages();
            console.log(this.state.isAnechOpened);
            console.log(this.state.isReverbOpened);

        }, 1500);
    }

    /* En fonction de l'avancement de l'aventure on change la source de l'image du LAUM qui est en 4 étapes  */ 

    handleLAUMImages(e) {
        setTimeout(() => {
            console.log(this.state.laumImage);
            console.log(this.state.isLaumOpened);
            if (this.state.isLaumOpened && !this.state.isAnechOpened && !this.state.isReverbOpened) {
                this.setState({
                    laumImage: LAUMOpened,
                })
            }
            if (this.state.isAnechOpened) {
                if (!this.state.isReverbOpened) {
                    console.log(this.state.isAnechOpened);
                    this.setState({
                        laumImage: LAUMAnech,
                    })
                }
            }
            if (this.state.isReverbOpened) {
                if (!this.state.isAnechOpened) {
                    console.log(this.state.isReverbOpened);
                    this.setState({
                        laumImage: LAUMReverb,
                    })
                }
            }
        }, 100);
    }

    /* à chaque fois que l'on toggle le modal  on fetch les dialogues et on transmet l'élément en question  */

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

    /* En fonction de la classe de l'élément cliqué on augmente la progression, le jeu se finit lorsque la progression atteint 10 */

    evaluateProgression(e) {
        console.log(this.state.progression);
        switch (e) {
            case "score":
                if (this.state.progression === 0) {
                    this.setState({ progression: this.state.progression + 1 });
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
            case "bu-personnel":
                if (this.state.progression === 3 || this.state.progression === 4) {
                    this.setState({ progression: this.state.progression + 1 });
                }
                break;
            case "bu-livre":
                if (this.state.progression === 3 || this.state.progression === 4) {
                    this.setState({ progression: this.state.progression + 1 });
                }
                break;
            case "lium-info":
                if (this.state.progression === 6 || this.state.progression === 7) {
                    this.setState({ progression: this.state.progression + 1 });
                }
                break;
            case "lium-poster":
                if (this.state.progression === 6 || this.state.progression === 7) {
                    this.setState({ progression: this.state.progression + 1 });
                }
                break;
            case "salle-reverberante":
                if (this.state.progression === 8 || this.state.progression === 9) {
                    this.setState({ progression: this.state.progression + 1 });
                }
                break;
            case "carnyx-player":
                if (this.state.progression === 8 || this.state.progression === 9) {
                    this.setState({ progression: 10 });
                }
                break;
            case "joueur-de-musique":
                if (this.state.hasInstrument === false) {
                    this.setState({ progression: this.state.progression + 1 });
                }
                this.setState({ hasInstrument: true });
                break;
            default:
                break;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.fetchData);
    }


    render() {
        let loading = 'Loaded';
        if (this.state.isCalculating) {
            loading = "Loading";
        }

        return (
            <div>
                {this.state.isCalculating ?
                    <div className="motion calculateMotion" >
                        <video autoPlay muted>
                            <source src={calculateMotion} type="video/mp4" />
                        </video>
                    </div>
                    : null}
                <div>
                    {this.state.progression === 10 ?
                        <Endscreen></Endscreen>
                        : null}
                </div>

                {!this.state.reset ?
                    <div>
                        <div className="progression">{this.state.progression}/10</div>
                        <div className="map">

                            {/* Debug  */}

                            <Debug toggleModal={this.toggleModal} refX={this.refX} refY={this.refY} backgroundPosition={this.state.backgroundPosition} handleReset={this.handleResetBtn} setOffsets={this.setOffsets} setProgression={this.setProgression} fetch={this.debugFetch} xOffset={this.state.xOffset} yOffset={this.state.yOffset} rawPosition={this.state.rawPosition}></Debug>

                            <button className="whereAmI" onClick={this.fetchData}>Calculer ma position</button>

                            {/* TERRAIN */}

                            <img src={poteaux} alt="" className={"poteaux"} style={{ top: (this.convertPxToCm(-20) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(0) + this.state.relativePosX) + 'cm' }}/>
                            <img src={arbres} alt="" className={"arbres"} style={{ top: (this.convertPxToCm(-20) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(0) + this.state.relativePosX) + 'cm' }}/>

                            <div className="yoga interactive" style={{ top: (this.convertPxToCm(1100) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(2000) + this.state.relativePosX) + 'cm' }} onTouchStart={this.state.progression > 0 ? this.toggleModal : null}></div>
                            <img src={score} alt="" className="score interactive" style={{ top: (this.convertPxToCm(520) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1670) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            
                            {/* LAUM */}

                            <img src={panneauLAUM} alt="" className={"panneau"} style={{ top: (this.convertPxToCm(1280) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1510) + this.state.relativePosX) + 'cm' }}/>

                            <div onTouchStart={this.state.progression >= 2 ? this.handleBuildingsChange : null} className="lock laum-lock" style={{ top: (this.convertPxToCm(1200) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1080) + this.state.relativePosX) + 'cm' }}>

                                <Lock inInterior={false} isOpenable={this.state.progression >= 2 ? true : false} ></Lock> {/* progression 2 equals yoga is done*/}
                            </div>

                            {/* Interior locks */}
                            <div onTouchStart={this.state.progression >= 6 ? this.handleBuildingsChange : null} className="lock laum-lock interior reverb" style={{ top: (this.convertPxToCm(1080) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1100) + this.state.relativePosX) + 'cm' }}>

                                <Lock inInterior={true} isOpenable={this.state.progression >= 6 ? true : false} ></Lock> {/* progression 6 equals carnyx is obtained*/}
                            </div>
                            <div onTouchStart={this.state.progression >= 8 ? this.handleBuildingsChange : null} className="lock laum-lock interior anech" style={{ top: (this.convertPxToCm(1190) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(910) + this.state.relativePosX) + 'cm' }}>

                                <Lock inInterior={true} isOpenable={this.state.progression >= 8 ? true : false} ></Lock> {/* progression 6 equals carnyx is obtained*/}
                            </div>
                            <img src={LAUMAllOpened} alt="" className={this.state.isReverbOpened || this.state.isAnechOpened ? "LAUM opened" : "LAUM hidden"} style={{ top: (this.convertPxToCm(900) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-100) + this.state.relativePosX) + 'cm' }} />
                            <img src={this.state.laumImage} alt="" className={this.state.isLaumOpened ? this.state.isAnechOpened && this.state.isReverbOpened ? "LAUM hidden laumImage" : "LAUM opened laumImage" : "LAUM hidden laumImage"} style={{ top: (this.convertPxToCm(900) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-100) + this.state.relativePosX) + 'cm' }} />

                            <img alt="" src={LAUMFeet} className={this.state.isReverbOpened ? "salle-reverberante interactive" : "salle-reverberante interactive feet-hidden"} style={{ top: (this.convertPxToCm(1140) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1110) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <img alt="" src={carnyx} className={this.state.isAnechOpened ? "carnyx-player interactive" : "carnyx-player interactive feet-hidden"} style={{ top: (this.convertPxToCm(1140) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(890) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <img src={LAUMOpened} alt="" className={this.state.isReverbOpened || this.state.isAnechOpened ? "LAUM hidden" : "LAUM opened"} style={{ top: (this.convertPxToCm(900) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-100) + this.state.relativePosX) + 'cm' }} />
                            <img alt="" src={LAUMChercheurs} className="laum-chercheurs interactive" style={{ top: (this.convertPxToCm(1150) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1220) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <img src={LAUM} alt="" className={this.state.isLaumOpened ? "LAUM hidden exterior" : "LAUM opened exterior"} style={{ top: (this.convertPxToCm(900) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-100) + this.state.relativePosX) + 'cm' }} />

                            {/* LIUM */}

                            <div onTouchStart={this.state.progression >= 4 ? this.handleBuildingsChange : null} className="lock lium-lock" style={{ top: (this.convertPxToCm(225) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1330) + this.state.relativePosX) + 'cm' }}>

                                <Lock inInterior={false} isOpenable={this.state.progression >= 4 ? true : false} ></Lock>
                            </div>
                            <img src={this.state.isLiumOpened ? LIUMOpened : LIUM} alt="" className={this.state.isLiumOpened ? "LIUM opened" : "LIUM hidden"} style={{ top: (this.convertPxToCm(-45) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1053) + this.state.relativePosX) + 'cm' }} />

                            <img src={boutRouge} alt="" className={"bout-rouge interactive"} style={{ top: (this.convertPxToCm(290) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1030) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}/>
                            <img src={panneauLIUM} alt="" className={"panneau"} style={{ top: (this.convertPxToCm(310) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1520) + this.state.relativePosX) + 'cm' }}/>
                            <img src={LIUM} alt="" className={this.state.isLiumOpened ? "LIUM hidden exterior" : "LIUM opened exterior"} style={{ top: (this.convertPxToCm(-45) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1053) + this.state.relativePosX) + 'cm' }} />
                            <img alt="" src={desk} className={this.state.hasInstrument ? "lium-info interactive" : "lium-ferme interactive"} style={{ top: (this.convertPxToCm(140) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1400) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <img alt="" src={poster} className={"lium-poster interactive"} style={{ top: (this.convertPxToCm(60) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1460) + this.state.relativePosX) + 'cm' }} onTouchStart={this.state.hasInstrument ? this.toggleModal : null}></img>

                            {/* cadenas informaticienne */}

                            <div className="lock lium-lock interior" style={{ top: (this.convertPxToCm(160) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(1310) + this.state.relativePosX) + 'cm' }}>
                                <Lock inInterior={true} isOpenable={this.state.progression >= 2 ? true : false} ></Lock> {/* progression 2 equals yoga is done*/}
                            </div>

                            {/* TRAM */}

                            <div className="tram interactive" style={{ top: ( this.convertPxToCm(830) + this.state.relativePosY) + 'cm', left: (/*2535*1.53*/ this.convertPxToCm(740) + this.state.relativePosX) + 'cm' }} onTouchStart={() => { console.log('tram touched'); }}></div>

                            {/* PARC */}

                            <div className="joueur-de-musique interactive" style={{ top: this.convertPxToCm(190) + this.state.relativePosY + 'cm', left: (this.convertPxToCm(495) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></div>
                            <div className="note" style={{ top: (this.convertPxToCm(220) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(600) + this.state.relativePosX) + 'cm' }}></div>

                            {/* BU */}

                            <img src={panneauBU} alt="" className={"panneau bu"} style={{ top: (this.convertPxToCm(1030) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(190) + this.state.relativePosX) + 'cm' }}/>
                            <img alt="" src={personnel} className="bu-personnel interactive" style={{ top: (this.convertPxToCm(650) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(225) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <img alt="" src={livre} className="bu-livre interactive" style={{ top: (this.convertPxToCm(770) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(290) + this.state.relativePosX) + 'cm' }} onTouchStart={this.toggleModal}></img>
                            <img alt="" src={bu} className="bu" style={{ top: (this.convertPxToCm(300) + this.state.relativePosY) + 'cm', left: (this.convertPxToCm(-400) + this.state.relativePosX) + 'cm' }}></img>

                            {/* MODAL */}

                            {this.state.isModalActive ?
                                <Modal text={this.state.curModalText} modalImg={this.state.modalImg} toggleModal={this.toggleModal} isActive={this.state.isModalActive}></Modal>
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
