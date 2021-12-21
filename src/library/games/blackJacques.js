let deckId = "";
let dealerCards = [];
let playerCards = [];
let playerWin = 0;
let playerLost = 0;
let playerDraw = 0;
let playerBet = 0;

export function playBlackJacques(){
    document.getElementsByClassName("games-selection")[0].classList.add("hidden");
    document.getElementById("description-img").src="dealer.png";
    document.getElementsByClassName("game-status")[0].innerHTML = `Début de la partie, veuillez donner la valeur de votre mise :`;
    document.getElementsByClassName("blackjack-table")[0].classList.remove("hidden");
}