import { initBlackJacquesBet } from './library/games/blackJacques.js'
import {actualiseWallet, playerWallet} from './library/stats/playerWallet.js'

export const announcementMessage = document.getElementById("game-status");

export function enterCasino(){
    document.getElementsByClassName("player-wallet")[0].classList.remove("hidden");
    document.getElementsByClassName("enter-casino-button")[0].classList.add("hidden");
    announcementMessage.textContent = "Avec quel somme rentré vous dans le casino ?";
    document.getElementsByClassName("confirm-wallet-amount-button")[0].addEventListener("click", selectGame);
}

function selectGame(){
    playerWallet.setInitialValue = parseInt(document.querySelector('input[id="player-wallet"]').value);
    actualiseWallet('+',playerWallet.getInitialValue);
    document.querySelector("#actual-player-wallet-value").innerHTML = `${playerWallet.getActualValue}`;
    document.getElementsByClassName("player-wallet")[0].classList.add("hidden");
    document.getElementsByClassName("games-selection")[0].classList.remove("hidden");
    document.getElementsByClassName("global-stats")[0].classList.remove("hidden");
    announcementMessage.textContent = `Vous rentrez dans le casino avec un porte monnaie d'une valeur de ${playerWallet.getInitialValue}€`;
    document.getElementsByClassName("new-game-blackjack-button")[0].addEventListener("click", initBlackJacquesBet('Début de la partie, veuillez donner la valeur de votre mise :'));
}

document.getElementsByClassName("enter-casino-button")[0].addEventListener("click", enterCasino);
