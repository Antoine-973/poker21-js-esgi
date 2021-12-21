import { playBlackJacques } from './library/games/blackJacques.js'
import { PlayerStat } from './library/stats/globalStats.js'

let playerStat = Object.create(PlayerStat);

function enterCasino(){
    document.getElementsByClassName("player-wallet")[0].classList.remove("hidden");
    document.getElementsByClassName("enter-casino-button")[0].classList.add("hidden");
    document.getElementsByClassName("game-status")[0].innerHTML = "Avec quel somme rentré vous dans le casino ?";
    document.getElementsByClassName("confirm-wallet-amount-button")[0].addEventListener("click", selectGame);
}

function selectGame(){
    playerStat.initialPlayerWallet = parseInt(document.querySelector('input[id="player-wallet"]').value);
    playerStat.actualPlayerWallet = parseInt(document.querySelector('input[id="player-wallet"]').value);
    document.querySelector("#initial-player-wallet-value").innerHTML = `${playerStat.initialPlayerWallet}`;
    document.querySelector("#actual-player-wallet-value").innerHTML = `${playerStat.actualPlayerWallet}`;
    document.getElementsByClassName("player-wallet")[0].classList.add("hidden");
    document.getElementsByClassName("games-selection")[0].classList.remove("hidden");
    document.getElementsByClassName("global-stats")[0].classList.remove("hidden");
    document.getElementsByClassName("game-status")[0].innerHTML = `Vous rentrez dans le casino avec un porte monnaie d'une valeur de ${playerStat.initialPlayerWallet.toString()}€`;
    document.getElementsByClassName("new-game-blackjack-button")[0].addEventListener("click", playBlackJacques);
}

document.getElementsByClassName("enter-casino-button")[0].addEventListener("click", enterCasino);
