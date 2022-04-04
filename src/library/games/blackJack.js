"use strict";

import {actualiseWallet, playerWallet} from '../stats/playerWallet.js'
import {announcementMessage, isInLocalStorage, leaveCasino} from "../../main.js";

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
let abortControllerBeforeGame;
let abortControllerInGame;

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
let cancelButtonDisplay = document.getElementById("cancel-button");
let reloadButtonDisplay = document.getElementById("reload-button");

// On click events
surrenderButtonDisplay.onclick = surrender;
hitButtonDisplay.onclick = () => hitMe('player');
standButtonDisplay.onclick= ()=>setTimeout(()=>dealerPlays(), 600);
restartButtonDisplay.onclick = replay;
endButtonDisplay.onclick = leaveCasino;
reloadButtonDisplay.addEventListener('click', function() {
    if(abortControllerBeforeGame) {
        console.log('Event aborted');
        abortControllerBeforeGame.abort();
        reloadButtonDisplay.style.display = "none";
        document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
        actualiseWallet('+', roundBet)
        initBlackJackBet('Début de la partie, veuillez donner la valeur de votre mise :')
    }
});

cancelButtonDisplay.addEventListener('click', function() {
    if (abortControllerInGame){
        console.log('Event aborted');
        abortControllerInGame.abort();
        hitButtonDisplay.style.display = "block";
        standButtonDisplay.style.display = "block";
        cancelButtonDisplay.style.display = "none";

        if (turn === 1){
            surrenderButtonDisplay.style.display = "block";
        }
    }
});

// device info
const ua = navigator.userAgent;

// On keydown events
document.addEventListener('keydown', (event) => {
    let name = event.key;

    if (gameStarted === 1 || parseInt(localStorage.getItem('gameStarted')) === 1){
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
        else if (name === 'ArrowUp'){
            abortControllerInGame.abort();
        }
    }
}, false);

export function initBlackJackBet(statusMessage) {
    if (playerWallet.getActualValue === 0){
        document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
        leaveCasino();
    }
    else {
        restartButtonDisplay.classList.add("hidden");
        endButtonDisplay.classList.add("hidden");
        document.getElementById("description-img").src = "public/images/dealer.png";
        announcementMessage.textContent = `${statusMessage}`;
        localStorage.setItem('announcementMessage', statusMessage)
        document.getElementsByClassName("player-bet-form")[0].classList.remove("hidden");
        if (isInLocalStorage('roundBet')){
            roundBet = localStorage.getItem('roundBet')
            startBlackJack();
        }
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", startBlackJack);
    }
}

