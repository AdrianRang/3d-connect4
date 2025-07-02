import React, { useState } from 'react';
import './App.css';

function Place({state}: {state: number}) {
  let stateStyle;
  switch (state) {
    case 1:
      stateStyle = { backgroundColor: 'red' };
      break;
    case 2:
      stateStyle = { backgroundColor: 'yellow' };
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

function Board({state, move}: {state: number[][], move: any}) {
  const width = 7;
  const height = 6;

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

export default function App() {
  const [state, setState] = useState<number[][]>(
    [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
  )
  const [winner, setWinner] = useState<string | undefined>(undefined)

  const [currPlayer, setPlayer] = useState(false)

  function move(col: number) {
    if(state[0][col] == 1 || state[0][col] == 2 || winner !== undefined) return;
    
    let row = 0;
    
    for(; row < 5; row++) {
      if (state[row+1][col] == 1 || state[row+1][col] == 2) {
        break;
      }
    }
    
    setState(prevState => {
      const newState = prevState.map(rowArr => [...rowArr]);
      newState[row][col] = currPlayer ? 1 : 2;
      return newState;
    });
    
    setPlayer(!currPlayer)

    // Check if won
    // Horizontal
    let count = 0;
    let curr=0;
    for(let r = 0; r < 6; r++) {
      for(let c = 0; c < 7; c++) {
        if(count == 3) {setWinner(curr==1?'red':'yellow'); return;}

        if(state[r][c] == curr && state[r][c] !== 0) count++;
        else {
          curr = state[r][c];
          count = 0;
        }
      }
    }

    // Vertical
    count = 0;
    curr=0;
    for(let c = 0; c < 7; c++) {
      for(let r = 0; r < 6; r++) {
        if(count == 3) {setWinner(curr==1?'red':'yellow'); break;}

        if(state[r][c] == curr && state[r][c] !== 0) count++;
        else {
          curr = state[r][c];
          count = 0;
        }
      }
    }
  }

  return (
    <>
      <Board state={state} move={move}/>
      {
        winner && (
          <h2>{winner} won!</h2>
        )
      }
      <h4>Next Player:</h4>
      <div style={{width: '4vw', backgroundColor:currPlayer?'red':'yellow', aspectRatio:1, padding:20, borderRadius:'100%', display:'flex', alignItems:'center', justifyContent:'center', alignContent:'center'}}><b>{currPlayer ? 'Red' : 'Yellow'}</b></div>
    </>
  );
}
