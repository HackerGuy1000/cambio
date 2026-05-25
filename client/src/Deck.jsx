import './Deck.css';
import Card from './Card';
import { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from "uuid";
import {getUUID} from "./Utils.js"
import io from "socket.io-client";


export default function Deck({socket}) {
    const [fetchedDeck, setFetchedDeck] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState("1");
    const [currentRoom, setCurrentRoom] = useState("1");
    const [clientUUID, setClientUUID] = useState("");


    useEffect(() => {
        function fetchDeck() {
            try {
                console.log("Requesting deck for room: ", room);
                socket.emit("request_deck", { room: room, uuid: clientUUID });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
        setClientUUID(getUUID());
    }, []);

    useEffect(() => {
        socket.on("update_deck", (data) => {
            setFetchedDeck(data.updatedDeck);
            console.log("Message received: ", data);
            console.log("UUID: ", clientUUID);
        });
        socket.on("flip_card", (data) => {
            let cardContainer = document.getElementById(`${data.suite}-${data.rank}-container`)
            if (cardContainer) {
                console.log("Flip card message received: ", data);
                cardContainer.classList.toggle('hover');
            }
        });

    }, [socket]);


    if (loading) return <div>Loading deck...</div>;
    if (error) return <div>Error: {error}</div>;

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", { room: room, uuid : clientUUID });
            socket.emit("request_deck", { room: room, uuid: clientUUID });
            setCurrentRoom(room);
        }
    };

    const drawCard = () => {socket.emit("draw_card", {room: room, uuid: clientUUID});}

    return (
        <>
            <div className="deck-page">
                <h2>Deck</h2>
                <h3>Room: {currentRoom}</h3>
                <h3>UUID: {clientUUID}</h3>

                <div className="deck-wrapper">
                    {fetchedDeck.slice(fetchedDeck.length - 1, fetchedDeck.length + 1).map((card) => (
                        <Card key={`${card["rank"]}-${card["suite"]}`} suite={card["suite"]} rank={card["rank"]} value={card["value"]} face={card["face"]} room={room} socket = {socket}/>
                    ))}
                    <p>{fetchedDeck.length} Cards Remain</p>
                </div>
                <div className="deck-controls">
                    <input className="deck-input" id="room-code" onChange={(e) => { setRoom(e.target.value) }} type="text" placeholder="Room Code..." />

                    <button className="deck-button" id="join-room" onClick={joinRoom}>Join Room</button>
                    <button className="deck-button" id="draw-card" onClick={drawCard}>Draw Card</button>
                </div>
            </div>
        </>
    )
}