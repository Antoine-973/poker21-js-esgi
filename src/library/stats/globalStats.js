export const PlayerStat = {
    initialPlayerWallet: 0,
    actualPlayerWallet: 0,

    get getInitialPlayerWallet(){
        return this.initialPlayerWallet;
    },

    set setInitialPlayerWallet(newInitialPlayerWallet){
        this.initialPlayerWallet = newInitialPlayerWallet;
    },

    get getActualPlayerWallet(){
        return this.actualPlayerWallet;
    },

    set setActualPlayerWallet(newActualPlayerWallet){
        this.initialActualWallet = newActualPlayerWallet;
    },
}

