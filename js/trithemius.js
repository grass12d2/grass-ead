// ==================== MÃ HOÁ / GIẢI MÃ ====================

function trithemiusEncrypt(text) {
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    let cleanInput = '';
    for (let char of text.toUpperCase()) {
        if (upper.includes(char)) {
            cleanInput += char;
        }
    }

    let result = '';
    const len = upper.length;

    let position = 0;
    for (let char of cleanInput) {
        const shift = position;
        position++;

        const index = upper.indexOf(char);
        result += upper[(index + shift) % len];
    }
    return result;
}

function trithemiusDecrypt(text) {
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    let cleanInput = '';
    for (let char of text.toUpperCase()) {
        if (upper.includes(char)) {
            cleanInput += char;
        }
    }

    let result = '';
    const len = upper.length;

    let position = 0;
    for (let char of cleanInput) {
        const shift = position;
        position++;

        const index = upper.indexOf(char);
        result += upper[((index - shift) % len + len) % len];
    }
    return result;
}

// ==================== BẢNG MẶC ĐỊNH MÃ HOÁ (shift tăng) ====================

function renderBaseEncryptTable() {
    const container = document.getElementById('trithemius-table');
    if (!container) return;

    const upper = GrassEAD.RUSSIAN_ALPHABET;

    let html = `
        <div class="mb-3">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white">
                Bảng Trithemius cơ bản - Mã hoá (shift tăng dần)
            </h3>
        </div>
        <div class="overflow-auto max-h-[600px]">
            <table class="table-encrypt">
                <thead class="sticky top-0 z-20">
                    <tr>
                        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">#</th>
    `;

    for (let i = 1; i <= 32; i++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 text-xs border border-indigo-300 dark:border-indigo-800">${i}</th>`;
    }
    html += `</tr>
    <tr>
        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">А-Я</th>`;

    for (let col = 0; col < 32; col++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-800">${upper[col]}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let row = 0; row < 32; row++) {
        html += `<tr>`;
        html += `<td class="font-bold bg-indigo-100 dark:bg-indigo-900/50 text-center sticky left-0 z-10 border border-indigo-200 dark:border-indigo-800">${row + 1}</td>`;

        for (let col = 0; col < 32; col++) {
            const index = (col + row) % 32;
            const char = upper[index];
            html += `
                <td class="text-center text-sm border border-indigo-100 dark:border-indigo-900/30">
                    ${char}
                </td>
            `;
        }
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== BẢNG MẶC ĐỊNH GIẢI MÃ (shift giảm) ====================

function renderBaseDecryptTable() {
    const container = document.getElementById('trithemius-table');
    if (!container) return;

    const upper = GrassEAD.RUSSIAN_ALPHABET;

    let html = `
        <div class="mb-3">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white">
                Bảng Trithemius cơ bản - Giải mã (shift giảm dần)
            </h3>
        </div>
        <div class="overflow-auto max-h-[600px]">
            <table class="table-encrypt">
                <thead class="sticky top-0 z-20">
                    <tr>
                        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">#</th>
    `;

    for (let i = 1; i <= 32; i++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 text-xs border border-indigo-300 dark:border-indigo-800">${i}</th>`;
    }
    html += `</tr>
    <tr>
        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">А-Я</th>`;

    for (let col = 0; col < 32; col++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-800">${upper[col]}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let row = 0; row < 32; row++) {
        html += `<tr>`;
        html += `<td class="font-bold bg-indigo-100 dark:bg-indigo-900/50 text-center sticky left-0 z-10 border border-indigo-200 dark:border-indigo-800">${row + 1}</td>`;

        for (let col = 0; col < 32; col++) {
            const index = ((col - row) % 32 + 32) % 32;
            const char = upper[index];
            html += `
                <td class="text-center text-sm border border-indigo-100 dark:border-indigo-900/30">
                    ${char}
                </td>
            `;
        }
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== BẢNG MÃ HOÁ (có ký tự) ====================

function renderEncryptTable(text) {
    const container = document.getElementById('trithemius-table');
    if (!container) return;

    const upper = GrassEAD.RUSSIAN_ALPHABET;

    let cleanText = '';
    for (let char of text.toUpperCase()) {
        if (upper.includes(char)) {
            cleanText += char;
        }
    }

    if (cleanText.length === 0) {
        renderBaseEncryptTable();
        return;
    }

    let html = `
        <div class="mb-3">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white">
                Bảng mã hoá Trithemius
            </h3>
        </div>
        <div class="overflow-auto max-h-[600px]">
            <table class="table-encrypt">
                <thead class="sticky top-0 z-20">
                    <tr>
                        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">#</th>
    `;

    for (let i = 1; i <= 32; i++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 text-xs border border-indigo-300 dark:border-indigo-800">${i}</th>`;
    }
    html += `</tr>
    <tr>
        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">А-Я</th>`;

    for (let col = 0; col < 32; col++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-800">${upper[col]}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let row = 0; row < cleanText.length; row++) {
        const shift = row % 32;
        const inputChar = cleanText[row];
        const inputIndex = upper.indexOf(inputChar);

        if (inputIndex === -1) continue;

        const outputIndex = (inputIndex + shift) % 32;

        // Bảng mã hoá: tại cột col, ký tự hiển thị là upper[(col + shift) % 32]
        // → cột của input: (inputIndex - shift + 32) % 32
        // → cột của output: (outputIndex - shift + 32) % 32
        const inputCol = ((inputIndex - shift) % 32 + 32) % 32;
        const outputCol = ((outputIndex - shift) % 32 + 32) % 32;

        html += `<tr>`;
        html += `<td class="font-bold bg-indigo-100 dark:bg-indigo-900/50 text-center sticky left-0 z-10 border border-indigo-200 dark:border-indigo-800">${row + 1}</td>`;

        for (let col = 0; col < 32; col++) {
            const index = (col + shift) % 32;
            const char = upper[index];

            const isInput = col === inputCol;
            const isOutput = col === outputCol;

            let cellClass = 'text-center text-sm border border-indigo-100 dark:border-indigo-900/30';
            if (isInput && isOutput) {
                cellClass += ' bg-purple-500 dark:bg-purple-600 font-bold text-white';
            } else if (isInput) {
                cellClass += ' bg-blue-500 dark:bg-blue-600 font-bold text-white';
            } else if (isOutput) {
                cellClass += ' bg-green-500 dark:bg-green-600 font-bold text-white';
            }

            html += `<td class="${cellClass}">${char}</td>`;
        }
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
            <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                <span><span class="inline-block w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></span> Ký tự gốc</span>
                <span><span class="inline-block w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></span> Ký tự mã hoá</span>
                <span><span class="inline-block w-4 h-4 bg-purple-500 dark:bg-purple-600 rounded"></span> Trùng nhau</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== BẢNG GIẢI MÃ (có ký tự) ====================

function renderDecryptTable(text) {
    const container = document.getElementById('trithemius-table');
    if (!container) return;

    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const len = upper.length;

    let cleanText = '';
    for (let char of text.toUpperCase()) {
        if (upper.includes(char)) {
            cleanText += char;
        }
    }

    if (cleanText.length === 0) {
        renderBaseDecryptTable();
        return;
    }

    let html = `
        <div class="mb-3">
            <h3 class="text-md font-semibold text-gray-900 dark:text-white">
                Bảng giải mã Trithemius
            </h3>
        </div>
        <div class="overflow-auto max-h-[600px]">
            <table class="table-encrypt">
                <thead class="sticky top-0 z-20">
                    <tr>
                        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">#</th>
    `;

    for (let i = 1; i <= 32; i++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 text-xs border border-indigo-300 dark:border-indigo-800">${i}</th>`;
    }
    html += `</tr>
    <tr>
        <th class="bg-indigo-200 dark:bg-indigo-900 sticky left-0 z-30 border border-indigo-300 dark:border-indigo-800 text-xs">А-Я</th>`;

    for (let col = 0; col < 32; col++) {
        html += `<th class="bg-indigo-200 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-800">${upper[col]}</th>`;
    }
    html += `</tr></thead><tbody>`;

    for (let row = 0; row < cleanText.length; row++) {
        const shift = row % 32;
        const inputChar = cleanText[row];
        const inputIndex = upper.indexOf(inputChar);

        if (inputIndex === -1) continue;

        const outputIndex = ((inputIndex - shift) % len + len) % len;

        // Bảng giải mã: tại cột col, ký tự hiển thị là upper[(col - shift + 32) % 32]
        // → cột của input: (inputIndex + shift) % 32
        // → cột của output: (outputIndex + shift) % 32
        const inputCol = (inputIndex + shift) % 32;
        const outputCol = (outputIndex + shift) % 32;

        html += `<tr>`;
        html += `<td class="font-bold bg-indigo-100 dark:bg-indigo-900/50 text-center sticky left-0 z-10 border border-indigo-200 dark:border-indigo-800">${row + 1}</td>`;

        for (let col = 0; col < 32; col++) {
            const index = ((col - shift) % 32 + 32) % 32;
            const char = upper[index];

            const isInput = col === inputCol;
            const isOutput = col === outputCol;

            let cellClass = 'text-center text-sm border border-indigo-100 dark:border-indigo-900/30';
            if (isInput && isOutput) {
                cellClass += ' bg-purple-500 dark:bg-purple-600 font-bold text-white';
            } else if (isInput) {
                cellClass += ' bg-blue-500 dark:bg-blue-600 font-bold text-white';
            } else if (isOutput) {
                cellClass += ' bg-green-500 dark:bg-green-600 font-bold text-white';
            }

            html += `<td class="${cellClass}">${char}</td>`;
        }
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
            <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                <span><span class="inline-block w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded"></span> Ký tự mã hoá</span>
                <span><span class="inline-block w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></span> Ký tự gốc</span>
                <span><span class="inline-block w-4 h-4 bg-purple-500 dark:bg-purple-600 rounded"></span> Trùng nhau</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ==================== HÀM TỔNG ====================

function updateTrithemiusTable(text, isDecrypt) {
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    let cleanText = '';
    for (let char of text.toUpperCase()) {
        if (upper.includes(char)) {
            cleanText += char;
        }
    }

    if (cleanText.length === 0) {
        if (isDecrypt) {
            renderBaseDecryptTable();
        } else {
            renderBaseEncryptTable();
        }
        return;
    }

    if (isDecrypt) {
        renderDecryptTable(text);
    } else {
        renderEncryptTable(text);
    }
}

// ==================== DOM ====================

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('trithemius-input');
    const output = document.getElementById('trithemius-output');
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
                ? 'Nhập văn bản tiếng Nga (ví dụ: ПРИВЕТ)'
                : 'Nhập text đã mã hoá';
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
        const upper = GrassEAD.RUSSIAN_ALPHABET;
        let filtered = '';
        for (let char of text.toUpperCase()) {
            if (upper.includes(char) || char === ' ') {
                filtered += char;
            }
        }
        if (filtered !== text) {
            event.target.value = filtered;
        }
        updateOutput();
    }

    function updateOutput() {
        if (!input || !output) return;
        const text = input.value;
        const isDecrypt = currentMode === 'decrypt';

        updateTrithemiusTable(text, isDecrypt);

        if (!text) {
            output.value = '';
            return;
        }

        let result;
        if (currentMode === 'encrypt') {
            result = trithemiusEncrypt(text);
            result = GrassEAD.formatResult(result);
        } else {
            result = trithemiusDecrypt(text);
        }
        output.value = result;
    }

    if (input) {
        input.addEventListener('input', handleInput);
        input.addEventListener('paste', function (e) {
            setTimeout(() => {
                const text = this.value;
                const upper = GrassEAD.RUSSIAN_ALPHABET;
                let filtered = '';
                for (let char of text.toUpperCase()) {
                    if (upper.includes(char) || char === ' ') {
                        filtered += char;
                    }
                }
                if (filtered !== text) {
                    this.value = filtered;
                }
                updateOutput();
            }, 10);
        });
    }

    if (modeEncrypt) {
        modeEncrypt.addEventListener('click', function () {
            if (currentMode !== 'encrypt') {
                currentMode = 'encrypt';
                updateUI();
                updateOutput();
            }
        });
    }

    if (modeDecrypt) {
        modeDecrypt.addEventListener('click', function () {
            if (currentMode !== 'decrypt') {
                currentMode = 'decrypt';
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
            GrassEAD.showMessage('🗑️ Đã xoá nội dung!', 'info');
            updateOutput();
        });
    }

    updateUI();
    renderBaseEncryptTable();
});