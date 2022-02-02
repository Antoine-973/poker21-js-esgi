export const PlayerWallet = {
    initialValue: 0,
    actualValue: 0,
    gain: 0,
    gainRecord: 0,

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

    get getGain(){
        return this.gain;
    },

    set setGain(newGain){
        this.gain = newGain;
    },

    get getGainRecord(){
        return this.gainRecord;
    },

    set setGainRecord(newGainRecord){
        this.gainRecord = newGainRecord;
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

    playerWallet.gain = playerWallet.actualValue - playerWallet.initialValue;
    document.querySelector("#player-wallet-difference").innerHTML = `${playerWallet.actualValue - playerWallet.initialValue}`;
    document.querySelector("#actual-player-wallet-value").innerHTML = `${playerWallet.actualValue}`;
}