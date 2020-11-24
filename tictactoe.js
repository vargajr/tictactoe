'use strict';
// maga a mátrix, egyelőre csak egy üres tömb
const matrix = [];
// sorok és oszlopok száma, hátha nem nágyzetes
const rows = 3;
const cols = 3;
// lépések száma
let stepCount = 0;
// az aktuális jel
let mark = 'X';
// visszajelzés a játék állapotáról
let feedback = '';

// csak feltöltöm a mátrixot (valjában opcionális lépés is lehet)
const initState = () => {
    // ehelyett a fill metódussal szebb lenne
    for (let i = 0; i < rows; i += 1) {
        matrix[i] = [];
        for (let j = 0; j < cols; j += 1) {
            matrix[i][j] = null;
        }
    }
    waitForNextMove();
    giveFeedback();
}

// a mátrix egy elemének értéket adok, az adott elem data attributumait 
// felhasználva nyerem ki az értéket
const changeMatrixValue = (element) => {
    // element.dataset.cell = element.getAttribute('data-cell'))
    const row = parseInt(element.dataset.row, 10);
    const cell = parseInt(element.dataset.cell, 10);
    matrix[row][cell] = element.textContent;
}

const increaseCounter = () => {
    stepCount += 1;
}

const modifyCell = (element) => {
    element.removeEventListener('click', handleClick);
    element.textContent = mark;
}

const setMark = () => {
    mark = mark === 'X' ? 'O' : 'X';
}

// kattintáskor mi történjen, érdemes lenne több függvényre bontani
const handleClick = (event) => {
    increaseCounter();
    modifyCell(event.target);
    setMark();
    changeMatrixValue(event.target);
    checkWinner();
    giveFeedback();
}

// minden elemhez hozzáadom az eseményfigyelőt
const addListener = () => {
    document.querySelectorAll('.tictactoe__cell').forEach(element => {
        element.addEventListener('click', handleClick)
    });
}

// ha van győrztes minden elemről eltávolítom az eseményfigyelőt
const removeListener = () => {
    document.querySelectorAll('.tictactoe__cell').forEach(element => {
        element.removeListener('click', handleClick)
    });
}

// Megnézem hogy van e olyan sor, ahol minden elem ugyanaz
const checkRowValues = (arr) => {
    const values = arr.map(row =>
        row.every((value) => value === 'X') ||
        row.every((value) => value === 'O'))
    return values.indexOf(true) !== -1 ? true : false;
}

// Megnézem hogy van e olyan oszlop, ahol minden elem ugyanaz

const extractColumns = (arr) => matrix.map((row, mapIndex) => matrix.flat(1).filter((item, index) => (index-mapIndex)%3==0));

const checkColumnValues = (arr) => checkRowValues(extractColumns(arr));

// Megnézem hogy van e olyan átló, ahol minden elem ugyanaz

const extractDiagonals = (arr) => Array(
    matrix.flat(1).filter((item, index) => index%4==0),
    matrix.reduceRight((accumulator, row) => accumulator.concat(row)).filter((item, index) => index%4==0)
    );

const checkDiagonalValues = (arr) => checkRowValues(extractDiagonals(arr));

const checkWinner = () => {
    if (checkRowValues(matrix) || checkColumnValues(matrix) || checkDiagonalValues(matrix)) {
        setMark();
        announceWinner();
        removeRemainingEventlisteners();
        activateNewGameClick();
    } else if (stepCount == 9) {
        announceTie();
        removeRemainingEventlisteners();
        activateNewGameClick();
    } else {
        waitForNextMove();
    }
}

const waitForNextMove = () => feedback=`Waiting for player using symbol "${mark}"`;

const announceWinner = () => feedback=`Player using symbol "${mark}" won the game. Click on this message to start a new game!`;

const announceTie = () => feedback=`It's a tie. Click on this message to start a new game!`

const giveFeedback = () => {
    document.querySelector('.messageArea').textContent=feedback;
}

const removeRemainingEventlisteners = () => {
    document.querySelectorAll('.tictactoe__cell').forEach(element => {
        element.removeEventListener('click', handleClick)
    });
}

const activateNewGameClick = () => {
    document.querySelectorAll('.messageArea').forEach(element => {
        element.addEventListener('click', askForNewGame)
    });
}

const deactivateNewGameClick = () => {
    document.querySelectorAll('.messageArea').forEach(element => {
        element.removeEventListener('click', askForNewGame)
    });
}

const eraseTable = () =>{
    document.querySelectorAll('.tictactoe__cell').forEach(element => {
        element.textContent = '';
    });
}

const askForNewGame = () => {
    deactivateNewGameClick();
    initState();
    stepCount = 0;
    mark = 'X';
    eraseTable();
    checkWinner();
    giveFeedback();
    addListener();
}

initState();
addListener();