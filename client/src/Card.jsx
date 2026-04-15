import './Card.css'

export default function Card({ suite, rank, value }) {

    function handleClick() {
        let cardContainer = document.getElementById(`${suite}-${rank}-container`)
        if (cardContainer) {
            cardContainer.classList.toggle('hover') 
        }
    }

    function handleTouchStart() {
        this.classList.toggle('hover')
    }

    return (
        <div key={`${suite}-${rank}`} className='card-container' id={`${suite}-${rank}-container`} onTouchStart={handleTouchStart} onClick={handleClick}>
            <div className="card">
                <img className="card-front" id={`${suite}-${rank}-front`} src={`/src/assets/cards/${rank}_of_${suite}.png`} alt={`${rank} of ${suite}`} />
                <img className="card-back" id={`${suite}-${rank}-back`} src={`/src/assets/cards/card_back.png`} alt="Card Back" />
            </div>
        </div>
    )
}