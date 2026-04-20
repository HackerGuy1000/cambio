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
    const [room, setRoom] = useState("");


    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/deck");
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const data = await response.json();
                setFetchedDeck(data);
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
            socket.emit("join_room", room);
        }
        console.log(io.of("/").adapter.rooms);
    };

    const drawCard = () => {
        socket.emit("draw_card", {
            room: room,
        });
    }


    return (
        <>
            <h2>Deck</h2>
            {/* <input onChange={(e) => { setRoom(e.target.value) }} type="text" placeholder="Room Code..." />
            <button onClick={joinRoom}>Join Room</button>

            <input onChange={(e) => { setMessage(e.target.value) }} type="text" placeholder="Message..." />
            <button onClick={sendMessage}>Send Message</button>

            <h1>{serverMessage ? serverMessage.message : null}</h1> */}

            <div className="card-wrapper">
                {columns.map(column => (
                    <div key={`column-${column}`} className={`column-${column}`}>
                        {fetchedDeck.slice(column * (9), (column + 1) * (9)).map((card) => (
                            <Card key={`${card["rank"]}-${card["suite"]}`} suite={card["suite"]} rank={card["rank"]} value={card["value"]} />
                        ))}
                    </div>
                ))}
            </div>

            <input onChange={(e) => { setRoom(e.target.value) }} type="text" placeholder="Room Code..." />
            <button onClick={joinRoom}>Join Room</button>

            <button onClick={drawCard}>Draw Card</button>



        </>
    );
}