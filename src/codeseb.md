import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import whiteNoise from "./whiteNoise.mp3";

function App() {
  const [position, setPosition] = useState("undefined");
  const audio = new Audio(whiteNoise);
  return (
    <div className="App">
      <button onClick={() => getPos(setPosition, audio)}>Où suis-je?</button>
      Je suis à {position}
    </div>
  );
}
function getPos(setPosition, audio){
  audio.play();
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
          if(data.status=="success")
            setPosition(data.x+", "+data.y )
          else {
            setPosition("undefined");
            console.log("error finding position");
          }
          
          });
  //2 start sound
  audio.play();
}
export default App;

import './App.css';
import logo from './logo-spart-ac.png';
import Map from './Map.jsx';
import Motion from './Motion.jsx';
import Welcome from './Welcome.jsx';
import { Component } from "react";

class App extends Component {

render() {
  return (
    <div className="App">
      <header className="header">
        <a className="logo" href="">
        <img src={logo} alt="logo" />
        </a>
      </header>
      {}
      <Motion className="motion"></Motion>
      <Welcome></Welcome>
      <Map className="map"> </Map>
    </div>
  );
}
}

export default App;