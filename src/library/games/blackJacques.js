import {actualiseWallet, playerWallet} from '../stats/playerWallet.js'
import {enterCasino, announcementMessage} from "../../main.js";

let deckID = "";
let remainingCards = 0;
let dealerCards = [];
let playerCards = [];
let roundLost = false;
let roundWon = false;
let roundDraw = false;
let playerScore = 0;
let dealerScore = 0;

let roundBet = "";

// display of the score of the game
let dealerScoreDisplay = document.getElementById("dealer-score");
let playerScoreDisplay = document.getElementById("player-score");

// card area display
let dealerCardsDisplay = document.getElementById("dealer-cards");
let playerCardsDisplay = document.getElementById("player-cards");

let surrenderButtonDisplay = document.getElementById("surrender-button")
let startButtonDisplay = document.getElementById("start-button")
let hitButtonDisplay = document.getElementById("hit-button");
let standButtonDisplay = document.getElementById("stand-button");
let doubleButtonDisplay = document.getElementById("double-button");
let splitButtonDisplay = document.getElementById("split-button");
let insuranceButtonDisplay = document.getElementById("insurance-button");

// On click events
surrenderButtonDisplay.onclick = surrender;
startButtonDisplay.onclick = newDeck;
startButtonDisplay.onclick = newDeck;
hitButtonDisplay.onclick = ()=>hitMe('player');
standButtonDisplay.onclick = ()=>setTimeout(()=>dealerPlays(), 600);

export function initBlackJacquesBet(statusMessage){
    document.getElementsByClassName("games-selection")[0].classList.add("hidden");
    document.getElementById("description-img").src="dealer.png";
    announcementMessage.textContent = `${statusMessage}`;
    document.getElementsByClassName("player-bet-form")[0].classList.remove("hidden");
    document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", startBlackJacques);
}

function startBlackJacques(){
    roundBet = parseInt(document.querySelector('input[id="player-bet"]').value);
    if (roundBet <= playerWallet.getActualValue && roundBet >= 2 && roundBet <= 100){
        actualiseWallet('-', roundBet)
        document.getElementsByClassName("player-bet-form")[0].classList.add("hidden");
        announcementMessage.textContent = 'La partie commence';
        document.getElementsByClassName("blackjack-table")[0].classList.remove("hidden");
        newDeck();
        document.getElementById("hit-button").classList.remove("hidden");
    }
    else{
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", initBlackJacquesBet('Le montant de votre paris doit être entre 2 et 100 et ne peut pas depasser la valeur de votre porte monnaie.'));
    }
}

function surrender(){
    document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
    actualiseWallet('+', roundBet / 2);
    if (playerWallet.getActualValue >= 2){
        initBlackJacquesBet('Vous abandonnez, d\'accord voici la moitié de votre mise initiale. On remet ça ?');
    }
    else {
        enterCasino();
    }
}

async function newDeck(){
    resetPlayingArea();
    const abortController = new AbortController();
    await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(new Error("Something went wrong"));
    }).then(function (data){
        deckID = data.deck_id;
        remainingCards = data.remaining;
    }).catch(function (error) {
        console.log(error.message);
    });

    setTimeout(function () {
        abortController.abort();
    }, 5000);

    document.getElementById("start-button").classList.add("hidden");
    document.getElementById("hit-button").classList.remove("hidden");
    document.getElementById("surrender-button").classList.remove("hidden");
    newHand();
}

function test(){
    console.log(deckID);
}

function newHand() {
    resetPlayingArea();
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`)
        .then(res => res.json())
        .then(res => {
            hitButtonDisplay.style.display = "block";
            standButtonDisplay.style.display = "block";

            dealerCards.push(res.cards[0])
            playerCards.push(res.cards[1], res.cards[2])

            dealerScore = "Main du dealer : ?";
            dealerScoreDisplay.textContent = dealerScore;

            dealerCards.forEach((card, i) => {
                let cardDomElement = document.createElement("img");
                cardDomElement.src = card.image;
                dealerCardsDisplay.appendChild(cardDomElement)
            })

            playerCards.forEach(card => {
                let cardDomElement = document.createElement("img");
                cardDomElement.src = card.image;
                playerCardsDisplay.appendChild(cardDomElement)
            })

            playerScore = computeScore(playerCards);
            if (playerScore === 21) {
                roundWon = true;
                announcementMessage.textContent = "BlackJack! You Win!";
            }
            playerScoreDisplay.textContent = `Votre main : ${playerScore}`;

        })
        .catch(console.error)
}

function computeScore(cards) {
    let hasAce = false;
    let score = cards.reduce((acc, card) => {
        if (card.value === "ACE") {
            hasAce = true;
            return acc + 1;
        }
        if (isNaN(card.value)) { return acc + 10 }
        return acc + Number(card.value);
    }, 0)
    if (hasAce) {
        score = (score + 10) > 21 ? score : score + 10;
    }
    return score;
}

function resetPlayingArea() {
    dealerCards = [];
    playerCards = [];
    roundLost = false;
    roundWon = false;
    roundDraw = false;
    dealerScore = 0;
    playerScore = 0;
    dealerScoreDisplay.textContent = `Main du dealer : ${dealerScore}`;
    playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
    announcementMessage.textContent = "";
    while (dealerCardsDisplay.firstChild) {
        dealerCardsDisplay.removeChild(dealerCardsDisplay.firstChild);
    }
    while (playerCardsDisplay.firstChild) {
        playerCardsDisplay.removeChild(playerCardsDisplay.firstChild);
    }
}