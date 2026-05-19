import './Deck.css';
import Card from './Card';
import { useState, useEffect } from 'react';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

export default function Deck() {
    const [fetchedDeck, setFetchedDeck] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState("1");
    const [currentRoom, setCurrentRoom] = useState("1");

    useEffect(() => {
        function fetchDeck() {
            try {
                console.log("Requesting deck for room: ", room);
                socket.emit("request_deck", { room: room });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, []);

    useEffect(() => {
        socket.on("update_deck", (data) => {
            setFetchedDeck(data.updatedDeck);
            console.log("Message received: ", data);
            console.log("DECK ID: ", socket.id)
            console.log("Cookie: ",document.cookie)
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
            socket.emit("join_room", { room: room });
            socket.emit("request_deck", { room: room });
            setCurrentRoom(room);
        }
    };

    const drawCard = () => {
        socket.emit("draw_card", {
            room: room,
        });
    }

    return (
        <>
            <div className="deck-page">
                <h2>Deck</h2>
                <h3>Room: {currentRoom}</h3>

                <div className="deck-wrapper">
                    {fetchedDeck.slice(fetchedDeck.length - 1, fetchedDeck.length + 1).map((card) => (
                        <Card key={`${card["rank"]}-${card["suite"]}`} suite={card["suite"]} rank={card["rank"]} value={card["value"]} face={card["face"]} room={room} socketID={socket.id} />
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