async function startBlackJack() {
    if (isInLocalStorage('roundBet') && parseInt(localStorage.getItem('roundBet')) !== 0){
        roundBet = localStorage.getItem('roundBet')
    }
    else {
        roundBet = parseInt(document.querySelector('input[id="player-bet"]').value);
        localStorage.setItem('roundBet', `${parseInt(document.querySelector('input[id="player-bet"]').value)}`);
    }

    if (roundBet <= playerWallet.getActualValue && roundBet >= 2 && roundBet <= 100) {
        actualiseWallet('-', roundBet)
        document.getElementsByClassName("player-bet-form")[0].classList.add("hidden");
        document.getElementsByClassName("title-item")[0].classList.add("hidden");
        announcementMessage.textContent = 'La partie commence !';
        localStorage.setItem('announcementMessage', 'La partie commence !');
        document.getElementsByClassName('game-buttons')[0].style.display = "flex";
        document.getElementsByClassName("blackjack-table")[0].classList.remove("hidden");

        if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){

            announcementMessage.textContent = localStorage.getItem('announcementMessage')
            deckCardCountDisplay.textContent = `${parseInt(localStorage.getItem('remainingCards'))} cartes`;

            JSON.parse(localStorage.getItem('dealerCards')).forEach((card, i) => {
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

            JSON.parse(localStorage.getItem('playerCards')).forEach(card => {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:140px");
                cardDomElement.src = card.image;
                playerCardsDisplay.appendChild(cardDomElement)
            })

            document.querySelector("#player-wallet-difference").innerHTML = `${parseInt(localStorage.getItem('playerWallet')) - parseInt(localStorage.getItem('walletInitialValue'))}`;
            document.querySelector("#gain-record").innerHTML = localStorage.getItem('gainRecord');
            document.querySelector("#actual-player-wallet-value").innerHTML = parseInt(localStorage.getItem('playerWallet'));

            if (localStorage.getItem('roundWon')){
                document.querySelector("#count-victory").innerHTML = localStorage.getItem('roundWon');
            }
            else {
                document.querySelector("#count-victory").innerHTML = '0';
            }

            if (localStorage.getItem('roundLost')){
                document.querySelector("#count-lose").innerHTML = localStorage.getItem('roundLost');
            }
            else {
                document.querySelector("#count-lose").innerHTML = '0';
            }

            if (localStorage.getItem('roundDraw')){
                document.querySelector("#count-draw").innerHTML = localStorage.getItem('roundDraw');
            }
            else {
                document.querySelector("#count-draw").innerHTML = '0';
            }


            playerScoreDisplay.textContent = `Votre main : ${localStorage.getItem('playerScore')}`;

            if (isInLocalStorage('dealerPlay')){
                dealerScoreDisplay.textContent = `Main du dealer : ${localStorage.getItem('dealerScore')}`;
            }


            if (isInLocalStorage('roundStatus') && localStorage.getItem('roundStatus') === 'ongoing'){
                hitButtonDisplay.style.display = "block";
                standButtonDisplay.style.display = "block";
                if (parseInt(localStorage.getItem('turn')) > 1){
                    surrenderButtonDisplay.style.display = "block";
                }
            }
            else if (isInLocalStorage('roundStatus') && localStorage.getItem('roundStatus') === 'lose'){
                roundEnd('lose',"Oups c’est perdu ! Voulez-vous retenter votre chance ?");
            }
            else if (isInLocalStorage('roundStatus') && localStorage.getItem('roundStatus') === 'win'){
                roundEnd('win',"Bravo ! Vous avez gagner ! On continue sur cette lancée ?");
            }
            else if (isInLocalStorage('roundStatus') && localStorage.getItem('roundStatus') === 'draw'){
                roundEnd('draw',"Égalité ! Voulez - vous retenter votre chance ?");
            }
        }
        else {
            await newDeck();
        }
    } else {
        document.getElementsByClassName("confirm-bet-button")[0].addEventListener("click", initBlackJackBet('Le montant de votre pari doit être compris entre 2€ et 100€'));
    }
}

function surrender(){
    roundEnd('surrender', 'Vous abandonnez ! Pas de soucis voici la moitié de votre mise initiale. On remet ça ?');
}

function roundEnd(status, statusMessage){
    document.getElementsByClassName('game-buttons')[0].style.display = "none";

    if (status === 'surrender'){
        if (localStorage.getItem('roundBet')){
            actualiseWallet('+', localStorage.getItem('roundBet') / 2);
        }
        else {
            actualiseWallet('+', roundBet / 2);
        }
        localStorage.setItem('playerWallet', playerWallet.getActualValue)
    }

    if (localStorage.getItem('playerWallet')){
        playerWallet.setActualValue = parseInt(localStorage.getItem('playerWallet'));
    }

    if (playerWallet.getActualValue >= 2){
        if (status === 'win'){
            localStorage.setItem('roundStatus', 'win');
            document.querySelector("#player-cards").classList.add("win-animation");
            setTimeout(() => {document.querySelector("#player-cards").classList.remove("win-animation")}, 1000);
            document.querySelector("#count-victory").innerHTML = `${roundWon}`;

            window.navigator.vibrate(1500);
        }
        else if (status === 'lose') {
            localStorage.setItem('roundStatus', 'lose');
            document.querySelector("#dealer-cards").classList.add("lose-animation");
            setTimeout(() => {document.querySelector("#dealer-cards").classList.remove("lose-animation")}, 1000);
            document.querySelector("#count-lose").innerHTML = `${roundLost}`;
        }
        else if (status === 'draw'){
            localStorage.setItem('roundStatus', 'draw');
            document.querySelector("#player-cards").classList.add("draw-animation");
            document.querySelector("#dealer-cards").classList.add("draw-animation");
            setTimeout(() => {document.querySelector("#player-cards").classList.remove("draw-animation")}, 1000);
            setTimeout(() => {document.querySelector("#dealer-cards").classList.remove("draw-animation")}, 1000);
            document.querySelector("#count-draw").innerHTML = `${roundDraw}`;
        }
        else if (status === 'surrender'){
            localStorage.setItem('roundStatus', 'surrender');
        }

        announcementMessage.textContent = statusMessage;
        localStorage.setItem('announcementMessage', statusMessage);
        restartButtonDisplay.classList.remove("hidden");
        endButtonDisplay.classList.remove("hidden");
    }
    else {
        actualiseWallet('-', roundBet);
        localStorage.clear();
        document.querySelector("#dealer-cards").classList.add("lose-animation");
        setTimeout(() => {document.querySelector("#dealer-cards").classList.remove("lose-animation")}, 1000);
        announcementMessage.textContent = "Vous avez perdu ! Rechargez votre porte-monnaie pour pouvoir rejouer !";
        localStorage.setItem('announcementMessage', statusMessage);
        endButtonDisplay.classList.remove("hidden");
    }
}

function replay(){
    localStorage.removeItem('roundBet');
    localStorage.removeItem('gameStarted');
    resetPlayingArea();
    resetPlayingAreaDisplay();
    document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
    initBlackJackBet("Début de la partie, veuillez donner la valeur de votre mise :")
}

async function newDeck() {
    resetPlayingArea();
    resetPlayingAreaDisplay();
    abortControllerBeforeGame = new AbortController();
    const signal = abortControllerBeforeGame.signal;
    reloadButtonDisplay.style.display = "block";
    await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', { signal })
        .then(function (response) {
            if (response.ok) {
                reloadButtonDisplay.style.display = "none";
                hitButtonDisplay.style.display = "block";
                standButtonDisplay.style.display = "block";
                surrenderButtonDisplay.style.display = "block";
                return response.json();
            }
            return Promise.reject(new Error("Il y a eu une erreur."));
        }).then(function (data) {
            deckID = data.deck_id;
            localStorage.setItem('deckID', `${data.deck_id}`);
            remainingCards = data.remaining;
            localStorage.setItem('remainingCards', `${data.remaining}`);
            deckCardCountDisplay.textContent = `${remainingCards} cartes`;
        }).catch(function (error) {
            console.log(error.message);
            announcementMessage.textContent = "Il y a eu une erreur lors de la création du deck";
            reloadButtonDisplay.style.display = "block";
        });

    setTimeout(function () {
        abortControllerBeforeGame.abort();
    }, 10000);
    await initPlayArea();
}

async function initPlayArea(){
    abortControllerBeforeGame = new AbortController();
    const signal = abortControllerBeforeGame.signal;
    hitButtonDisplay.style.display = "none";
    standButtonDisplay.style.display = "none";
    surrenderButtonDisplay.style.display = "none";
    reloadButtonDisplay.style.display = "block";
    await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`, { signal } )
        .then(function (res) {
            if (res.ok) {
                reloadButtonDisplay.style.display = "none";
                hitButtonDisplay.style.display = "block";
                standButtonDisplay.style.display = "block";
                surrenderButtonDisplay.style.display = "block";
                return res.json();
            }
            return Promise.reject(new Error("Il y a eu une erreur."));
        })
        .then(res => {
            dealerCards.push(res.cards[0], res.cards[1])
            localStorage.setItem('dealerCards', JSON.stringify(dealerCards))
            playerCards.push(res.cards[2], res.cards[3])
            localStorage.setItem('playerCards', JSON.stringify(playerCards))
            remainingCards -= 4;
            localStorage.setItem('remainingCards', `${remainingCards}`);
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
            localStorage.setItem('dealerScore', `${dealerScore}`)

            playerCards.forEach(card => {
                let cardDomElement = document.createElement("img");
                cardDomElement.setAttribute("style", "max-width:140px");
                cardDomElement.src = card.image;
                playerCardsDisplay.appendChild(cardDomElement)
            })

            playerScore = computeScore(playerCards);
            localStorage.setItem('playerScore', `${playerScore}`)

            if (playerScore === 21) {
                roundWon += 1;
                localStorage.setItem('roundWon', '1');
                actualiseWallet('+', roundBet * 2);
                localStorage.setItem('playerWalllet', playerWallet.getActualValue);
                roundEnd('win',"Vous avez gagné ! Voulez vous rejouer ?");
            }
            playerScoreDisplay.textContent = `Votre main : ${playerScore}`;

        })
        .catch(function (error) {
            announcementMessage.textContent = "Il y a eu une erreur votre mise vous a été rendu, veuillez réessayer";
            console.log(error.message);
            reloadButtonDisplay.style.display = "none";
        });
    setTimeout(function () {
        abortControllerBeforeGame.abort();
    }, 10000);

    gameStarted = 1;
    localStorage.setItem('gameStarted', '1');
    localStorage.setItem('roundStatus', 'ongoing');
}


async function hitMe(target) {
    document.getElementById("surrender-button").style.display = "none";
    abortControllerInGame = new AbortController();
    const signal = abortControllerInGame.signal;
    hitButtonDisplay.style.display = "none";
    standButtonDisplay.style.display = "none";
    surrenderButtonDisplay.style.display = "none";
    cancelButtonDisplay.style.display = "block";

    if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){
        deckID = localStorage.getItem('deckID');
    }

    await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`, { signal })
    .then(function (res) {
        if (res.ok) {
            hitButtonDisplay.style.display = "block";
            standButtonDisplay.style.display = "block";
            cardToFlip.classList.add('content-top-card-flip');
            cancelButtonDisplay.style.display = "none";
            return res.json();
        }
        return Promise.reject(new Error("Il y a eu une erreur."));
    })
    .then(res => {
        if (target === 'player'){
            turn += 1;
            localStorage.setItem('turn', turn);
            if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){
                playerCards = JSON.parse(localStorage.getItem('playerCards'));
            }
            playerCards.push(res.cards[0])
            localStorage.setItem('playerCards', JSON.stringify(playerCards))

            if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){
                remainingCards = localStorage.getItem('remainingCards');
            }
            remainingCards -= 1;
            localStorage.setItem('remainingCards', remainingCards);

            deckCardCountDisplay.textContent = `${remainingCards} cartes`;
            let cardDomElement = document.createElement("img");
            cardDomElement.setAttribute("style", "max-width:140px");
            cardDomElement.src = res.cards[0].image;
            playerCardsDisplay.appendChild(cardDomElement)

            playerScore = computeScore(playerCards);
            localStorage.setItem('playerScore', playerScore);

            playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
            if (playerScore > 21) {
                roundLost += 1;
                localStorage.setItem('roundLost', roundLost);
                localStorage.setItem('playerWallet', playerWallet.getActualValue)
                roundEnd('lose',"Vous avez perdu ! Voulez vous rejouer ?");
            }
            else if (playerScore === 21) {
                playerScoreDisplay.textContent = `Votre main : ${playerScore}`;
                roundWon += 1;
                localStorage.setItem('roundWon', roundWon);
                actualiseWallet('+', roundBet * 2);
                localStorage.setItem('playerWallet', playerWallet.getActualValue)
                roundEnd('win',"Vous avez gagné ! Voulez vous rejouer ?");
            }
        }

        if (target === 'dealer') {
            localStorage.setItem('dealerPlay', '1')
            let cardDomElement = document.createElement("img");
            cardDomElement.setAttribute("style", "max-width:140px");

            if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){
                dealerCards = JSON.parse(localStorage.getItem('dealerCards'));
            }
            dealerCards.push(res.cards[0]);
            localStorage.setItem('dealerCards', JSON.stringify(dealerCards))

            if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){
                remainingCards = localStorage.getItem('remainingCards');
            }
            remainingCards -= 1;
            localStorage.setItem('remainingCards', remainingCards);

            deckCardCountDisplay.textContent = `${remainingCards} cartes`;
            cardDomElement.src = res.cards[0].image;
            dealerCardsDisplay.appendChild(cardDomElement)
            hitButtonDisplay.style.display = "block";
            standButtonDisplay.style.display = "block";
            cancelButtonDisplay.style.display = "none";
            dealerPlays();
        }
    })
    .catch(function (error) {
        console.log(error.message);
        hitButtonDisplay.style.display = "block";
        standButtonDisplay.style.display = "block";
        cancelButtonDisplay.style.display = "none";
    });

    setTimeout(function () {
        abortControllerInGame.abort();
    }, 10000);

    setTimeout(() => cardToFlip.classList.remove('content-top-card-flip'),1300)
    cardToFlip.classList.add('content-top-card-flip');
}

