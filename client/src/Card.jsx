import './Card.css'
import { useState, useEffect } from 'react';
import io from "socket.io-client";


const socket = io.connect("http://localhost:3000");

export default function Card({ suite, rank, value, face, room, socketID }) {

    const [roomNumber, setRoomNumber] = useState(room);
    const [cardFace, setCardFace] = useState(face);


    function handleClick() {
        let cardContainer = document.getElementById(`${suite}-${rank}-container`)
        if (cardContainer) {
            // cardContainer.classList.toggle('hover') 
            setCardFace(cardFace == "back" ? "front" : "back");
            socket.emit("request_card_flip", { room: room, suite: suite, rank: rank, value: value, face: cardFace, id: socketID });
        }
    }

    function handleTouchStart() {
        this.classList.toggle('hover')
    }

    return (
        <div key={`${suite}-${rank}`} className='card-container' id={`${suite}-${rank}-container`} onTouchStart={handleTouchStart} onClick={handleClick}>
            <div className="card">
                <img className="card-front" id={`${suite}-${rank}-front`} src={`${import.meta.env.BASE_URL}images/cards/${rank.toLowerCase()}_of_${suite.toLowerCase()}.png`} alt={`${rank} of ${suite}`} />
                <img className="card-back" id={`${suite}-${rank}-back`} src={`${import.meta.env.BASE_URL}images/cards/card_back.png`} alt="Card Back" />
            </div>
        </div>
    )
}