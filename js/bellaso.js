// Mã hoá Bellaso (Vigenère với khoá)
function bellasoEncrypt(text, key = 'ТРАВА') {
    const processed = GrassEAD.processInput(text);
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;

    let normalizedKey = key.toUpperCase();
    normalizedKey = normalizedKey.replace(/[^А-Я0-9]/g, '');
    if (normalizedKey.length === 0) normalizedKey = 'ТРАВА';

    let keyIndex = 0;
    for (let char of processed) {
        // Nếu là dấu cách, giữ nguyên và KHÔNG tăng keyIndex
        if (char === ' ') {
            result += ' ';
            continue;
        }

        const keyChar = normalizedKey[keyIndex % normalizedKey.length];
        let shift;
        if (keyChar >= '0' && keyChar <= '9') {
            shift = parseInt(keyChar);
        } else {
            shift = upper.indexOf(keyChar);
            if (shift === -1) shift = 0;
        }
        keyIndex++;

        if (upper.includes(char)) {
            const index = upper.indexOf(char);
            result += upper[(index + shift) % len];
        } else if (lower.includes(char)) {
            const index = lower.indexOf(char);
            result += lower[(index + shift) % len];
        } else {
            result += char;
        }
    }
    return result;
}

// Giải mã Bellaso
function bellasoDecrypt(text, key = 'ТРАВА') {
    const processed = text;
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;

    let normalizedKey = key.toUpperCase();
    normalizedKey = normalizedKey.replace(/[^А-Я0-9]/g, '');
    if (normalizedKey.length === 0) normalizedKey = 'ТРАВА';

    let keyIndex = 0;
    for (let char of processed) {
        // Nếu là dấu cách, giữ nguyên và KHÔNG tăng keyIndex
        if (char === ' ') {
            result += ' ';
            continue;
        }

        const keyChar = normalizedKey[keyIndex % normalizedKey.length];
        let shift;
        if (keyChar >= '0' && keyChar <= '9') {
            shift = parseInt(keyChar);
        } else {
            shift = upper.indexOf(keyChar);
            if (shift === -1) shift = 0;
        }
        keyIndex++;

        if (upper.includes(char)) {
            const index = upper.indexOf(char);
            result += upper[(index - shift + len) % len];
        } else if (lower.includes(char)) {
            const index = lower.indexOf(char);
            result += lower[(index - shift + len) % len];
        } else {
            result += char;
        }
    }
    return result;
}

// Tạo dữ liệu bảng Bellaso
function generateBellasoTable(text, key = 'ТРАВА', isDecrypt = false) {
    const table = [];
    const upper = GrassEAD.RUSSIAN_ALPHABET;

    let cleanText = text.replace(/\s/g, '');

    let normalizedKey = key.toUpperCase();
    normalizedKey = normalizedKey.replace(/[^А-Я0-9]/g, '');
    if (normalizedKey.length === 0) normalizedKey = 'ТРАВА';

    if (cleanText.length === 0) {
        return [];
    }

    for (let i = 0; i < cleanText.length; i++) {
        const inputChar = cleanText[i] || '';
        const keyChar = normalizedKey[i % normalizedKey.length];
        let shift;
        let keyType;

        if (keyChar >= '0' && keyChar <= '9') {
            shift = parseInt(keyChar);
            keyType = 'Số';
        } else {
            shift = upper.indexOf(keyChar);
            if (shift === -1) shift = 0;
            keyType = 'Chữ';
        }

        let outputChar = '';
        if (isDecrypt) {
            // Giải mã: input là ký tự mã hoá, output là ký tự gốc
            if (upper.includes(inputChar)) {
                const index = upper.indexOf(inputChar);
                outputChar = upper[(index - shift + upper.length) % upper.length];
            } else {
                outputChar = inputChar;
            }
        } else {
            // Mã hoá: input là ký tự gốc, output là ký tự mã hoá
            if (upper.includes(inputChar)) {
                const index = upper.indexOf(inputChar);
                outputChar = upper[(index + shift) % upper.length];
            } else {
                outputChar = inputChar;
            }
        }

        // Tính giá trị alphabet của inputChar và outputChar
        const inputValue = upper.includes(inputChar) ? upper.indexOf(inputChar) : '-';
        const outputValue = upper.includes(outputChar) ? upper.indexOf(outputChar) : '-';

        table.push({
            position: i + 1,
            inputChar: inputChar,
            inputValue: inputValue,
            keyChar: keyChar,
            keyType: keyType,
            shift: shift,
            outputChar: outputChar,
            outputValue: outputValue
        });
    }
    return table;
}