function dealerPlays() {
    turn += 1;
    localStorage.setItem('turn', turn);
    if (isInLocalStorage('gameStarted') && parseInt(localStorage.getItem('gameStarted')) === 1){
        dealerCards = JSON.parse(localStorage.getItem('dealerCards'));
    }
    dealerScore = computeScore(dealerCards);
    localStorage.setItem('dealerScore', dealerScore);
    dealerScoreDisplay.textContent = `Main du dealer : ${dealerScore}`;
    dealerCardsDisplay.firstChild.src = dealerCards[0].image;

    if (dealerScore < 17) {
        setTimeout(()=>hitMe('dealer'), 900)
    }
    else if (dealerScore > 21) {
        roundWon += 1;
        localStorage.setItem('roundWon', roundWon);
        actualiseWallet('+', roundBet * 2);
        localStorage.setItem('playerWallet', playerWallet.getActualValue)
        roundEnd('win',"Bravo ! Vous avez gagner ! On continue sur cette lancée ?");
    }
    else if (dealerScore > playerScore) {
        roundLost += 1;
        localStorage.setItem('roundLost', roundLost);
        roundEnd('lose',"Oups c’est perdu ! Voulez-vous retenter votre chance ?");
    }
    else if (dealerScore === playerScore) {
        roundDraw += 1;
        localStorage.setItem('roundDraw', roundDraw);
        actualiseWallet('+', roundBet);
        localStorage.setItem('playerWallet', playerWallet.getActualValue)
        roundEnd('draw',"Égalité ! Voulez - vous retenter votre chance ?");
    }
    else {
        roundWon += 1;
        localStorage.setItem('roundWon', roundWon);
        actualiseWallet('+', roundBet * 2);
        localStorage.setItem('playerWallet', playerWallet.getActualValue)
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
    localStorage.removeItem('gameStarted');
    dealerCards = [];
    localStorage.removeItem('dealerCards');
    playerCards = [];
    localStorage.removeItem('playerCards');
    dealerScore = "?";
    localStorage.removeItem('dealerScore');
    playerScore = 0;
    localStorage.removeItem('playerScore');
    localStorage.removeItem('dealerPlay');
    localStorage.removeItem('turn');
}

function resetPlayingAreaDisplay(){
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