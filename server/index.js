const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

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

const shuffledDeck = arrayDeck.sort(() => Math.random() - 0.5);

app.use(cors({
    origin: ["http://localhost:5173"]
}));


app.get("/", (req, res) => {
    res.send("Joined Node Server");
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
    console.log(request.body)
    return response.send(200)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})