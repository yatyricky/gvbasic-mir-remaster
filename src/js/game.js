import { setupKeyboardControls } from "./input";
import { waitForSeconds } from "./utils";

const SIZE = Math.min(Math.floor(window.innerWidth / 20), 20);
const SIZE2 = SIZE * 2;

const container = document.getElementById('app');
container.style.width = `${SIZE * 20}px`;
container.style.height = `${SIZE2 * 5}px`;
const slots = [];
for (let i = 0; i < 5; i++) {
    const tr = document.createElement('tr');
    const row = [];
    for (let j = 0; j < 20; j++) {
        const td = document.createElement('td');
        td.style.left = `${j * SIZE}px`;
        if (j === 19) {
            td.style.width = `${SIZE}px`;
        }
        td.style.height = `${SIZE2}px`;
        td.style.lineHeight = `${SIZE2}px`;
        td.style.fontSize = `${Math.round(SIZE2 * 0.64)}px`;
        row.push(td);
        tr.appendChild(td);
    }
    slots.push(row);
    container.appendChild(tr);
}

const l1 = document.getElementById('l1');
const l2 = document.getElementById('l2');
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const btnU = document.getElementById('btn_up');
const btnD = document.getElementById('btn_down');
const btnL = document.getElementById('btn_left');
const btnR = document.getElementById('btn_right');
const btnA = document.getElementById('btn_a');
const btnB = document.getElementById('btn_b');
const btnX = document.getElementById('btn_x');
const btnY = document.getElementById('btn_y');

const cu = Math.round(SIZE * 20 / 7);

c1.style.top = `${SIZE2 * 5 + cu}px`;
c2.style.top = `${SIZE2 * 5 + cu}px`;
c2.style.left = `${cu * 3}px`;

function setDOMRect(dom, x, y, w, h) {
    dom.style.left = `${x}px`;
    dom.style.top = `${y}px`;
    dom.style.width = `${w}px`;
    dom.style.height = `${h}px`;
}

setDOMRect(l1, cu * 0, cu, cu * 3, cu);
setDOMRect(l2, cu * 1, 0, cu, cu * 3);
setDOMRect(btnU, cu * 1, 0, cu, cu);
setDOMRect(btnD, cu * 1, cu * 2, cu, cu);
setDOMRect(btnL, cu * 0, cu, cu, cu);
setDOMRect(btnR, cu * 2, cu, cu, cu);
setDOMRect(btnY, cu * 2, 0, cu, cu);
setDOMRect(btnA, cu * 2, cu * 2, cu, cu);
setDOMRect(btnX, cu, cu, cu, cu);
setDOMRect(btnB, cu * 3, cu, cu, cu);

setupKeyboardControls(btnU, btnD, btnL, btnR, btnA, btnB, btnX, btnY);

function render(text) {
    for (const row of slots) {
        for (const td of row) {
            td.innerText = '';
            td.style.display = 'none';
        }
    }

    let x = 0;
    let y = 0;

    function fillPreviousLine() {
        if (x >= 20) {
            return;
        }
        const td = slots[y][x];
        td.style.display = 'block';
        td.style.width = `${(20 - x) * SIZE}px`;
        td.style.left = `${x * SIZE}px`;
    }
    for (const c of text) {
        if (c === '\n') {
            fillPreviousLine();
            y++;
            x = 0;
            continue;
        }

        const charOccupy = c.charCodeAt(0) > 255 ? 2 : 1;
        if (x + charOccupy > 20) {
            fillPreviousLine();
            y++;
            x = 0;
        }

        if (y >= 5) {
            break;
        }

        const td = slots[y][x];
        td.innerText = c;
        td.style.display = 'block';
        td.style.width = `${charOccupy * SIZE}px`;
        td.style.left = `${x * SIZE}px`;

        x += charOccupy;
    }
    while (y < 5) {
        fillPreviousLine();
        y++;
        x = 0;
    }
}

// Example 1: Using the custom pixel text function
const textDisplay = '   lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function shuffleString(str) {
    // Use Array.from with a string to properly split by unicode characters
    // This correctly handles emojis and other surrogate pairs
    const arr = Array.from(str);

    // Fisher-Yates shuffle algorithm
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.join('');
}

render(textDisplay);

btnU.onclick = () => {
    let x = localStorage.getItem("save");
    if (x == null) {
        x = 0;
    } else {
        x = parseInt(x);
    }
    x++;
    localStorage.setItem("save", x.toString());
    
    console.log('btnU');
};
btnD.onclick = () => {
    console.log('btnD');
};
btnL.onclick = () => {
    console.log('btnL');
};
btnR.onclick = () => {
    console.log('btnR');
};
btnA.onclick = () => {
    render(localStorage.getItem("save") + ":" + shuffleString(textDisplay));
};
btnB.onclick = () => {
    console.log('btnB');
};
btnX.onclick = () => {
    console.log('btnX');
};
btnY.onclick = () => {
    console.log('btnY');
};

async function main() {
    
}

main();
