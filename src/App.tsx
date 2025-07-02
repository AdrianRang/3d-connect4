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

  const [currPlayer, setPlayer] = useState(false)

  function move(col: number) {
    if(state[0][col] == 1 || state[0][col] == 2 || checkFourInARow(state) !== undefined) return;
    
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
    // let count = 0;
    // let curr=0;
    // for(let r = 0; r < 6; r++) {
    //   for(let c = 0; c < 7; c++) {
    //     if(count == 3) {setWinner(curr==1?'red h':'yellow h'); return;}

    //     if(state[r][c] == curr && state[r][c] !== 0) count++;
    //     else if(count == 0) count = 0;
    //     else {
    //       curr = state[r][c];
    //       count = 0;
    //     }
    //   }
    // }

    // // Vertical
    // count=0;
    // curr=0;
    // for(let c = 0; c < 7; c++) {
    //   for(let r = 0; r < 6; r++) {
    //     if(count == 3) {setWinner(curr==1?'red v':'yellow v'); return;}

    //     if(state[r][c] == curr && state[r][c] !== 0) count++;
    //     else {
    //       curr = state[r][c];
    //       count = 0;
    //     }
    //   }
    // }

    // // Diagonal (/)
    // count=0
    // curr=0

    // const diags = [
    //   [3, 0],
    //   [4, 0],
    //   [5, 0],
    //   [5, 1],
    //   [5, 2],
    //   [5, 3]
    // ]

    // for(let i = 0; i < diags.length; i++) {
    //   let diag = diags[i];
    //   while(diag[0] < 6 && diag[1] >= 0) {
    //     console.log(state[5])
        
    //     if(state[diag[0]][diag[1]] == curr && curr !== 0) count++;
    //     else {
    //       curr = state[diag[0]][diag[1]];
    //       count = 0;
    //     }
        
    //     if(count == 3) {setWinner((curr==1?'red diag':'yellow diag')+i); return;}

    //     diag[0] = diag[0]+1;
    //     diag[1] = diag[1]-1;
    //   }
    //   count = 0
    // }

    // // Diagonal (\)
    // count=0
    // curr=0
  }

  return (
    <>
      <Board state={state} move={move}/>
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
function checkFourInARow(board: number[][]) {
  const rows = 6;
  const cols = 7;

  const directions = [
    [0, 1],  // Right
    [1, 0],  // Down
    [1, 1],  // Diagonal Down-Right
    [1, -1], // Diagonal Down-Left
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = board[row][col];
      if (cell !== 1 && cell !== 2) continue;

      for (let [dx, dy] of directions) {
        let count = 1;
        for (let step = 1; step < 4; step++) {
          const newRow = row + dx * step;
          const newCol = col + dy * step;
          if (
            newRow < 0 || newRow >= rows ||
            newCol < 0 || newCol >= cols ||
            board[newRow][newCol] !== cell
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

  return undefined; // No 4 in a row found
}