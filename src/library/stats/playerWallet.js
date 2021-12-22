export const PlayerWallet = {
    initialValue: 0,
    actualValue: 0,

    get getInitialValue(){
        return this.initialValue;
    },

    set setInitialValue(newInitialValue){
        document.querySelector("#initial-player-wallet-value").innerHTML = `${newInitialValue}`;
        this.initialValue = newInitialValue;
    },

    get getActualValue(){
        return this.actualValue;
    },

    set setActualValue(newActualValue){
        this.actualValue = newActualValue;
    },
}

export let playerWallet = Object.create(PlayerWallet);

export function actualiseWallet(operator, value){

    if (operator === '+'){
        playerWallet.actualValue += value;
    }
    else if (operator === '-'){
        playerWallet.actualValue -= value;
    }
    else if (operator === '*'){
        playerWallet.actualValue *= value;
    }
    else if (operator === '/'){
        playerWallet.actualValue /= value;
    }
    else {
        playerWallet.actualValue = value;
    }

    document.querySelector("#actual-player-wallet-value").innerHTML = `${playerWallet.actualValue}`;
}