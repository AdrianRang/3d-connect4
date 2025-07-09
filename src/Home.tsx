import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Button, ButtonBlue } from "./UiverseElements"

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './home.css'; // Path to your CSS file
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
      }, []);


    return(
        <>
        <div id="bg"></div>
        <div style={{display:'flex', flexDirection: 'column', width:'100%', justifyContent: 'center', alignItems: 'center', gap: '3vh', height: '100%'}}>
            <h1>Connect4 3D</h1>
            <Button message="Play" onClick={()=>navigate("/play")}/>
            <ButtonBlue message="How it works" onClick={() => navigate("/tutorial")}/>
        </div>
        <div id="links">
          <a href="https://github.com/AdrianRang"><img src="http://ranadr.me/logos/github-mark-white.svg" alt=""/></a>
          <a href="https://ranadr.me/"><img src="/about-me.svg" alt=""/></a>
        </div>
        </>
    )
}