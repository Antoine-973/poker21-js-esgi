import {actualiseWallet, playerWallet} from '../stats/playerWallet.js'
import {enterCasino, announcementMessage, leaveCasino} from "../../main.js";

let deckID = "";
let remainingCards = 0;
let dealerCards = [];
let playerCards = [];
let roundLost = 0;
let roundWon = 0;
let roundDraw = 0;
let playerScore = 0;
let dealerScore = 0;

let roundBet = 0;

// display of the score of the game
let dealerScoreDisplay = document.getElementById("dealer-score");
let playerScoreDisplay = document.getElementById("player-score");

// card area display
let dealerCardsDisplay = document.getElementById("dealer-cards");
let playerCardsDisplay = document.getElementById("player-cards");

let surrenderButtonDisplay = document.getElementById("surrender-button")
let hitButtonDisplay = document.getElementById("hit-button");
let standButtonDisplay = document.getElementById("stand-button");

let restartButtonDisplay = document.getElementById("restart-button");
let endButtonDisplay = document.getElementById("end-button");

// On click events
surrenderButtonDisplay.onclick = surrender;
hitButtonDisplay.onclick = () => hitMe('player');
standButtonDisplay.onclick= ()=>setTimeout(()=>dealerPlays(), 600);
restartButtonDisplay.onclick = replay;
endButtonDisplay.onclick = leaveCasino;

export function initBlackJackBet(statusMessage) {
    if (playerWallet.getActualValue === 0){
        resetPlayingArea();
        document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
        leaveCasino();
    }
    else {
        restartButtonDisplay.classList.add("hidden");
        endButtonDisplay.classList.add("hidden");
        document.getElementById("description-img").src = "src/dealer.png";
        announcementMessage.textContent = `${statusMessage}`;
        document.getElementsByClassName("player-bet-form")[0].classList.remove("hidden");
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", startBlackJack);
    }
}

function startBlackJack() {
    roundBet = parseInt(document.querySelector('input[id="player-bet"]').value);
    if (roundBet <= playerWallet.getActualValue && roundBet >= 2 && roundBet <= 100) {
        actualiseWallet('-', roundBet)
        document.getElementsByClassName("player-bet-form")[0].classList.add("hidden");
        announcementMessage.textContent = 'La partie commence';
        document.getElementsByClassName('game-buttons')[0].style.display = "flex";
        document.getElementsByClassName("blackjack-table")[0].classList.remove("hidden");
        newDeck();
    } else {
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", initBlackJackBet('Le montant de votre paris doit être entre 2 et 100 et ne peut pas depasser la valeur de votre porte monnaie.'));
    }
}

function surrender() {
    document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
    actualiseWallet('+', roundBet / 2);
    if (playerWallet.getActualValue >= 2) {
        initBlackJackBet('Vous abandonnez, d\'accord voici la moitié de votre mise initiale. On remet ça ?');
    } else {
        roundEnd();
    }
}

function roundEnd(statusMessage){
    document.getElementsByClassName('game-buttons')[0].style.display = "none";
    announcementMessage.textContent = "Vous avez perdu et vous n'avez plus assez d'argent pour continuer à jouer dans le casino !";
    endButtonDisplay.classList.remove("hidden");

    if (playerWallet.getActualValue >= 2){
        announcementMessage.textContent = statusMessage;
        restartButtonDisplay.classList.remove("hidden");
        document.querySelector("#count-draw").innerHTML = `${roundDraw}`;
        document.querySelector("#count-lose").innerHTML = `${roundLost}`;
        document.querySelector("#count-victory").innerHTML = `${roundWon}`;
    }
}

function replay(){
    resetPlayingArea();
    document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
    initBlackJackBet("Début de la partie, veuillez donner la valeur de votre mise :")
}

