import { useState } from "react";
import { Range, Direction } from "react-range";

export function Slider({setVal, max}:{setVal: any, max: number}) {
  const [values, setValues] = useState([0])

  return (
    <Range label='' step={1} min={0} max={max} values={values} onChange={(v) => {setVal(v[0]); setValues(v)}} direction={Direction.Up}
        renderTrack={
          ({props, children, isDragged})=>(<div
          {...props}
          style={{
            ...props.style,
            height: "100%",
            width: "6px",
            backgroundColor: isDragged ? "#999" : "#ccc",
            transitionDuration: '0.2s'
          }}
        >
          {children}
        </div>)} 
        renderThumb={({props, isDragged})=>(
          <div
          {...props}
          key={props.key}
          style={{
            ...props.style,
            height: "10px",
            width: "20px",
            backgroundColor: !isDragged ? "#999" : '#60a5fa',
            borderRadius: '2px',
            transitionDuration: '0.1s'
          }}
        />
      )}/>
  )
}

function Place({state}: {state: number}) {
  let stateStyle;
  switch (state) {
    case 1:
      stateStyle = { backgroundImage: 'radial-gradient(red 40%, darkred 90%)' };
      break;
    case 2:
      stateStyle = { backgroundImage: 'radial-gradient(yellow 40%, darkgoldenrod 90%)'};
      break;
    case 3: 
      stateStyle = { backgroundColor: 'rgb(255, 200, 200)'}
      break;
    default:
      stateStyle = {};
  }

  return (
    <div className='place'>
      <div className='piece' style={stateStyle}></div>
    </div>
  )
}

export function Board({state, move}: {state: number[][], move: any}) {
  const width = state[0].length;
  const height = state.length;

  return (
    <div className='board'>
      {Array.from({ length: width }).map((_, col) => (
      <div className='column' onMouseDown={() => move(col)}>
        {Array.from({ length: height }).map((_, row) => (
        <Place state={state[row][col]}/>
        ))}
      </div>
      ))}
    </div>
  )
}
