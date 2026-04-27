const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { json } = require("stream/consumers");

app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:4173"],
        methods: ["GET", "POST"]
    }
})

const PORT = 3000;

const suites = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

const values = {
    "Joker": 0,
    "Ace": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "Jack": 11,
    "Queen": 12,
}

const decks = new Map()

function getDeck(room) {
    if (decks.has(room)) {
        return decks.get(room);
    }
    else {
        decks.set(room, createDeck());
    }

    // console.log("Returning deck for room: ", room, decks.get(room));
    return decks.get(room);
}

function setDeck(room, deck) {
    decks.set(room, deck);
}


function createDeck() {
    let arrayDeck = suites.flatMap(suite => ranks.map(rank => ({ rank, suite, value: rank != "King" ? values[rank] : suite == "Hearts" || suite == "Diamonds" ? -1 : 13, face: "back" })));
    arrayDeck.push({ rank: "Joker", suite: "Black", value: 0, face: "back" });
    arrayDeck.push({ rank: "Joker", suite: "Red", value: 0, face: "back" });
    shuffleDeck(arrayDeck);
    return arrayDeck;
}

function shuffleDeck(deck) {
    var currentIndex = deck.length, temporaryValue, randomIndex;

    while (currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex--);
        temporaryValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = temporaryValue;
    }
    return deck
}


function sendDataToClients(socket, room, event, data) {
    socket.to(room).emit(event, data);
    socket.emit(event, data);
}

// const shuffledDeck = shuffleDeck(arrayDeck);

function drawCard(room) {
    deck = getDeck(room);
    if (deck.length === 0) {
        console.log("Deck is empty for room: ", room);
        decks.set(room, createDeck());
        deck = getDeck(room);
    }
    card = deck.pop();
    return card;
}

app.use(cors());


app.get("/", (req, res) => {
    res.send("Joined Node Server");
});

io.on("connection", (socket) => {
    socket.on("draw_card", (data) => {
        card = drawCard(data.room);
        sendDataToClients(socket, data.room, "update_deck", { updatedDeck: getDeck(data.room) });
        console.log("Room", data.room, "drew a card: ", card);
    });

    socket.on("join_room", (data) => {
        console.log("Client joined room: ", data.room);
        socket.join(data.room)
        const deck = getDeck(data.room);
        sendDataToClients(socket, data.room, "update_deck", { updatedDeck: deck });
    });

    socket.on("request_deck", (data) => {
        console.log("Received request_deck for room: ", data.room);
        const deck = getDeck(data.room);
        sendDataToClients(socket, data.room, "update_deck", { updatedDeck: deck });
    });

    socket.on("request_card_flip", (data) => {
        console.log("Card clicked in room: ", data.room, "by socket id: ", data.id, "Card: ", data);
        io.to(data.id).emit("flip_card", { suite: data.suite, rank: data.rank});
        const deck = getDeck(data.room);
        const cardIndex = deck.findIndex(card => card.suite === data.suite && card.rank === data.rank);
    });
});

app.get('/status', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});


app.get("/api/deck", (req, res) => {
    res.json(shuffledDeck);
});

app.post("/api/draw", (request, response) => {
    const card = drawCard();
    return response.json(card)
})

app.post("/api/shuffle", (request, response) => {
    conseole.log("Shuffling the deck...");
    const newDeck = shuffleDeck(shuffleDeck);
    return response.json(newDeck);
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})