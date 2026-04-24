import './Deck.css'
import Card from './Card';
import { useState, useEffect } from 'react';
import io from "socket.io-client";


const socket = io.connect("http://localhost:3000");

const columns = [0, 1, 2, 3, 4, 5];

export default function Deck() {
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
        });
    }, [socket]);


    if (loading) return <div>Loading deck...</div>;
    if (error) return <div>Error: {error}</div>;



    // const sendMessage = () => {
    //     socket.emit("send_message", {
    //         message: message,
    //         room: room,
    //     });
    // };

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", {room: room});
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
            <h2>Deck</h2>
            <div className="card-wrapper">
                {columns.map(column => (
                    <div key={`column-${column}`} className={`column-${column}`}>
                        {fetchedDeck.slice(column * (9), (column + 1) * (9)).map((card) => (
                            <Card key={`${card["rank"]}-${card["suite"]}`} suite={card["suite"]} rank={card["rank"]} value={card["value"]} />
                        ))}
                    </div>
                ))}
            </div>

            <input id="room-code" onChange={(e) => { setRoom(e.target.value) }} type="text" placeholder="Room Code..." />
            <button onClick={joinRoom}>Join Room</button>

            <button onClick={drawCard}>Draw Card</button>



        </>
    );
}