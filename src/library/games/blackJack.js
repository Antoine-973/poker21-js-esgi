import {actualiseWallet, playerWallet} from '../stats/playerWallet.js'
import {announcementMessage, leaveCasino} from "../../main.js";

window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);
    window.addEventListener("online", () => {
        // Set hasNetwork to online when they change to online.
        hasNetwork(true);
    });
    window.addEventListener("offline", () => {
        // Set hasNetwork to offline when they change to offline.
        hasNetwork(false);
    });
});

let deckID = "";
let remainingCards = 0;
let dealerCards = [];
let playerCards = [];
let roundLost = 0;
let roundWon = 0;
let roundDraw = 0;
let playerScore = 0;
let dealerScore = 0;
let gameStarted = 0;
let roundBet = 0;
let turn = 1;

// display of the score of the game
let deckCardCountDisplay = document.getElementById("card-count");
let dealerScoreDisplay = document.getElementById("dealer-score");
let playerScoreDisplay = document.getElementById("player-score");

// card area display
let dealerCardsDisplay = document.getElementById("dealer-cards");
let playerCardsDisplay = document.getElementById("player-cards");

let surrenderButtonDisplay = document.getElementById("surrender-button")
let hitButtonDisplay = document.getElementById("hit-button");
let standButtonDisplay = document.getElementById("stand-button");
let cardToFlip = document.querySelector(".content-top-card");

let restartButtonDisplay = document.getElementById("restart-button");
let endButtonDisplay = document.getElementById("end-button");

// On click events
surrenderButtonDisplay.onclick = surrender;
hitButtonDisplay.onclick = () => hitMe('player');
standButtonDisplay.onclick= ()=>setTimeout(()=>dealerPlays(), 600);
restartButtonDisplay.onclick = replay;
endButtonDisplay.onclick = leaveCasino;

// On keydown events
document.addEventListener('keydown', (event) => {
    let name = event.key;

    if (gameStarted === 1){
        if (name === 'ArrowDown'){
            if (turn === 1){
                surrender()
            }
        }
        else if (name === 'ArrowRight'){
            setTimeout(()=>dealerPlays(), 600);
        }
        else if (name === 'ArrowLeft'){
            hitMe('player');
        }
    }

    // Alert the key name and key code on keydown
    //alert(`Key pressed ${name} \r\n Key code value: ${code}`);
}, false);

export function initBlackJackBet(statusMessage) {
    if (playerWallet.getActualValue === 0){
        resetPlayingArea();
        document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
        leaveCasino();
    }
    else {
        restartButtonDisplay.classList.add("hidden");
        endButtonDisplay.classList.add("hidden");
        document.getElementById("description-img").src = "public/images/dealer.png";
        announcementMessage.textContent = `${statusMessage}`;
        document.getElementsByClassName("player-bet-form")[0].classList.remove("hidden");
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", startBlackJack);
    }
}

function startBlackJack() {
    roundBet = parseInt(document.querySelector('input[id="player-bet"]').value);
    if (roundBet <= playerWallet.getActualValue && roundBet >= 2 && roundBet <= 100) {
        gameStarted = 1;
        actualiseWallet('-', roundBet)
        document.getElementsByClassName("player-bet-form")[0].classList.add("hidden");
        document.getElementsByClassName("title-item")[0].classList.add("hidden");
        announcementMessage.textContent = 'La partie commence !';
        document.getElementsByClassName('game-buttons')[0].style.display = "flex";
        document.getElementsByClassName("blackjack-table")[0].classList.remove("hidden");
        newDeck();
    } else {
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", initBlackJackBet('Le montant de votre pari doit être compris entre 2€ et 100€'));
    }
}

function surrender() {
    document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
    actualiseWallet('+', roundBet / 2);
    if (playerWallet.getActualValue >= 2) {
        initBlackJackBet('Vous abandonnez ! Pas de soucis voici la moitié de votre mise initiale. On remet ça ?');
    } else {
        roundEnd('lose');
    }
}

