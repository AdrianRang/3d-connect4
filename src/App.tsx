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
  let emptyState: number[][][] = [];

  for (let z = 0; z < 7; z++) {
    const layer: number[][] = [];
    for (let y = 0; y < 6; y++) {
      const row: number[] = [];
      for (let x = 0; x < 7; x++) {
        row.push(0);
      }
      layer.push(row);
    }
    emptyState.push(layer);
  }

  console.log(emptyState)

  const [state, setState] = useState<number[][][]>(emptyState)
  const [z, setZ] = useState(0)
  const [currPlayer, setPlayer] = useState(false)

  function move(col: number) {
    if(state[z][0][col] == 1 || state[z][0][col] == 2 || checkFourInARow(state) !== undefined) return;
    
    let row = 0;
    
    for(; row < 5; row++) {
      if (state[z][row+1][col] == 1 || state[z][row+1][col] == 2) {
        break;
      }
    }
    
    setState(prevState => {
      const newState = prevState.map(rowArr => [...rowArr]);
      newState[z][row][col] = currPlayer ? 1 : 2;
      return newState;
    });
    
    setPlayer(!currPlayer)
  }

  return (
    <>
      <input type="number" min={1} max={7} step={1} value={z+1} onChange={event=>setZ(parseInt(event.target.value)-1)}/> <span>{z+1}</span>
      <Board state={state[z]} move={move}/>
      {
        checkFourInARow(state) && (
          <h2>{checkFourInARow(state)} won!</h2>
        )
      }
      <h4>Next Player:</h4>
      <div style={{width: '4vw', backgroundColor:currPlayer?'red':'yellow', aspectRatio:1, padding:20, borderRadius:'100%', display:'flex', alignItems:'center', justifyContent:'center', alignContent:'center'}}><b>{currPlayer ? 'Red' : 'Yellow'}</b></div>
    </>
  );
}


//? CHAT GPT (Edited)
function checkFourInARow(board: number[][][]) {
  const rows = 6;
  const cols = 7;
  const depth = 7;

  const directions = [
  //[y, x, z]
    [0, 1, 0],  // Right
    [1, 0, 0],  // Down
    [1, 1, 0],  // Diagonal Down-Right
    [1, -1, 0], // Diagonal Down-Left
    [0, 0, 1],  // Through
    [0, 1, 1],  // Right + Through (XY plane diagonal)
    [1, 0, 1],  // Down + Through (YZ plane diagonal)
    [-1, 0, 1], // Up + Through (YZ plane diagonal)
    [1, 1, 1],  // Diagonal Down-Right + Through (XYZ diagonal)
    [-1, 1, 1],  // Diagonal Up-Right + Through (XYZ diagonal)
    [1, -1, 1], // Diagonal Down-Left + Through (X(-Y)Z diagonal)
    [-1, -1, 1], // Diagonal Up-Left + Through (X(-Y)Z diagonal)
  ];

  for (let z = 0; z < depth; z++) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = board[z][row][col];
        if (cell !== 1 && cell !== 2) continue;
        
        for (let [dx, dy, dz] of directions) {
          let count = 1;
          for (let step = 1; step < 4; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;
            const newZ = z + dz * step
            if (
              newRow < 0 || newRow >= rows ||
              newCol < 0 || newCol >= cols ||
              newZ < 0 || newCol >= depth  ||
              board[newZ][newRow][newCol] !== cell
            ) {
              break;
            }
            count++;
          }
          if (count === 4) {
            return cell == 2 ? 'yellow' : 'red'; // Found 4 in a row
          }
        }
      }
    }
  }

  return undefined; // No 4 in a row found
}