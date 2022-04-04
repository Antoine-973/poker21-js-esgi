"use strict";

import {initBlackJackBet} from './library/games/blackJack.js'
import {actualiseWallet, playerWallet} from './library/stats/playerWallet.js'

export const announcementMessage = document.getElementById("game-status");

export function enterCasino(){
    localStorage.setItem('userFlow', 'enterCasino');
    playerWallet.setInitialValue = 0;
    playerWallet.setActualValue = 0;
    playerWallet.setGain = 0;
    localStorage.setItem('playerWallet', '0');
    isInLocalStorage('playerWallet') ? document.getElementById("gain-record").innerHTML = localStorage.getItem('playerWallet') : document.getElementById("gain-record").innerHTML = playerWallet.getGainRecord;
    document.getElementsByClassName("player-wallet")[0].classList.remove("hidden");
    localStorage.setItem('playerWalletDisplay', 'hidden');
    document.getElementsByClassName("enter-casino-button")[0].classList.add("hidden");
    announcementMessage.textContent = "Avec quelle somme rentrez-vous dans le casino ?";
    localStorage.setItem('announcementMessage', 'Avec quelle somme rentrez-vous dans le casino ?');
    document.getElementsByClassName("confirm-wallet-amount-button")[0].addEventListener("click", startGame);
    if (window.matchMedia("(max-width: 1024px)").matches) {
        document.getElementsByClassName("content_mobile_icon")[0].style.display= "block";
     }

}

function startGame(){
    localStorage.setItem('userFlow', 'startGame');
    document.getElementsByClassName("enter-casino-button")[0].classList.add("hidden");
    let walletValue = 0;
    if (isInLocalStorage('walletInitialValue')){
        walletValue = localStorage.getItem('walletInitialValue')
    }
    else {
        walletValue = parseInt(document.querySelector('input[id="player-wallet"]').value);
        localStorage.setItem('walletInitialValue', `${parseInt(document.querySelector('input[id="player-wallet"]').value)}`);
    }

    if (walletValue >= 2){
        if (isInLocalStorage('walletInitialValue')){
            playerWallet.setInitialValue = localStorage.getItem('walletInitialValue')
            actualiseWallet('+', parseInt(localStorage.getItem('walletInitialValue')));
        }
        else {
            playerWallet.setInitialValue = parseInt(document.querySelector('input[id="player-wallet"]').value);
            actualiseWallet('+',playerWallet.getInitialValue);
        }

        document.querySelector("#actual-player-wallet-value").innerHTML = `${playerWallet.getActualValue}`;
        document.getElementsByClassName("player-wallet")[0].classList.add("hidden");
        document.getElementsByClassName("global-stats")[0].classList.remove("hidden");
        announcementMessage.textContent = `Vous rentrez dans le casino avec un porte monnaie d'une valeur de ${playerWallet.getInitialValue}€`;
        initBlackJackBet("Début de la partie ! Veuillez donner le montant de votre mise :");
    }
    else {
        announcementMessage.textContent = "Vous devez rentrer dans le casino avec au minimum 2€ pour pouvoir jouer !"
    }
}

export function leaveCasino(){
    document.getElementsByClassName("blackjack-table")[0].classList.add("hidden");
    document.getElementById("description-img").src = "public/images/casino-entrance.png";
    document.getElementById("restart-button").classList.add("hidden");
    document.getElementById("end-button").classList.add("hidden");
    document.getElementsByClassName("global-stats")[0].classList.add("hidden");
    document.getElementsByClassName("enter-casino-button")[0].classList.remove("hidden");

    if (playerWallet.gain <= 0){
        announcementMessage.textContent = `Vous êtes à sec ! Vous n'avez rien gagné ormis la perte de ${playerWallet.initialValue}€ !`;
    }
    else if (playerWallet.gain > 0 && playerWallet.getGain > playerWallet.gainRecord){
        playerWallet.setGainRecord = playerWallet.getGain;
        localStorage.setItem('gainRecord', playerWallet.getGain);
        announcementMessage.textContent = ` Bravo ! Gain record du casino ! Vous quittez le casino avec un gain de ${playerWallet.gain}€ ! A votre entrée, vous aviez un montant de : ${playerWallet.initialValue}€ !`;
    }
    else if (playerWallet.gain > 0){
        announcementMessage.textContent = `Vous quittez le casino avec un gain de : ${playerWallet.gain}€ ! A votre entrée, vous aviez un montant de : ${playerWallet.initialValue}€ !`;
    }

    localStorage.clear()
    playerWallet.setInitialValue = 0;
    playerWallet.setActualValue = 0;

    if (localStorage.getItem('playerWallet')){
        localStorage.setItem('playerWallet', playerWallet.setActualValue);
        document.querySelector("#player-wallet-difference").innerHTML = `${parseInt(localStorage.getItem('playerWallet')) - parseInt(localStorage.getItem('walletInitialValue'))}`;
        document.querySelector("#gain-record").innerHTML = localStorage.getItem('gainRecord');
        document.querySelector("#actual-player-wallet-value").innerHTML = parseInt(localStorage.getItem('playerWallet'));
    }
    else {
        document.querySelector("#gain-record").innerHTML = `${playerWallet.gainRecord}`;
        document.querySelector("#player-wallet-difference").innerHTML = `${playerWallet.actualValue - playerWallet.initialValue}`;
        document.querySelector("#actual-player-wallet-value").innerHTML = `${playerWallet.actualValue}`;
    }
}

export function isInLocalStorage(variable){
    if (localStorage.getItem(variable)){
        return true
    }
    else return false
}

document.getElementById('burger_icon').addEventListener("click", function () {
    document.getElementsByClassName('stat-item')[0].classList.add('open_nav_mobile')
})

document.getElementById('close_nav_button').addEventListener("click", function () {
    document.getElementsByClassName('stat-item')[0].classList.remove('open_nav_mobile')
})

if (isInLocalStorage('userFlow')){
    if (localStorage.getItem('userFlow') === 'enterCasino'){
        enterCasino()
    }
    else if (localStorage.getItem('userFlow') === 'startGame'){
        startGame()
    }
}

document.getElementsByClassName("enter-casino-button")[0].addEventListener("click", enterCasino);