// Render bảng Bellaso (ngang)
function renderBellasoTableHorizontal(text = '', key = 'ТРАВА', isDecrypt = false) {
    const container = document.getElementById('bellaso-table');
    if (!container) return;

    const cleanText = text.replace(/\s/g, '');

    if (!cleanText || cleanText.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle text-2xl mb-2 block"></i>
                <p>Nhập văn bản vào ô bên trái và khoá ở ô trên để xem bảng mã hoá</p>
                <p class="text-xs mt-1">Mỗi ký tự trong văn bản sẽ được mã hoá với shift từ khoá</p>
            </div>
        `;
        return;
    }

    const table = generateBellasoTable(text, key, isDecrypt);

    const formula = isDecrypt
        ? 'Gốc = [(Mã hoá - Shift) mod 32 + 32] mod 32'
        : 'Mã hoá = [Văn bản + Shift] mod 32';

    let html = `
        <div class="overflow-x-auto">
            <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">📌 Công thức:</span>
                <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">${formula}</span>
                <span class="ml-2 text-xs text-gray-500">(Khoá: <span class="font-bold text-pink-600 dark:text-pink-400">${key || 'ТРАВА'}</span>)</span>
            </div>
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-pink-100 dark:bg-pink-900/30 min-w-[60px]">Vị trí</th>
    `;

    table.forEach(row => {
        html += `
            <th class="bg-pink-100 dark:bg-pink-900/30 min-w-[70px]">
                ${row.position}
            </th>
        `;
    });

    html += `</tr></thead><tbody>`;

    if (isDecrypt) {
        // CHẾ ĐỘ GIẢI MÃ: Mã hoá → Khoá (shift) → Gốc

        // HÀNG 1: Mã hoá (có giá trị alphabet ở dưới)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Mã hoá</td>`;
        table.forEach(row => {
            html += `
                <td class="font-bold text-teal-600 dark:text-teal-400 text-center text-base">
                    ${row.inputChar}
                    <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.inputValue}</span>
                </td>
            `;
        });
        html += `</tr>`;

        // HÀNG 2: Shift (có shift ở dưới)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Shift</td>`;
        table.forEach(row => {
            const isNumber = row.keyType === 'Số';
            html += `
                <td class="font-bold ${isNumber ? 'text-green-600 dark:text-green-400' : 'text-pink-600 dark:text-pink-400'} text-center text-base">
                    ${row.keyChar}
                    <span class="text-xs text-purple-600 dark:text-purple-400 block">-${row.shift}</span>
                </td>
            `;
        });
        html += `</tr>`;

        // HÀNG 3: Gốc (có giá trị alphabet ở dưới)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Gốc</td>`;
        table.forEach(row => {
            html += `
                <td class="font-bold text-gray-900 dark:text-white text-center text-base">
                    ${row.outputChar}
                    <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.outputValue}</span>
                </td>
            `;
        });
        html += `</tr>`;
    } else {
        // CHẾ ĐỘ MÃ HOÁ: Văn bản → Khoá (shift) → Mã hoá

        // HÀNG 1: Văn bản (có giá trị alphabet ở dưới)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Văn bản</td>`;
        table.forEach(row => {
            html += `
                <td class="font-bold text-gray-900 dark:text-white text-center text-base">
                    ${row.inputChar}
                    <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.inputValue}</span>
                </td>
            `;
        });
        html += `</tr>`;

        // HÀNG 2: Khoá (có shift ở dưới)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Shift</td>`;
        table.forEach(row => {
            const isNumber = row.keyType === 'Số';
            html += `
                <td class="font-bold ${isNumber ? 'text-green-600 dark:text-green-400' : 'text-pink-600 dark:text-pink-400'} text-center text-base">
                    ${row.keyChar}
                    <span class="text-xs text-purple-600 dark:text-purple-400 block">+${row.shift}</span>
                </td>
            `;
        });
        html += `</tr>`;

        // HÀNG 3: Mã hoá (có giá trị alphabet ở dưới)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700 text-sm">Mã hoá</td>`;
        table.forEach(row => {
            html += `
                <td class="font-bold text-teal-600 dark:text-teal-400 text-center text-base">
                    ${row.outputChar}
                    <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.outputValue}</span>
                </td>
            `;
        });
        html += `</tr>`;
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// Render bảng Bellaso (dọc)
function renderBellasoTableVertical(text = '', key = 'ТРАВА', isDecrypt = false) {
    const container = document.getElementById('bellaso-table');
    if (!container) return;

    const cleanText = text.replace(/\s/g, '');

    if (!cleanText || cleanText.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <i class="fas fa-info-circle text-2xl mb-2 block"></i>
                <p>Nhập văn bản vào ô bên trái và khoá ở ô trên để xem bảng mã hoá</p>
                <p class="text-xs mt-1">Mỗi ký tự trong văn bản sẽ được mã hoá với shift từ khoá</p>
            </div>
        `;
        return;
    }

    const table = generateBellasoTable(text, key, isDecrypt);

    const formula = isDecrypt
        ? 'Gốc = [(Mã hoá - Shift) mod 32 + 32] mod 32'
        : 'Mã hoá = [Văn bản + Shift] mod 32';

    let html = `
        <div>
            <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">📌 Công thức:</span>
                <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">${formula}</span>
                <span class="ml-2 text-xs text-gray-500">(Khoá: <span class="font-bold text-pink-600 dark:text-pink-400">${key || 'ТРАВА'}</span>)</span>
            </div>
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-pink-100 dark:bg-pink-900/30">Vị trí</th>
    `;

    if (isDecrypt) {
        html += `
                        <th class="bg-pink-100 dark:bg-pink-900/30">Mã hoá</th>
                        <th class="bg-pink-100 dark:bg-pink-900/30">Shift</th>
                        <th class="bg-pink-100 dark:bg-pink-900/30">Gốc</th>
                    </tr>
                </thead>
                <tbody>
        `;
    } else {
        html += `
                        <th class="bg-pink-100 dark:bg-pink-900/30">Văn bản</th>
                        <th class="bg-pink-100 dark:bg-pink-900/30">Shift</th>
                        <th class="bg-pink-100 dark:bg-pink-900/30">Mã hoá</th>
                    </tr>
                </thead>
                <tbody>
        `;
    }

    table.forEach(row => {
        const isNumber = row.keyType === 'Số';
        const shiftDisplay = isDecrypt ? `-${row.shift}` : `+${row.shift}`;

        if (isDecrypt) {
            html += `
                <tr>
                    <td class="font-bold text-gray-900 dark:text-white text-center">${row.position}</td>
                    <td class="font-bold text-teal-600 dark:text-teal-400 text-center">
                        ${row.inputChar}
                        <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.inputValue}</span>
                    </td>
                    <td class="font-bold ${isNumber ? 'text-green-600 dark:text-green-400' : 'text-pink-600 dark:text-pink-400'} text-center">
                        ${row.keyChar}
                        <span class="text-xs text-purple-600 dark:text-purple-400 block">${shiftDisplay}</span>
                    </td>
                    <td class="font-bold text-gray-900 dark:text-white text-center">
                        ${row.outputChar}
                        <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.outputValue}</span>
                    </td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <td class="font-bold text-gray-900 dark:text-white text-center">${row.position}</td>
                    <td class="font-bold text-gray-900 dark:text-white text-center">
                        ${row.inputChar}
                        <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.inputValue}</span>
                    </td>
                    <td class="font-bold ${isNumber ? 'text-green-600 dark:text-green-400' : 'text-pink-600 dark:text-pink-400'} text-center">
                        ${row.keyChar}
                        <span class="text-xs text-purple-600 dark:text-purple-400 block">${shiftDisplay}</span>
                    </td>
                    <td class="font-bold text-teal-600 dark:text-teal-400 text-center">
                        ${row.outputChar}
                        <span class="text-xs text-gray-500 dark:text-gray-400 block">${row.outputValue}</span>
                    </td>
                </tr>
            `;
        }
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

function renderBellasoTable(text = '', key = 'ТРАВА', isDecrypt = false, isVertical = false) {
    if (isVertical) {
        renderBellasoTableVertical(text, key, isDecrypt);
    } else {
        renderBellasoTableHorizontal(text, key, isDecrypt);
    }
}

// Hàm hiển thị thông tin key
function updateBellasoKeyInfo(key) {
    const container = document.getElementById('key-info');
    if (!container) return;

    let normalizedKey = key.toUpperCase();
    normalizedKey = normalizedKey.replace(/[^А-Я0-9]/g, '');
    if (normalizedKey.length === 0) normalizedKey = 'ТРАВА';

    const keyDisplay = normalizedKey.length > 20 ? normalizedKey.slice(0, 20) + '...' : normalizedKey;
    container.innerHTML = `
        <div class="flex flex-wrap items-center gap-3 text-sm">
            <span class="font-medium text-gray-700 dark:text-gray-300">🔑 Khoá:</span>
            <span class="font-mono font-bold text-pink-600 dark:text-pink-400">${keyDisplay}</span>
            <span class="text-gray-500 dark:text-gray-400">(${normalizedKey.length} ký tự)</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                Shift = Vị trí ký tự trong bảng chữ cái
            </span>
        </div>
    `;
}

// Kiểm tra ký tự hợp lệ cho khoá Bellaso (А-Я, 0-9)
function isValidBellasoKeyChar(char) {
    const validChars = GrassEAD.RUSSIAN_ALPHABET + GrassEAD.RUSSIAN_ALPHABET_LOWER + '0123456789';
    return validChars.includes(char);
}

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('bellaso-input');
    const output = document.getElementById('bellaso-output');
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
                : 'Nhập văn bản đã mã hoá';
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
            viewToggle.innerHTML = isVertical
                ? '<i class="fas fa-sync-alt mr-2"></i>Xem ngang'
                : '<i class="fas fa-sync-alt mr-2"></i>Xem dọc';
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
            currentKeyValue = 'ТРАВА';
        }

        const isDecrypt = currentMode === 'decrypt';
        const displayText = text || '';
        renderBellasoTable(displayText, currentKeyValue, isDecrypt, isVertical);
        updateBellasoKeyInfo(currentKeyValue);

        if (!text) {
            output.value = '';
            return;
        }

        let result;
        if (currentMode === 'encrypt') {
            result = bellasoEncrypt(text, currentKeyValue);
            result = GrassEAD.formatResult(result);
        } else {
            const cleanText = text.replace(/\s/g, '');
            result = bellasoDecrypt(cleanText, currentKeyValue);
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
            if (isValidBellasoKeyChar(char)) {
                processed += char;
            } else {
                hasInvalidChar = true;
                invalidChars.push(char);
            }
        }

        if (hasInvalidChar) {
            const uniqueInvalid = [...new Set(invalidChars)];
            GrassEAD.showMessage(`Ký tự không hợp lệ trong khoá: ${uniqueInvalid.join(', ')}. Chỉ chấp nhận chữ cái А-Я và số 0-9`, 'error');
        }

        let finalKey = processed.toUpperCase();
        finalKey = finalKey.replace(/[^А-Я0-9]/g, '');

        const cursorPos = this.selectionStart;
        this.value = finalKey;
        this.setSelectionRange(cursorPos, cursorPos);

        currentKey = finalKey;
        const currentText = input ? input.value : '';
        const isDecrypt = currentMode === 'decrypt';
        renderBellasoTable(currentText, finalKey || 'ТРАВА', isDecrypt, isVertical);
        updateBellasoKeyInfo(finalKey || 'ТРАВА');
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
        keyInput.placeholder = 'ТРАВА';
        keyInput.value = '';

        keyInput.addEventListener('focus', function () {
            if (this.value === '') {
                this.placeholder = '';
            }
        });

        keyInput.addEventListener('blur', function () {
            if (this.value === '') {
                this.placeholder = 'ТРАВА';
                currentKey = '';
                const currentText = input ? input.value : '';
                const isDecrypt = currentMode === 'decrypt';
                renderBellasoTable(currentText, 'ТРАВА', isDecrypt, isVertical);
                updateBellasoKeyInfo('ТРАВА');
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
                    if (isValidBellasoKeyChar(char)) {
                        processed += char;
                    } else {
                        hasInvalidChar = true;
                        invalidChars.push(char);
                    }
                }

                if (hasInvalidChar) {
                    const uniqueInvalid = [...new Set(invalidChars)];
                    GrassEAD.showMessage(`Ký tự không hợp lệ trong khoá: ${uniqueInvalid.join(', ')}. Chỉ chấp nhận chữ cái А-Я và số 0-9`, 'error');
                }

                let finalKey = processed.toUpperCase();
                finalKey = finalKey.replace(/[^А-Я0-9]/g, '');
                this.value = finalKey;
                currentKey = finalKey;
                const currentText = input ? input.value : '';
                const isDecrypt = currentMode === 'decrypt';
                renderBellasoTable(currentText, finalKey || 'ТРАВА', isDecrypt, isVertical);
                updateBellasoKeyInfo(finalKey || 'ТРАВА');
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
            const keyForTable = currentKey || 'ТРАВА';
            const isDecrypt = currentMode === 'decrypt';
            renderBellasoTable(currentText, keyForTable, isDecrypt, isVertical);
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
            GrassEAD.showMessage('Đã xoá nội dung!', 'info');
            const keyForTable = currentKey || 'ТРАВА';
            const isDecrypt = currentMode === 'decrypt';
            renderBellasoTable('', keyForTable, isDecrypt, isVertical);
            updateOutput();
        });
    }

    // Khởi tạo
    updateUI();
    const initialKey = 'ТРАВА';
    renderBellasoTable('', initialKey, false, isVertical);
    updateBellasoKeyInfo(initialKey);
    updateOutput();
});