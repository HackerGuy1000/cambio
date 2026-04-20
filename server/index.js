const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
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

const arrayDeck = suites.flatMap(suite => ranks.map(rank => ({ rank, suite, value: rank != "King" ? values[rank] : suite == "Hearts" || suite == "Diamonds" ? -1 : 13 })));
arrayDeck.push({ rank: "Joker", suite: "Black", value: 0 });
arrayDeck.push({ rank: "Joker", suite: "Red", value: 0 });

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

const shuffledDeck = shuffleDeck(arrayDeck);

function drawCard() {
    card = shuffledDeck.pop();
    return card;
}

app.use(cors());


app.get("/", (req, res) => {
    res.send("Joined Node Server");
});

io.on("connection", (socket) => {
    socket.on("draw_card", (data) => {
        card = drawCard();
        socket.emit("update_deck", {
            card: card,
            updatedDeck: shuffledDeck
        });
        console.log("Room", data.room, "drew a card: ", card);
    });

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log("ROOMS", socket.rooms);
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