async function newDeck() {
    resetPlayingArea();
    const abortController = new AbortController();
    await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(new Error("Il y a eu une erreur."));
        }).then(function (data) {
            deckID = data.deck_id;
            remainingCards = data.remaining;
        }).catch(function (error) {
            console.log(error.message);
        });

    setTimeout(function () {
        abortController.abort();
    }, 5000);

    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`)
        .then(res => res.json())
        .then(res => {
            hitButtonDisplay.style.display = "block";
            standButtonDisplay.style.display = "block";
            surrenderButtonDisplay.style.display = "block";

            dealerCards.push(res.cards[0], res.cards[1])
            playerCards.push(res.cards[2], res.cards[3])

            dealerCards.forEach((card, i) => {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:100px");
                if(i===0) {
                    cardDomElement.src = 'src/backcard.svg';
                    cardDomElement.setAttribute("style", "max-width:100px");
                } else {
                    cardDomElement.src = card.image;
                }
                dealerCardsDisplay.appendChild(cardDomElement)
            })

            dealerScore = computeScore(dealerCards);

            playerCards.forEach(card => {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:100px");
                cardDomElement.src = card.image;
                playerCardsDisplay.appendChild(cardDomElement)
            })

            playerScore = computeScore(playerCards);
            if (playerScore === 21) {
                roundWon += 1;
                actualiseWallet('+', roundBet * 2);
                roundEnd("Vous avez gagné ! Voulez vous rejouer ?");
            }
            playerScoreDisplay.textContent = `Votre main : ${playerScore}`;

        })
        .catch(console.error)
}

function hitMe(target) {
    document.getElementById("surrender-button").style.display = "none";
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        .then(res => res.json())
        .then(res => {

            if (target === 'player') {
                hitButtonDisplay.style.display = "block";
                standButtonDisplay.style.display = "block";

                playerCards.push(res.cards[0])
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:100px");
                cardDomElement.src = res.cards[0].image;
                playerCardsDisplay.appendChild(cardDomElement)

                playerScore = computeScore(playerCards);

                playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
                if (playerScore > 21) {
                    roundLost = true;
                    roundLost += 1;
                    roundEnd("Vous avez perdu ! Voulez vous rejouer ?");
                }
                else if (playerScore === 21) {
                    playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
                    roundWon += 1;
                    actualiseWallet('+', roundBet * 2);
                    roundEnd("Vous avez gagné ! Voulez vous rejouer ?");
                }
            }

            if (target === 'dealer') {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:100px");
                dealerCards.push(res.cards[0])
                cardDomElement.src = res.cards[0].image;
                dealerCardsDisplay.appendChild(cardDomElement)
                dealerPlays();
            }

        })
        .catch(console.error)
}

function dealerPlays() {
    dealerScore = computeScore(dealerCards);
    dealerScoreDisplay.textContent = `Main du dealer : ${dealerScore}`;
    dealerCardsDisplay.firstChild.src = dealerCards[0].image;
    if (dealerScore < 17) {
        setTimeout(()=>hitMe('dealer'), 900)
    }
    else if (dealerScore > 21) {
        roundWon += 1;
        actualiseWallet('+', roundBet * 2);
        roundEnd("Vous avez gagné ! Voulez vous rejouer ?");
    }
    else if (dealerScore > playerScore) {
        roundLost += 1;
        roundEnd("Vous avez perdu ! Voulez vous rejouer ?");
    }
    else if (dealerScore === playerScore) {
        roundDraw += 1;
        actualiseWallet('+', roundBet);
        roundEnd("Egalité ! Voulez vous rejouer ?");
    }
    else {
        roundWon += 1;
        actualiseWallet('+', roundBet * 2);
        roundEnd("Vous avez gagné ! Voulez vous rejouer ?");
    }
}

function computeScore(cards) {
    let hasAce = false;
    let score = cards.reduce((acc, card) => {
        if (card.value === "ACE") {
            hasAce = true;
            return acc + 1;
        }
        if (isNaN(card.value)) {
            return acc + 10
        }
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
    dealerScore = "?";
    playerScore = 0;
    dealerScoreDisplay.textContent = `Main du dealer : ${dealerScore}`;
    playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
    while (dealerCardsDisplay.firstChild) {
        dealerCardsDisplay.removeChild(dealerCardsDisplay.firstChild);
    }
    while (playerCardsDisplay.firstChild) {
        playerCardsDisplay.removeChild(playerCardsDisplay.firstChild);
    }
}