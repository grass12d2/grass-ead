const POLYBIUS_GRID = [
    ['А', 'Б', 'В', 'Г', 'Д', 'Е'],
    ['Ж', 'З', 'И', 'Й', 'К', 'Л'],
    ['М', 'Н', 'О', 'П', 'Р', 'С'],
    ['Т', 'У', 'Ф', 'Х', 'Ц', 'Ч'],
    ['Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э'],
    ['Ю', 'Я', '–', '–', '–', '–']
];

const charToCoords = {};
const coordsToChar = {};

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
        const char = POLYBIUS_GRID[row][col];
        const key = `${row + 1}${col + 1}`;
        charToCoords[char] = key;
        if (char !== '–') {
            charToCoords[char.toLowerCase()] = key;
        }
        coordsToChar[key] = char;
    }
}

const INVALID_PAIRS = ['63', '64', '65', '66'];

function polybiusEncrypt(text) {
    const processed = GrassEAD.processInput(text);
    let result = '';
    for (let char of processed) {
        if (charToCoords[char]) {
            result += charToCoords[char];
        } else {
            result += char;
        }
    }
    return GrassEAD.formatPolybiusResult(result);
}

function polybiusDecrypt(text) {
    let result = '';
    const cleanText = text.replace(/[^0-9]/g, '');
    const pairs = cleanText.match(/\d\d/g);
    if (!pairs) return '';
    for (let pair of pairs) {
        if (coordsToChar[pair] && coordsToChar[pair] !== '–') {
            result += coordsToChar[pair];
        } else {
            result += '–';
        }
    }
    return result;
}

// Lấy danh sách items cho bảng chi tiết
function getDetailItems() {
    const input = document.getElementById('polybius-input');
    if (!input) return [];
    const text = input.value;
    if (!text || text.trim() === '') return [];

    const items = [];

    if (currentModeGlobal === 'encrypt') {
        const processed = GrassEAD.processInput(text);
        for (let char of processed) {
            if (char === ' ') continue;
            const pair = charToCoords[char] || '';
            items.push({ input: char, output: pair, isInvalid: false });
        }
    } else {
        const cleanText = text.replace(/[^0-9]/g, '');
        const pairs = cleanText.match(/\d\d/g) || [];
        for (let pair of pairs) {
            const isInvalid = INVALID_PAIRS.includes(pair);
            const char = coordsToChar[pair];
            const output = (char && char !== '–') ? char : '–';
            items.push({ input: pair, output: output, isInvalid: isInvalid });
        }
    }

    return items;
}

// Render bảng chi tiết (ngang)
function renderDetailHorizontal() {
    const container = document.getElementById('polybius-detail');
    if (!container) return;

    const items = getDetailItems();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle text-xl mb-2 block"></i>
                <p class="text-sm">Nhập văn bản để xem chi tiết từng ký tự</p>
            </div>
        `;
        return;
    }

    const isEncrypt = currentModeGlobal === 'encrypt';
    const label1 = isEncrypt ? 'Gốc' : 'Mã hoá';
    const label2 = isEncrypt ? 'Mã hoá' : 'Gốc';

    let html = `
        <div class="overflow-x-auto pb-3">
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-green-100 dark:bg-green-900/30 min-w-[60px] sticky left-0 z-20">Vị trí</th>
    `;

    items.forEach((item, index) => {
        html += `
            <th class="${item.isInvalid ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'} min-w-[70px]">
                ${index + 1}
            </th>
        `;
    });

    html += `</tr></thead><tbody>`;

    // Hàng 1: input (label sticky)
    html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm sticky left-0 z-10 min-w-[60px]">${label1}</td>`;
    items.forEach(item => {
        if (item.isInvalid) {
            html += `
                <td class="font-mono font-bold text-red-600 dark:text-red-400 text-center text-base">
                    ${item.input}
                </td>
            `;
        } else {
            html += `
                <td class="font-mono font-bold text-gray-900 dark:text-white text-center text-base">
                    ${item.input}
                </td>
            `;
        }
    });
    html += `</tr>`;

    // Hàng 2: output (label sticky) — màu text-green-600
    html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm sticky left-0 z-10 min-w-[60px]">${label2}</td>`;
    items.forEach(item => {
        if (item.isInvalid) {
            html += `
                <td class="font-bold text-red-600 dark:text-red-400 text-center text-base">
                    ${item.output}
                </td>
            `;
        } else {
            html += `
                <td class="font-bold text-green-600 dark:text-green-400 text-center text-base">
                    ${item.output}
                </td>
            `;
        }
    });
    html += `</tr>`;

    container.innerHTML = html;
}

