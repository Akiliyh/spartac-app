import { useRive } from '@rive-app/react-canvas';
import React, { useState } from 'react';
import LockRive from './Rive/lock2.riv';
import LockSVG from './img/lock.svg';
import riveWasmUrl from '@rive-app/canvas/rive.wasm';
import { RuntimeLoader } from 'rive-react';

RuntimeLoader.setWasmUrl(riveWasmUrl);

export default function Simple(props) {
    const [unlocked, setUnlocked] = useState(false);
    const [locked, setLocked] = useState(false);
    const [gone, setGone] = useState(false);

  // event handler for when the element is clicked
  const unlock = () => {
    setUnlocked(true);
    setLocked(false);
        rive && rive.play();
        setTimeout(() => {
            setGone(true);
        }, 2000);
  }

  var className = unlocked ? 'lock unlocked' : 'lock';
  className = locked ? className + ' locked' : className;
  className = gone ? className + ' gone' : className;

  if (props.inInterior) {
      className = className + ' interior'
  }

  const unopenable = () => {
      if (locked) {
        setLocked(false);
      }
      setTimeout(() => {
        setLocked(true);
      }, 100);

}


    const { rive, RiveComponent } = useRive({
        src: LockRive,
        autoplay: false,
    });

    if (props.isOpenable === false) {
        return (
            <div className={className}>
                <img className="lock-svg" src={LockSVG} alt="" onClick={unopenable}/>
            {/* <RiveComponent onTouchStart={unopenable}
                      /> */}
            </div>
        );
    } else {
        return (
            <div className={className}>
                <img className="lock-svg" src={LockSVG} alt="" onClick={unlock}/>
            {/* <RiveComponent
            onTouchStart={unlock}
            /> */}
            </div>
        );
    }
}