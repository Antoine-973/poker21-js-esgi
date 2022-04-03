import { initBlackJackBet } from './library/games/blackJack.js'
import {actualiseWallet, playerWallet} from './library/stats/playerWallet.js'

export const announcementMessage = document.getElementById("game-status");

export function enterCasino(){
    playerWallet.setGain = 0;
    document.getElementById("gain-record").innerHTML = playerWallet.getGainRecord;
    document.getElementsByClassName("player-wallet")[0].classList.remove("hidden");
    document.getElementsByClassName("enter-casino-button")[0].classList.add("hidden");
    announcementMessage.textContent = "Avec quelle somme rentrez-vous dans le casino ?";
    document.getElementsByClassName("confirm-wallet-amount-button")[0].addEventListener("click", startGame);
    document.getElementsByClassName("content_mobile_icon")[0].style.display= "block";
}

function startGame(){

    let walletValue = parseInt(document.querySelector('input[id="player-wallet"]').value);

    if (walletValue >= 2){
        playerWallet.setInitialValue = parseInt(document.querySelector('input[id="player-wallet"]').value);
        actualiseWallet('+',playerWallet.getInitialValue);
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

    if (playerWallet.getActualValue === 0){
        announcementMessage.textContent = `Vous êtes à sec ! Vous n'avez rien gagné ormis la perte de ${playerWallet.initialValue}€ !`;
    }
    else if (playerWallet.getActualValue !== 0 && playerWallet.getGain > playerWallet.gainRecord){
        playerWallet.setGainRecord = playerWallet.getGain;
        announcementMessage.textContent = ` Bravo ! Gain record du casino ! Vous quittez le casino avec un gain de ${playerWallet.gain}€ ! A votre entrée, vous aviez un montant de : ${playerWallet.initialValue}€ !`;
    }
    else if (playerWallet.getActualValue !== 0){
        announcementMessage.textContent = `Vous quittez le casino avec un gain de : ${playerWallet.gain}€ ! A votre entrée, vous aviez un montant de : ${playerWallet.initialValue}€ !`;
    }
}

document.getElementById('burger_icon').addEventListener("click", function () {
    document.getElementsByClassName('stat-item')[0].classList.add('open_nav_mobile')
})

document.getElementById('close_nav_button').addEventListener("click", function () {
    document.getElementsByClassName('stat-item')[0].classList.remove('open_nav_mobile')
})

document.getElementsByClassName("enter-casino-button")[0].addEventListener("click", enterCasino);