// Render bảng chi tiết (dọc)
function renderDetailVertical() {
    const container = document.getElementById('polybius-detail');
    if (!container) return;

    const items = getDetailItems();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="text-center py-6 text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle text-xl mb-2 block"></i>
                <p class="text-sm">Nhập văn bản để xem chi tiết từng ký tự</p>
            </div>
        `;
        return;
    }

    const isEncrypt = currentModeGlobal === 'encrypt';
    const label1 = isEncrypt ? 'Gốc' : 'Mã hoá';
    const label2 = isEncrypt ? 'Mã hoá' : 'Gốc';

    let html = `
        <div class="overflow-y-auto max-h-[500px] rounded-lg">
            <table class="table-encrypt">
                <thead class="sticky top-0">
                    <tr>
                        <th class="bg-green-100 dark:bg-green-900/30 min-w-[60px]">Vị trí</th>
                        <th class="bg-green-100 dark:bg-green-900/30 min-w-[90px]">${label1}</th>
                        <th class="bg-green-100 dark:bg-green-900/30 min-w-[90px]">${label2}</th>
                    </tr>
                </thead>
                <tbody>
    `;

    items.forEach((item, index) => {
        if (item.isInvalid) {
            html += `
                <tr class="bg-red-50 dark:bg-red-900/20">
                    <td class="font-bold text-gray-900 dark:text-white text-center">${index + 1}</td>
                    <td class="font-mono font-bold text-red-600 dark:text-red-400 text-center">${item.input}</td>
                    <td class="font-bold text-red-600 dark:text-red-400 text-center">
                        ${item.output}
                    </td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <td class="font-bold text-gray-900 dark:text-white text-center">${index + 1}</td>
                    <td class="font-mono font-bold text-gray-900 dark:text-white text-center">${item.input}</td>
                    <td class="font-bold text-green-600 dark:text-green-400 text-center">${item.output}</td>
                </tr>
            `;
        }
    });

    container.innerHTML = html;
}

function renderDetailTable() {
    if (isVertical) {
        renderDetailVertical();
    } else {
        renderDetailHorizontal();
    }
}

// Render bảng Polybius 6x6
function renderPolybiusGrid() {
    const container = document.getElementById('polybius-grid');
    if (!container) return;

    let html = `
        <div class="overflow-x-auto pb-1">
            <table class="table-encrypt">
                <thead>
                    <tr>
                         <th class="bg-green-100 dark:bg-green-900/30"></th>
    `;

    for (let col = 1; col <= 6; col++) {
        html += `<th class="bg-green-100 dark:bg-green-900/30 font-bold text-black dark:text-white text-center text-sm">${col}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let row = 0; row < 6; row++) {
        html += `<tr>`;
        html += `<td class="font-bold bg-green-100 dark:bg-green-900/30 text-center text-black dark:text-white">${row + 1}</td>`;

        for (let col = 0; col < 6; col++) {
            const char = POLYBIUS_GRID[row][col];
            const isSpecial = char === '–';
            const cellKey = `${row + 1}${col + 1}`;
            const isInvalid = isSpecial;

            html += `
                <td class="font-bold ${isInvalid ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' : 'text-black dark:text-white'} text-center">
                    ${char}
                    <span class="text-xs ${isInvalid ? 'text-red-400 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} block">${cellKey}</span>
                </td>
            `;
        }
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
            <p class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                <i class="fas fa-info-circle mr-1"></i>
                Mỗi chữ cái → cặp số (hàng, cột). Ví dụ: А = 11, Б = 12, Я = 62
                <br>
                Kết quả được chia thành cụm 5 số, cách nhau bằng dấu cách.
                <br>
                <span class="text-red-500 dark:text-red-400">Chỉ chấp nhận số 1-6</span>
            </p>
        </div>
    `;

    container.innerHTML = html;
}

let currentModeGlobal = 'encrypt';
let isVertical = false;

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('polybius-input');
    const output = document.getElementById('polybius-output');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const modeEncrypt = document.getElementById('mode-encrypt');
    const modeDecrypt = document.getElementById('mode-decrypt');
    const viewToggle = document.getElementById('view-toggle');
    const detailViewLabel = document.getElementById('detail-view-label');
    const pasteBtn = document.getElementById('paste-btn');
    const copyInputBtn = document.getElementById('copy-input-btn');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentMode = 'encrypt';
    currentModeGlobal = currentMode;

    function updateUI() {
        const isEncrypt = currentMode === 'encrypt';

        if (inputLabel) {
            inputLabel.textContent = isEncrypt ? 'Văn bản gốc' : 'Văn bản mã hoá';
        }
        if (outputLabel) {
            outputLabel.textContent = isEncrypt ? 'Văn bản mã hoá' : 'Văn bản gốc';
        }
        if (input) {
            input.placeholder = isEncrypt
                ? 'Nhập văn bản tiếng Nga cần mã hoá (ví dụ: ПРИВЕТ)'
                : 'Nhập các cặp số 1-6 (ví dụ: 33 35 34 23 26)';
        }

        if (modeEncrypt && modeDecrypt) {
            if (isEncrypt) {
                modeEncrypt.className = 'px-4 py-2 bg-red-500 border-2 border-red-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md';
                modeDecrypt.className = 'px-4 py-2 bg-transparent border-2 border-blue-400 text-blue-500 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20';
            } else {
                modeDecrypt.className = 'px-4 py-2 bg-blue-500 border-2 border-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md';
                modeEncrypt.className = 'px-4 py-2 bg-transparent border-2 border-red-400 text-red-500 dark:text-red-400 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20';
            }
        }

        if (viewToggle) {
            viewToggle.innerHTML = isVertical
                ? '<i class="fas fa-sync-alt"></i><span class="view-toggle-text">Xem ngang</span>'
                : '<i class="fas fa-sync-alt"></i><span class="view-toggle-text">Xem dọc</span>';
        }
        if (detailViewLabel) {
            detailViewLabel.textContent = isVertical ? '(Dọc)' : '(Ngang)';
        }
    }

    function processDecryptInput(rawText, cursorPos) {
        const digits = [];
        const invalidChars = [];

        for (let char of rawText) {
            if (char >= '1' && char <= '6') {
                digits.push(char);
            } else if (char >= '0' && char <= '9') {
                invalidChars.push(char);
            }
        }

        if (invalidChars.length > 0) {
            const uniqueInvalid = [...new Set(invalidChars)].join(', ');
            GrassEAD.showMessage(
                `Số "${uniqueInvalid}" không hợp lệ. Chỉ chấp nhận số 1-6!`,
                'error'
            );
        }

        let formatted = '';
        for (let i = 0; i < digits.length; i++) {
            formatted += digits[i];
            if (i % 2 === 1 && i < digits.length - 1) {
                formatted += ' ';
            }
        }

        let digitsBeforeCursor = 0;
        for (let i = 0; i < cursorPos && i < rawText.length; i++) {
            if (rawText[i] >= '1' && rawText[i] <= '6') {
                digitsBeforeCursor++;
            }
        }

        let newCursorPos = 0;
        let digitsSeen = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (digitsSeen === digitsBeforeCursor) {
                newCursorPos = i;
                break;
            }
            if (formatted[i] >= '1' && formatted[i] <= '6') {
                digitsSeen++;
            }
            newCursorPos = i + 1;
        }
        if (digitsBeforeCursor >= digits.length) {
            newCursorPos = formatted.length;
        }

        return { formatted, cursorPos: newCursorPos };
    }

    function handleInput(event) {
        const text = event.target.value;

        if (currentMode === 'decrypt') {
            const cursorPos = event.target.selectionStart;
            const { formatted, cursorPos: newCursorPos } = processDecryptInput(text, cursorPos);
            if (formatted !== text) {
                event.target.value = formatted;
                event.target.setSelectionRange(newCursorPos, newCursorPos);
            }
            updateOutput();
        } else {
            GrassEAD.handleTextInputWithCursor(event.target, true);
            updateOutput();
        }
    }

    function updateOutput() {
        if (!input || !output) return;
        const text = input.value;
        if (!text) {
            output.value = '';
            renderPolybiusGrid();
            renderDetailTable();
            return;
        }
        let result;
        if (currentMode === 'encrypt') {
            result = polybiusEncrypt(text);
        } else {
            result = polybiusDecrypt(text);
        }
        output.value = result;
        renderPolybiusGrid();
        renderDetailTable();
    }

    if (input) {
        input.addEventListener('input', handleInput);

        input.addEventListener('paste', function (e) {
            setTimeout(() => {
                if (currentMode === 'decrypt') {
                    const cursorPos = this.selectionStart;
                    const { formatted, cursorPos: newCursorPos } = processDecryptInput(this.value, cursorPos);
                    if (formatted !== this.value) {
                        this.value = formatted;
                        this.setSelectionRange(newCursorPos, newCursorPos);
                    }
                } else {
                    GrassEAD.handleTextInputWithCursor(this, true);
                }
                updateOutput();
            }, 10);
        });
    }

    if (modeEncrypt) {
        modeEncrypt.addEventListener('click', function () {
            if (currentMode !== 'encrypt') {
                currentMode = 'encrypt';
                currentModeGlobal = currentMode;
                if (input) input.value = '';
                if (output) output.value = '';
                updateUI();
                updateOutput();
            }
        });
    }

    if (modeDecrypt) {
        modeDecrypt.addEventListener('click', function () {
            if (currentMode !== 'decrypt') {
                currentMode = 'decrypt';
                currentModeGlobal = currentMode;
                if (input) input.value = '';
                if (output) output.value = '';
                updateUI();
                updateOutput();
            }
        });
    }

    if (viewToggle) {
        viewToggle.addEventListener('click', function () {
            isVertical = !isVertical;
            updateUI();
            renderDetailTable();
        });
    }

    if (pasteBtn) {
        pasteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            GrassEAD.pasteText(input);
        });
    }

    if (copyInputBtn) {
        copyInputBtn.addEventListener('click', function (e) {
            e.preventDefault();
            GrassEAD.copyText(input.value);
        });
    }

    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', function (e) {
            e.preventDefault();
            GrassEAD.copyText(output.value);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (input) {
                input.value = '';
            }
            if (output) {
                output.value = '';
            }
            GrassEAD.showMessage('Đã xoá nội dung!', 'info');
            updateOutput();
        });
    }

    updateUI();
    renderPolybiusGrid();
    updateOutput();
});