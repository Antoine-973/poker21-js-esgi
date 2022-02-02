import { initBlackJackBet } from './library/games/blackJack.js'
import {actualiseWallet, playerWallet} from './library/stats/playerWallet.js'

export const announcementMessage = document.getElementById("game-status");

export function enterCasino(){
    playerWallet.setGain = 0;
    document.getElementById("gain-record").innerHTML = playerWallet.getGainRecord;
    document.getElementsByClassName("player-wallet")[0].classList.remove("hidden");
    document.getElementsByClassName("enter-casino-button")[0].classList.add("hidden");
    announcementMessage.textContent = "Avec quel somme rentré vous dans le casino ?";
    document.getElementsByClassName("confirm-wallet-amount-button")[0].addEventListener("click", startGame);
}

function startGame(){
    playerWallet.setInitialValue = parseInt(document.querySelector('input[id="player-wallet"]').value);
    actualiseWallet('+',playerWallet.getInitialValue);
    document.querySelector("#actual-player-wallet-value").innerHTML = `${playerWallet.getActualValue}`;
    document.getElementsByClassName("player-wallet")[0].classList.add("hidden");
    document.getElementsByClassName("global-stats")[0].classList.remove("hidden");
    announcementMessage.textContent = `Vous rentrez dans le casino avec un porte monnaie d'une valeur de ${playerWallet.getInitialValue}€`;
    initBlackJackBet("Début de la partie, veuillez donner la valeur de votre mise :");
}

export function leaveCasino(){
    document.getElementById("description-img").src = "src/casino-entrance.png";
    document.getElementById("restart-button").classList.add("hidden");
    document.getElementById("end-button").classList.add("hidden");
    //document.getElementsByClassName("global-stats")[0].classList.add("hidden");
    document.getElementsByClassName("enter-casino-button")[0].classList.remove("hidden");

    if (playerWallet.getActualValue === 0){
        announcementMessage.textContent = `Perdu, plus d'argent ! Vous quittez le casino avec un déficite de ${playerWallet.initialValue}€ !`;
    }
    else if (playerWallet.getActualValue !== 0 && playerWallet.getGain > playerWallet.gainRecord){
        playerWallet.setGainRecord = playerWallet.getGain;
        announcementMessage.textContent = ` Record de gain ! Vous quittez le casino avec un gain de : ${playerWallet.gain}€ ! Vous étiez rentrer avec un montant de : ${playerWallet.initialValue}€ !`;
    }
    else if (playerWallet.getActualValue !== 0){
        announcementMessage.textContent = `Vous quittez le casino avec un gain de : ${playerWallet.gain}€ ! Vous étiez rentrer avec un montant de : ${playerWallet.initialValue}€ !`;
    }
}

document.getElementsByClassName("enter-casino-button")[0].addEventListener("click", enterCasino);
