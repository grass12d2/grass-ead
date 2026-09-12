const POLYBIUS_GRID = [
    ['А', 'Б', 'В', 'Г', 'Д', 'Е'],
    ['Ж', 'З', 'И', 'Й', 'К', 'Л'],
    ['М', 'Н', 'О', 'П', 'Р', 'С'],
    ['Т', 'У', 'Ф', 'Х', 'Ц', 'Ч'],
    ['Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э'],
    ['Ю', 'Я', '-', '-', '-', '-']
];

const charToCoords = {};
const coordsToChar = {};

for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
        const char = POLYBIUS_GRID[row][col];
        const key = `${row + 1}${col + 1}`;
        charToCoords[char] = key;
        if (char !== '-') {
            charToCoords[char.toLowerCase()] = key;
        }
        coordsToChar[key] = char;
    }
}

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

    // Lọc chỉ lấy số và dấu cách
    const cleanText = text.replace(/[^0-9\s]/g, '');

    // Kiểm tra số không hợp lệ (7,8,9,0)
    const invalidNumbers = cleanText.match(/[7-9]/g);
    if (invalidNumbers) {
        const invalidChars = [...new Set(invalidNumbers)].join(', ');
        GrassEAD.showMessage(`Số không hợp lệ: ${invalidChars}. Chỉ chấp nhận số 1-6!`, 'error');
        // Loại bỏ các số không hợp lệ và tiếp tục
        const filteredText = cleanText.replace(/[7-9]/g, '').replace(/0/g, '');
        const pairs = filteredText.match(/\d\d/g);
        if (!pairs) return text;
        for (let pair of pairs) {
            if (coordsToChar[pair]) {
                result += coordsToChar[pair];
            } else {
                result += pair;
            }
        }
        return result;
    }

    // Kiểm tra số 0
    const zeroNumbers = cleanText.match(/0/g);
    if (zeroNumbers) {
        GrassEAD.showMessage('Số 0 không hợp lệ! Chỉ chấp nhận số 1-6!', 'error');
        const filteredText = cleanText.replace(/0/g, '');
        const pairs = filteredText.match(/\d\d/g);
        if (!pairs) return text;
        for (let pair of pairs) {
            if (coordsToChar[pair]) {
                result += coordsToChar[pair];
            } else {
                result += pair;
            }
        }
        return result;
    }

    // Xử lý bình thường
    const pairs = cleanText.match(/\d\d/g);
    if (!pairs) return text;
    for (let pair of pairs) {
        if (coordsToChar[pair]) {
            result += coordsToChar[pair];
        } else {
            result += pair;
        }
    }
    return result;
}

// Render bảng Polybius 6x6
function renderPolybiusGrid() {
    const container = document.getElementById('polybius-grid');
    if (!container) return;

    let html = `
        <div class="overflow-x-auto">
            <table class="table-encrypt">
                <thead>
                    <tr>
                         <th class="bg-green-100 dark:bg-green-900/30"></th>
    `;

    // Header cột: số 1-6 giống style của số hàng
    for (let col = 1; col <= 6; col++) {
        html += `<th class="bg-green-100 dark:bg-green-900/30 font-bold text-black dark:text-white text-center text-sm">${col}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let row = 0; row < 6; row++) {
        html += `<tr>`;
        // Số hàng: giữ nguyên làm chuẩn
        html += `<td class="font-bold bg-green-100 dark:bg-green-900/30 text-center text-black dark:text-white">${row + 1}</td>`;

        for (let col = 0; col < 6; col++) {
            const char = POLYBIUS_GRID[row][col];
            const isSpecial = char === '-';
            html += `
                <td class="${isSpecial ? 'text-gray-400 dark:text-gray-600' : 'font-bold text-black dark:text-white'} text-center">
                    ${char}
                    ${!isSpecial ? `<span class="text-xs text-gray-500 dark:text-gray-400 block">${row + 1}${col + 1}</span>` : ''}
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

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('polybius-input');
    const output = document.getElementById('polybius-output');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const modeEncrypt = document.getElementById('mode-encrypt');
    const modeDecrypt = document.getElementById('mode-decrypt');
    const pasteBtn = document.getElementById('paste-btn');
    const copyInputBtn = document.getElementById('copy-input-btn');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentMode = 'encrypt';

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
                : 'Nhập văn bản đã mã hoá (ví dụ: 33353 42326 33332 6)';
        }

        if (modeEncrypt && modeDecrypt) {
            if (isEncrypt) {
                modeEncrypt.className = 'px-4 py-2 bg-purple-600 border-2 border-purple-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md';
                modeDecrypt.className = 'px-4 py-2 bg-transparent border-2 border-teal-500 text-teal-500 dark:text-teal-400 rounded-lg text-sm font-medium transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20';
            } else {
                modeDecrypt.className = 'px-4 py-2 bg-teal-500 border-2 border-teal-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md';
                modeEncrypt.className = 'px-4 py-2 bg-transparent border-2 border-purple-500 text-purple-500 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20';
            }
        }
    }

    function handleInput(event) {
        const text = event.target.value;

        if (currentMode === 'decrypt') {
            // Chế độ giải mã: chỉ cho phép số, dấu cách, dấu phẩy
            let processed = text.replace(/,/g, ' ');
            processed = processed.replace(/[^0-9\s]/g, '');

            if (processed !== text) {
                event.target.value = processed;
            }
            updateOutput();
        } else {
            // Chế độ mã hoá: xử lý như bình thường
            const processed = GrassEAD.handleTextInput(text, true);
            if (processed !== text) {
                event.target.value = processed;
            }
            updateOutput();
        }
    }

    function updateOutput() {
        if (!input || !output) return;
        const text = input.value;
        if (!text) {
            output.value = '';
            renderPolybiusGrid();
            return;
        }
        let result;
        if (currentMode === 'encrypt') {
            result = polybiusEncrypt(text);
        } else {
            const cleanText = text.replace(/,/g, ' ');
            result = polybiusDecrypt(cleanText);
        }
        output.value = result;
        renderPolybiusGrid();
    }

    if (input) {
        input.addEventListener('input', handleInput);
        input.addEventListener('paste', function (e) {
            setTimeout(() => {
                const text = this.value;

                if (currentMode === 'decrypt') {
                    // Chế độ giải mã
                    let processed = text.replace(/,/g, ' ');
                    processed = processed.replace(/[^0-9\s]/g, '');

                    if (processed !== text) {
                        this.value = processed;
                    }
                } else {
                    // Chế độ mã hoá
                    const processed = GrassEAD.handleTextInput(text, true);
                    if (processed !== text) {
                        this.value = processed;
                    }
                }
                updateOutput();
            }, 10);
        });
    }

    if (modeEncrypt) {
        modeEncrypt.addEventListener('click', function () {
            if (currentMode !== 'encrypt') {
                currentMode = 'encrypt';
                // Xoá input khi chuyển mode
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
                // Xoá input khi chuyển mode
                if (input) input.value = '';
                if (output) output.value = '';
                updateUI();
                updateOutput();
            }
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