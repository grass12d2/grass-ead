// Mã hoá Vigenère với khoá tự động (Autokey)
function vigenereAutokeyEncrypt(text, key = 'А') {
    const processed = GrassEAD.processInput(text);
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;

    let initialKey = key.toUpperCase();
    initialKey = initialKey.replace(/[^А-Я0-9]/g, '');
    if (initialKey.length === 0) initialKey = 'А';

    let gamma = initialKey + processed;
    gamma = gamma.slice(0, processed.length);

    let resultText = '';
    for (let i = 0; i < processed.length; i++) {
        const char = processed[i];
        const gammaChar = gamma[i];
        let shift;

        if (gammaChar >= '0' && gammaChar <= '9') {
            shift = parseInt(gammaChar);
        } else {
            shift = upper.indexOf(gammaChar);
            if (shift === -1) shift = 0;
        }

        if (upper.includes(char)) {
            const index = upper.indexOf(char);
            resultText += upper[(index + shift) % len];
        } else if (lower.includes(char)) {
            const index = lower.indexOf(char);
            resultText += lower[(index + shift) % len];
        } else {
            resultText += char;
        }
    }
    return resultText;
}

// Giải mã Vigenère với khoá tự động (Autokey)
function vigenereAutokeyDecrypt(text, key = 'А') {
    const processed = text;
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;

    let initialKey = key.toUpperCase();
    initialKey = initialKey.replace(/[^А-Я0-9]/g, '');
    if (initialKey.length === 0) initialKey = 'А';

    let gamma = initialKey;
    let plaintext = '';

    for (let i = 0; i < processed.length; i++) {
        const char = processed[i];
        const gammaChar = gamma[i];
        let shift;

        if (gammaChar >= '0' && gammaChar <= '9') {
            shift = parseInt(gammaChar);
        } else {
            shift = upper.indexOf(gammaChar);
            if (shift === -1) shift = 0;
        }

        let decryptedChar;
        if (upper.includes(char)) {
            const index = upper.indexOf(char);
            decryptedChar = upper[(index - shift + len) % len];
        } else if (lower.includes(char)) {
            const index = lower.indexOf(char);
            decryptedChar = lower[(index - shift + len) % len];
        } else {
            decryptedChar = char;
        }

        plaintext += decryptedChar;
        gamma += decryptedChar;
    }
    return plaintext;
}

// Tạo bảng Gamma chi tiết cho Vigenère Autokey
function generateAutokeyTable(text, key = 'А') {
    const table = [];
    const upper = GrassEAD.RUSSIAN_ALPHABET;

    let cleanText = text.replace(/\s/g, '');

    let initialKey = key.toUpperCase();
    initialKey = initialKey.replace(/[^А-Я0-9]/g, '');
    if (initialKey.length === 0) initialKey = 'А';

    let gamma = initialKey + cleanText;
    gamma = gamma.slice(0, cleanText.length);

    if (cleanText.length === 0) {
        return [];
    }

    for (let i = 0; i < cleanText.length; i++) {
        const textChar = cleanText[i] || '';
        const gammaChar = gamma[i] || '';
        let shift;
        let shiftType;

        if (gammaChar >= '0' && gammaChar <= '9') {
            shift = parseInt(gammaChar);
            shiftType = 'Số';
        } else {
            shift = upper.indexOf(gammaChar);
            if (shift === -1) shift = 0;
            shiftType = 'Chữ';
        }

        let encryptedChar = '';
        if (upper.includes(textChar)) {
            const index = upper.indexOf(textChar);
            encryptedChar = upper[(index + shift) % upper.length];
        } else {
            encryptedChar = textChar;
        }

        table.push({
            position: i + 1,
            textChar: textChar,
            gammaChar: gammaChar,
            shift: shift,
            shiftType: shiftType,
            encryptedChar: encryptedChar,
            isKeyPart: i < initialKey.length
        });
    }
    return table;
}