function roundEnd(status, statusMessage){
    document.getElementsByClassName('game-buttons')[0].style.display = "none";

    if (playerWallet.getActualValue >= 2){
        if (status === 'win'){
            document.querySelector("#player-cards").classList.add("win-animation");
            setTimeout(() => {document.querySelector("#player-cards").classList.remove("win-animation")}, 1000);
            document.querySelector("#count-victory").innerHTML = `${roundWon}`;
        }
        else if (status === 'lose') {
            document.querySelector("#dealer-cards").classList.add("lose-animation");
            setTimeout(() => {document.querySelector("#dealer-cards").classList.remove("lose-animation")}, 1000);
            document.querySelector("#count-lose").innerHTML = `${roundLost}`;
        }
        else if (status === 'draw'){
            document.querySelector("#player-cards").classList.add("draw-animation");
            document.querySelector("#dealer-cards").classList.add("draw-animation");
            setTimeout(() => {document.querySelector("#player-cards").classList.remove("draw-animation")}, 1000);
            setTimeout(() => {document.querySelector("#dealer-cards").classList.remove("draw-animation")}, 1000);
            document.querySelector("#count-draw").innerHTML = `${roundDraw}`;
        }
        announcementMessage.textContent = statusMessage;
        restartButtonDisplay.classList.remove("hidden");
    }
    else {
        document.querySelector("#dealer-cards").classList.add("lose-animation");
        setTimeout(() => {document.querySelector("#dealer-cards").classList.remove("lose-animation")}, 1000);
        announcementMessage.textContent = "Vous avez perdu ! Rechargez votre porte-monnaie pour pouvoir rejouer !";
        endButtonDisplay.classList.remove("hidden");
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
    await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(new Error("Il y a eu une erreur."));
        }).then(function (data) {
            deckID = data.deck_id;
            remainingCards = data.remaining;
            deckCardCountDisplay.textContent = `${remainingCards} cartes`;
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
            remainingCards -= 4;
            deckCardCountDisplay.textContent = `${remainingCards} cartes`;

            dealerCards.forEach((card, i) => {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:140px");
                if(i===0) {
                    cardDomElement.src = 'public/images/backcard.svg';
                    cardDomElement.setAttribute("style", "max-width:140px");
                } else {
                    cardDomElement.src = card.image;
                }
                dealerCardsDisplay.appendChild(cardDomElement)
            })

            dealerScore = computeScore(dealerCards);

            playerCards.forEach(card => {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:140px");
                cardDomElement.src = card.image;
                playerCardsDisplay.appendChild(cardDomElement)
            })

            playerScore = computeScore(playerCards);
            if (playerScore === 21) {
                roundWon += 1;
                actualiseWallet('+', roundBet * 2);
                roundEnd('win',"Vous avez gagné ! Voulez vous rejouer ?");
            }
            playerScoreDisplay.textContent = `Votre main : ${playerScore}`;

        })
        .catch(console.error)
}

function hitMe(target)

{
    turn += 1;
    document.getElementById("surrender-button").style.display = "none";
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
        .then(res => res.json())
        .then(res => {

            if (target === 'player') {
                hitButtonDisplay.style.display = "block";
                standButtonDisplay.style.display = "block";
                // console.log(cardToFlip)
                cardToFlip.classList.add('content-top-card-flip');
                playerCards.push(res.cards[0])
                remainingCards -= 1;
                deckCardCountDisplay.textContent = `${remainingCards} cartes`;
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:140px");
                cardDomElement.src = res.cards[0].image;
                playerCardsDisplay.appendChild(cardDomElement)

                playerScore = computeScore(playerCards);

                playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
                if (playerScore > 21) {
                    roundLost = true;
                    roundLost += 1;
                    roundEnd('lose',"Vous avez perdu ! Voulez vous rejouer ?");
                }
                else if (playerScore === 21) {
                    playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
                    roundWon += 1;
                    actualiseWallet('+', roundBet * 2);
                    roundEnd('win',"Vous avez gagné ! Voulez vous rejouer ?");
                }
            }

            if (target === 'dealer') {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:140px");
                dealerCards.push(res.cards[0])
                remainingCards -= 1;
                deckCardCountDisplay.textContent = `${remainingCards} cartes`;
                cardDomElement.src = res.cards[0].image;
                dealerCardsDisplay.appendChild(cardDomElement)
                dealerPlays();
            }
        })
        .catch(console.error)
    setTimeout(() => cardToFlip.classList.remove('content-top-card-flip'),1300)
    cardToFlip.classList.add('content-top-card-flip');
}

function dealerPlays() {
    turn += 1;
    dealerScore = computeScore(dealerCards);
    dealerScoreDisplay.textContent = `Main du dealer : ${dealerScore}`;
    dealerCardsDisplay.firstChild.src = dealerCards[0].image;
    if (dealerScore < 17) {
        setTimeout(()=>hitMe('dealer'), 900)
    }
    else if (dealerScore > 21) {
        roundWon += 1;
        actualiseWallet('+', roundBet * 2);
        roundEnd('win',"Bravo ! Vous avez gagner ! On continue sur cette lancée ?");
    }
    else if (dealerScore > playerScore) {
        roundLost += 1;
        roundEnd('lose',"Oups… c’est perdu ! Voulez-vous retenter votre chance ?");
    }
    else if (dealerScore === playerScore) {
        roundDraw += 1;
        actualiseWallet('+', roundBet);
        roundEnd('draw',"Égalité ! Voulez - vous retenter votre chance ?");
    }
    else {
        roundWon += 1;
        actualiseWallet('+', roundBet * 2);
        roundEnd('win',"Bravo ! Vous avez gagner ! On continue sur cette lancée ?");
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

function hasNetwork(online) {
    const element = document.querySelector(".status");
    // Update the DOM to reflect the current status
    if (online) {
        element.classList.remove("offline");
        element.classList.add("online");
        element.innerText = "Online";
    } else {
        element.classList.remove("online");
        element.classList.add("offline");
        element.innerText = "Offline";
    }
}