import './Deck.css'
import Card from './Card';

const columns = [0, 1, 2, 3, 4, 5];


export default function Deck(fetchedDeck) {
    return (
        <>
            <h2>Deck</h2>
            <div className="card-wrapper">
                {columns.map(column => (
                    <div key={`column-${column}`} className={`column-${column}`}>
                        {fetchedDeck["fetchedDeck"].slice(column * (9), (column + 1) * (9)).map((card) => (
                            <Card key={`${card["rank"]}-${card["suite"]}`} suite={card["suite"]} rank={card["rank"]} value={card["value"]} />
                        ))}
                    </div>
                ))}
            </div>
            

        </>
    );
}