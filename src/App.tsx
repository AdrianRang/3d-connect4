import React, { useState } from 'react';
import './App.css';
import { Button, ButtonBlue } from './UiverseElements';
import {Slider, Board} from './Elements';
import { useNavigate } from 'react-router-dom';
import sleep from 'sleep-promise';

function formatCol(col: number[]) {
  return '#' + col.map(x => x.toString(16).padStart(2, '0')).join('');
}

function yState(state: number[][][]) {
  const depth = state.length;
  const height = state[0].length;
  const width = state[0][0].length;

  let newState: number[][][] = []

  for (let z = 0; z < depth; z++) {
    const layer: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        row.push(0);
      }
      layer.push(row);
    }
    newState.push(layer);
  }

  for(let z = 0; z < depth; z++) {
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        newState[x][y][z] = state[z][y][x]
      }
    }
  }

  return newState;
}

function zState(state: number[][][]) {
  const depth = state.length;
  const height = state[0].length;
  const width = state[0][0].length;

  let newState: number[][][] = []

  for (let z = 0; z < 6; z++) {
    const layer: number[][] = [];
    for (let y = 0; y < 7; y++) {
      const row: number[] = [];
      for (let x = 0; x < 7; x++) {
        row.push(0);
      }
      layer.push(row);
    }
    newState.push(layer);
  }

  for(let z = 0; z < depth; z++) {
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        newState[y][depth-z-1][x] = state[z][height-y-1][x]
      }
    }
  }

  return newState;
}

//? CHAT GPT (Edited)
function checkFourInARow(board: number[][][]) {
  const rows = 6;
  const cols = 7;
  const depth = board.length;

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
    [0, -1, 1], // Up + Through (YZ plane diagonal)
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
              newZ < 0 || newZ >= depth  ||
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

  const [state, setState] = useState<number[][][]>(emptyState)
  const [z, setZ] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [currPlayer, setPlayer] = useState(false)
  const [cols, setCols] = useState([[255, 255, 0], [184, 134, 11]])
  
  const navigate = useNavigate();

  const yellows = [[255, 255, 0], [184, 134, 11]];
  const reds = [[255, 0 , 0], [139, 0, 0]];
  const animDuration = 200; // ms
  let animStartTime = 0;

  function move(x: number, y: number, z: number) {
    if(state[z][y][x] == 1 || state[z][y][x] == 2 || checkFourInARow(state) !== undefined) return;
    
    let row = 0;
    
    for(; row < 5; row++) {
      if (state[z][row+1][x] == 1 || state[z][row+1][x] == 2) {
        break;
      }
    }
    
    setState(prevState => {
      const newState = prevState.map(rowArr => [...rowArr]);
      newState[z][row][x] = currPlayer ? 1 : 2;
      return newState;
    });

    const prevPlayer = currPlayer; // Capture current player before updating
    setPlayer(!currPlayer)
    // setCols(currPlayer ? yellows : reds)
    animStartTime = new Date().getTime();
    animate(!prevPlayer); // Pass the NEXT player to animate (opposite of prevPlayer)
  }
  function animate(player: boolean) {
    function step() {
      const now = new Date().getTime();
      const prog = Math.min((now - animStartTime) / animDuration, 1);
      
      // Get current colors and target colors
      const currentColors = cols;
      const targetColors = player ? reds : yellows;
      
      // Interpolate between current and target colors
      const r = (targetColors[0][0] - currentColors[0][0]) * prog + currentColors[0][0];
      const g = (targetColors[0][1] - currentColors[0][1]) * prog + currentColors[0][1];
      const b = (targetColors[0][2] - currentColors[0][2]) * prog + currentColors[0][2];

      const r1 = (targetColors[1][0] - currentColors[1][0]) * prog + currentColors[1][0];
      const g1 = (targetColors[1][1] - currentColors[1][1]) * prog + currentColors[1][1];
      const b1 = (targetColors[1][2] - currentColors[1][2]) * prog + currentColors[1][2];
      
      setCols([[Math.floor(r), Math.floor(g),Math.floor(b)], [Math.floor(r1), Math.floor(g1),Math.floor(b1)]]);

      if (prog < 1) {
        requestAnimationFrame(step);
      } else { 
        setCols(targetColors)
      }
    }
    requestAnimationFrame(step);
  }

  return (
    <>
    <div style={{backgroundImage: 'radial-gradient(' + formatCol(cols[0]) + ',' + formatCol(cols[1]) + ')', position: 'fixed', zIndex: '-1', backgroundSize: 'cover', inset: 0, transitionDuration: '0.2s'}} />
    {
      checkFourInARow(state) && (
        <div style={{position: 'fixed', width: '100%', height:'100%', zIndex:'2', backgroundColor:'rgba(0.5,0.5,0.5,0.5)', inset:0, display:'flex', justifyContent:'center',alignItems:'center', pointerEvents:'none', flexDirection:'column'}}>
          <h2 style={{color:'white'}}>{checkFourInARow(state)} won!</h2>
          <Button message='Play Again!' onClick={()=>{window.location.reload()}}/>
        </div>
      )
    }
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap:'10px', justifyContent: 'space-evenly'}}>
    <div>
      <span>Front to Back</span>
      <div style={{display: 'flex', flexDirection: 'row-reverse', height:'95%'}}>
        <Slider setVal={setZ} max={6}/>
        <Board state={state[z]} move={(col: number)=>move(col, 0, z)}/>
      </div>
    </div>
    <div>
      <span>Side to side</span>
      <div style={{display: 'flex', flexDirection: 'row-reverse', height:'95%'}}>
        <Slider setVal={setX} max={6}/>
        <Board state={yState(state)[x]} move={(col: number)=>move(x, 0, col)}/>
      </div>
    </div>
    <div>
      <span>Top to Bottom</span>
      <div style={{display: 'flex', flexDirection: 'row-reverse', height:'96%'}}>
        <Slider setVal={setY} max={5}/>
        <Board state={zState(state)[y]} move={()=>{}}/>
      </div>
    </div>
    </div>
    <center>
      <div style={{height:'20px'}}/>
    <ButtonBlue message="How it works" onClick={() => navigate("/tutorial")}/>
    </center>
    </>
  );
}