// Render bảng Gamma (ngang)
function renderAutokeyTableHorizontal(text = '', key = 'А') {
    const container = document.getElementById('vigenere-table');
    if (!container) return;

    const cleanText = text.replace(/\s/g, '');

    if (!cleanText || cleanText.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle text-2xl mb-2 block"></i>
                <p>Nhập văn bản vào ô bên trái để xem bảng Gamma</p>
                <p class="text-xs mt-1">Gamma = Khoá ban đầu + Văn bản gốc</p>
            </div>
        `;
        return;
    }

    const table = generateAutokeyTable(text, key);

    let html = `
        <div class="overflow-x-auto">
            <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">📌 Công thức:</span>
                <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Gamma = Khoá + Văn bản</span>
                <span class="ml-2 text-xs text-gray-500">(Khoá: <span class="font-bold text-blue-600 dark:text-blue-400">${key || 'А'}</span>)</span>
            </div>
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-blue-100 dark:bg-blue-900/30 min-w-[60px]">Vị trí</th>
    `;

    table.forEach(row => {
        const isKey = row.isKeyPart;
        html += `
            <th class="${isKey ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'} min-w-[70px]">
                ${row.position}
                ${isKey ? '<span class="text-xs text-yellow-600 dark:text-yellow-400 block">(Khoá)</span>' : ''}
            </th>
        `;
    });

    html += `</tr></thead><tbody>`;

    // Hàng 1: Văn bản gốc
    html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Văn bản</td>`;
    table.forEach(row => {
        html += `
            <td class="font-bold text-gray-900 dark:text-white text-center text-base">
                ${row.textChar}
            </td>
        `;
    });
    html += `</tr>`;

    // Hàng 2: Gamma (khoá)
    html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Gamma</td>`;
    table.forEach(row => {
        const isKey = row.isKeyPart;
        const isNumber = row.shiftType === 'Số';
        html += `
            <td class="font-bold ${isKey ? 'text-yellow-600 dark:text-yellow-400' : isNumber ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} text-center text-base">
                ${row.gammaChar}
                ${isKey ? '<span class="text-xs text-yellow-500 block">(Khoá)</span>' : ''}
            </td>
        `;
    });
    html += `</tr>`;

    // Hàng 3: Shift
    html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Shift</td>`;
    table.forEach(row => {
        html += `
            <td class="font-bold text-purple-600 dark:text-purple-400 text-center">
                +${row.shift}
                <span class="text-xs text-gray-400 block">(${row.shiftType})</span>
            </td>
        `;
    });
    html += `</tr>`;

    // Hàng 4: Kết quả mã hoá
    html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Mã hoá</td>`;
    table.forEach(row => {
        html += `
            <td class="font-bold text-teal-600 dark:text-teal-400 text-center text-base">
                ${row.encryptedChar}
            </td>
        `;
    });
    html += `</tr>`;

    html += `
                </tbody>
            </table>
            <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                <span><span class="inline-block w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 rounded"></span> Phần khoá ban đầu</span>
                <span><span class="inline-block w-3 h-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 rounded"></span> Phần văn bản</span>
                <span class="ml-2">🔵 Chữ cái &nbsp;|&nbsp; 🟢 Số</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Render bảng Gamma (dọc)
function renderAutokeyTableVertical(text = '', key = 'А') {
    const container = document.getElementById('vigenere-table');
    if (!container) return;

    const cleanText = text.replace(/\s/g, '');

    if (!cleanText || cleanText.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle text-2xl mb-2 block"></i>
                <p>Nhập văn bản vào ô bên trái để xem bảng Gamma</p>
                <p class="text-xs mt-1">Gamma = Khoá ban đầu + Văn bản gốc</p>
            </div>
        `;
        return;
    }

    const table = generateAutokeyTable(text, key);

    let html = `
        <div class="overflow-y-auto max-h-[500px]">
            <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">📌 Công thức:</span>
                <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Gamma = Khoá + Văn bản</span>
                <span class="ml-2 text-xs text-gray-500">(Khoá: <span class="font-bold text-blue-600 dark:text-blue-400">${key || 'А'}</span>)</span>
            </div>
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Vị trí</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Văn bản</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Gamma</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Shift</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Mã hoá</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
    `;

    table.forEach(row => {
        const isKey = row.isKeyPart;
        const isNumber = row.shiftType === 'Số';
        html += `
            <tr class="${isKey ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}">
                <td class="font-bold text-gray-900 dark:text-white text-center">${row.position}</td>
                <td class="font-bold text-gray-900 dark:text-white text-center">${row.textChar}</td>
                <td class="font-bold ${isKey ? 'text-yellow-600 dark:text-yellow-400' : isNumber ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} text-center">
                    ${row.gammaChar}
                </td>
                <td class="font-bold text-purple-600 dark:text-purple-400 text-center">+${row.shift}</td>
                <td class="font-bold text-teal-600 dark:text-teal-400 text-center">${row.encryptedChar}</td>
                <td class="text-xs text-gray-500 dark:text-gray-400 text-center">
                    ${isKey ? '🔑 Khoá' : isNumber ? '🔢 Số' : '🔤 Chữ'}
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
            <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                <span><span class="inline-block w-3 h-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-300 rounded"></span> Phần khoá ban đầu</span>
                <span>🔵 Chữ cái &nbsp;|&nbsp; 🟢 Số &nbsp;|&nbsp; 🔑 Khoá</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderAutokeyTable(text = '', key = 'А', isVertical = false) {
    if (isVertical) {
        renderAutokeyTableVertical(text, key);
    } else {
        renderAutokeyTableHorizontal(text, key);
    }
}

// Hàm hiển thị thông tin
function updateAutokeyInfo(key) {
    const container = document.getElementById('key-info');
    if (!container) return;

    let normalizedKey = key.toUpperCase();
    normalizedKey = normalizedKey.replace(/[^А-Я0-9]/g, '');
    if (normalizedKey.length === 0) normalizedKey = 'А';

    const keyDisplay = normalizedKey.length > 20 ? normalizedKey.slice(0, 20) + '...' : normalizedKey;
    container.innerHTML = `
        <div class="flex flex-wrap items-center gap-3 text-sm">
            <span class="font-medium text-gray-700 dark:text-gray-300">🔑 Khoá ban đầu:</span>
            <span class="font-mono font-bold text-blue-600 dark:text-blue-400">${keyDisplay}</span>
            <span class="text-gray-500 dark:text-gray-400">(${normalizedKey.length} ký tự)</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                Gamma = Khoá + Văn bản
            </span>
        </div>
    `;
}

// Kiểm tra ký tự hợp lệ cho khoá
function isValidAutokeyChar(char) {
    const validChars = GrassEAD.RUSSIAN_ALPHABET + GrassEAD.RUSSIAN_ALPHABET_LOWER + '0123456789';
    return validChars.includes(char);
}

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('vigenere-input');
    const output = document.getElementById('vigenere-output');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const keyInput = document.getElementById('key-input');
    const modeEncrypt = document.getElementById('mode-encrypt');
    const modeDecrypt = document.getElementById('mode-decrypt');
    const viewToggle = document.getElementById('view-toggle');
    const viewModeLabel = document.getElementById('view-mode-label');
    const pasteBtn = document.getElementById('paste-btn');
    const copyInputBtn = document.getElementById('copy-input-btn');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentMode = 'encrypt';
    let currentKey = '';
    let isVertical = false;

    function updateUI() {
        const isEncrypt = currentMode === 'encrypt';

        if (inputLabel) {
            inputLabel.textContent = isEncrypt ? '📝 Văn bản gốc' : '📝 Văn bản mã hoá';
        }
        if (outputLabel) {
            outputLabel.textContent = isEncrypt ? '🔐 Văn bản mã hoá' : '🔓 Văn bản giải mã';
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

        if (viewToggle) {
            viewToggle.innerHTML = isVertical ? '📋 Xem ngang' : '📄 Xem dọc';
        }
        if (viewModeLabel) {
            viewModeLabel.textContent = isVertical ? '(Dọc)' : '(Ngang)';
        }
    }

    function handleInput(event) {
        const text = event.target.value;
        const processed = GrassEAD.handleTextInput(text, true);
        if (processed !== text) {
            event.target.value = processed;
        }
        updateOutput();
    }

    function updateOutput() {
        if (!input || !output) return;
        const text = input.value;

        let currentKeyValue = currentKey;
        if (!currentKeyValue || currentKeyValue.trim() === '') {
            currentKeyValue = 'А';
        }

        const displayText = text || '';
        renderAutokeyTable(displayText, currentKeyValue, isVertical);
        updateAutokeyInfo(currentKeyValue);

        if (!text) {
            output.value = '';
            return;
        }

        let result;
        if (currentMode === 'encrypt') {
            result = vigenereAutokeyEncrypt(text, currentKeyValue);
            result = GrassEAD.formatResult(result);
        } else {
            const cleanText = text.replace(/\s/g, '');
            result = vigenereAutokeyDecrypt(cleanText, currentKeyValue);
        }
        output.value = result;
    }

    // Xử lý key
    function handleKeyInput(event) {
        const text = event.target.value;
        let processed = '';
        let hasInvalidChar = false;
        let invalidChars = [];

        for (let char of text) {
            if (char === ' ' || char === '\n' || char === '\t') continue;
            if (isValidAutokeyChar(char)) {
                processed += char;
            } else {
                hasInvalidChar = true;
                invalidChars.push(char);
            }
        }

        if (hasInvalidChar) {
            const uniqueInvalid = [...new Set(invalidChars)];
            GrassEAD.showMessage(`⚠️ Ký tự không hợp lệ trong khoá: ${uniqueInvalid.join(', ')}. Chỉ chấp nhận chữ cái А-Я và số 0-9`, 'error');
        }

        let finalKey = processed.toUpperCase();
        finalKey = finalKey.replace(/[^А-Я0-9]/g, '');

        const cursorPos = this.selectionStart;
        this.value = finalKey;
        this.setSelectionRange(cursorPos, cursorPos);

        currentKey = finalKey;
        updateAutokeyInfo(finalKey || 'А');

        const currentText = input ? input.value : '';
        renderAutokeyTable(currentText, finalKey || 'А', isVertical);
        updateOutput();
    }

    // Input events
    if (input) {
        input.addEventListener('input', handleInput);
        input.addEventListener('paste', function (e) {
            setTimeout(() => {
                const text = this.value;
                const processed = GrassEAD.handleTextInput(text, true);
                if (processed !== text) {
                    this.value = processed;
                }
                updateOutput();
            }, 10);
        });
    }

    // Key input events
    if (keyInput) {
        keyInput.placeholder = 'А';
        keyInput.value = '';

        keyInput.addEventListener('focus', function () {
            if (this.value === '') {
                this.placeholder = '';
            }
        });

        keyInput.addEventListener('blur', function () {
            if (this.value === '') {
                this.placeholder = 'А';
                currentKey = '';
                const currentText = input ? input.value : '';
                renderAutokeyTable(currentText, 'А', isVertical);
                updateAutokeyInfo('А');
                updateOutput();
            }
        });

        keyInput.addEventListener('input', handleKeyInput);

        keyInput.addEventListener('paste', function (e) {
            setTimeout(() => {
                const text = this.value;
                let processed = '';
                let hasInvalidChar = false;
                let invalidChars = [];

                for (let char of text) {
                    if (char === ' ' || char === '\n' || char === '\t') continue;
                    if (isValidAutokeyChar(char)) {
                        processed += char;
                    } else {
                        hasInvalidChar = true;
                        invalidChars.push(char);
                    }
                }

                if (hasInvalidChar) {
                    const uniqueInvalid = [...new Set(invalidChars)];
                    GrassEAD.showMessage(`⚠️ Ký tự không hợp lệ trong khoá: ${uniqueInvalid.join(', ')}. Chỉ chấp nhận chữ cái А-Я và số 0-9`, 'error');
                }

                let finalKey = processed.toUpperCase();
                finalKey = finalKey.replace(/[^А-Я0-9]/g, '');
                this.value = finalKey;
                currentKey = finalKey;
                const currentText = input ? input.value : '';
                renderAutokeyTable(currentText, finalKey || 'А', isVertical);
                updateAutokeyInfo(finalKey || 'А');
                updateOutput();
            }, 10);
        });
    }

    // Mode buttons
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

    // View toggle
    if (viewToggle) {
        viewToggle.addEventListener('click', function () {
            isVertical = !isVertical;
            updateUI();
            const currentText = input ? input.value : '';
            const keyForTable = currentKey || 'А';
            renderAutokeyTable(currentText, keyForTable, isVertical);
            updateOutput();
        });
    }

    // Copy/Paste buttons
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
            const keyForTable = currentKey || 'А';
            renderAutokeyTable('', keyForTable, isVertical);
            updateOutput();
        });
    }

    updateUI();
    const initialKey = 'А';
    renderAutokeyTable('', initialKey, isVertical);
    updateAutokeyInfo(initialKey);
    updateOutput();
});