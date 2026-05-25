import './CardGrid.css'
import Card from './Card';
import { useState, useEffect } from 'react';
import io from "socket.io-client";


const columns = [0, 1, 2, 3, 4, 5];

export default function CardGrid({socket}) {
    const [fetchedDeck, setFetchedDeck] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState("1");


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
            console.log("Last Element: ", fetchedDeck[fetchedDeck.length - 1]);
            console.log("DECK ID", socket.id)
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

        }
    };

    const drawCard = () => {
        socket.emit("draw_card", {
            room: room,
        });
    }


    return (
        <>
            <div className="card-grid-wrapper">

                <h2>Card Grid</h2>
                <div className="card-wrapper">

                    {fetchedDeck.slice(0, 54).map((card) => (
                        <Card key={`${card["rank"]}-${card["suite"]}`} suite={card["suite"]} rank={card["rank"]} value={card["value"]} face={card["face"]} room={room} socket = {socket} />
                    ))}



                </div>
                <div className="card-grid-controls">
                    <input className="card-grid-input" id="room-code" onChange={(e) => { setRoom(e.target.value) }} type="text" placeholder="Room Code..." />

                    <button className="card-grid-button" id="join-room" onClick={joinRoom}>Join Room</button>
                    <button className="card-grid-button" id="draw-card" onClick={drawCard}>Draw Card</button>
                </div>
            </div>


        </>
    );
}