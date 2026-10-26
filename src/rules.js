const gameStates = {
    widthBoard: 10,
    heightBoard: 10,
    initialPosition: 1,
    finalPosition: this.widthBoard * this.heightBoard,
};

const sourceDestPairs = [
    [2, 38],
    [7, 14],
    [8, 31],
    [15, 26],
    [28, 84],
    [16, 6],
    [40, 11],
    [62, 19],
    [64, 60],
    [99, 80],
];

const positionDisplay = [
    [3, "foo"],
    [4, "baz"],
    [5, "bar"],
    [7, "jazz"],
    [9, "huzz"],
];

export { gameStates, sourceDestPairs, positionDisplay };
