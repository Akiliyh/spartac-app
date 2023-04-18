import './App.css';
import logo from './img/logo-spart-ac.png';
import Map from './Map.jsx';
import Motion from './Motion.jsx';
import Welcome from './Welcome.jsx';
import { Component } from "react";

class App extends Component {

render() {
  return (
    <div className="App">
      <header className="header">
        <div className="logo">
        <img src={logo} alt="logo" />
        </div>
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
