function caesarEncrypt(text, shift = 3) {
    const processed = GrassEAD.processInput(text);
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;
    shift = ((shift % len) + len) % len;

    for (let char of processed) {
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

function caesarDecrypt(text, shift = 3) {
    return caesarEncrypt(text, -shift);
}

// Render bảng Caesar (ngang)
function renderCaesarTableHorizontal(shift, isDecrypt = false) {
    const container = document.getElementById('caesar-table');
    if (!container) return;

    let html = `
        <div class="overflow-x-auto">
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Ký tự</th>
    `;

    if (isDecrypt) {
        // CHẾ ĐỘ GIẢI MÃ: hàng mã hoá cố định từ А-Я, hàng gốc thay đổi
        const chars = GrassEAD.RUSSIAN_ALPHABET.split('');
        const len = chars.length;

        // Header hiển thị ký tự mã hoá (cố định А-Я)
        chars.forEach(char => {
            html += `
                <th class="bg-blue-100 dark:bg-blue-900/30">
                    ${char}
                </th>
            `;
        });

        html += `</tr></thead><tbody>`;

        // Hàng 1: Mã hoá (cố định)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700">Mã hoá</td>`;
        chars.forEach(char => {
            html += `
                <td class="font-bold text-teal-600 dark:text-teal-400">
                    ${char}
                </td>
            `;
        });
        html += `</tr>`;

        // Hàng 2: Gốc (thay đổi theo shift ngược)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700">Gốc</td>`;
        chars.forEach(char => {
            const index = GrassEAD.RUSSIAN_ALPHABET.indexOf(char);
            const newIndex = ((index - shift) % len + len) % len;
            const originalChar = GrassEAD.RUSSIAN_ALPHABET[newIndex];
            html += `
                <td class="font-bold text-gray-900 dark:text-white">
                    ${originalChar}
                </td>
            `;
        });
        html += `</tr>`;
    } else {
        // CHẾ ĐỘ MÃ HOÁ
        const chars = GrassEAD.RUSSIAN_ALPHABET.split('');
        const len = chars.length;

        // Header hiển thị ký tự gốc
        chars.forEach(char => {
            html += `
                <th class="bg-blue-100 dark:bg-blue-900/30">
                    ${char}
                </th>
            `;
        });

        html += `</tr></thead><tbody>`;

        // Hàng 1: Gốc (cố định)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700">Gốc</td>`;
        chars.forEach(char => {
            html += `
                <td class="font-bold text-gray-900 dark:text-white">
                    ${char}
                </td>
            `;
        });
        html += `</tr>`;

        // Hàng 2: Mã hoá (thay đổi theo shift)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700">Mã hoá</td>`;
        chars.forEach(char => {
            const index = GrassEAD.RUSSIAN_ALPHABET.indexOf(char);
            const newIndex = ((index + shift) % len + len) % len;
            const encryptedChar = GrassEAD.RUSSIAN_ALPHABET[newIndex];
            html += `
                <td class="font-bold text-blue-600 dark:text-blue-400">
                    ${encryptedChar}
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

// Render bảng Caesar (dọc)
function renderCaesarTableVertical(shift, isDecrypt = false) {
    const container = document.getElementById('caesar-table');
    if (!container) return;

    let html = `
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Vị trí</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Mã hoá</th>
                        <th class="bg-blue-100 dark:bg-blue-900/30">Gốc</th>
                    </tr>
                </thead>
                <tbody>
    `;

    if (isDecrypt) {
        // CHẾ ĐỘ GIẢI MÃ: hàng mã hoá cố định từ А-Я, hàng gốc thay đổi
        const chars = GrassEAD.RUSSIAN_ALPHABET.split('');
        const len = chars.length;

        chars.forEach((char, i) => {
            const index = GrassEAD.RUSSIAN_ALPHABET.indexOf(char);
            const newIndex = ((index - shift) % len + len) % len;
            const originalChar = GrassEAD.RUSSIAN_ALPHABET[newIndex];

            html += `
                <tr>
                    <td class="font-bold text-gray-500 dark:text-gray-400 text-center">${i + 1}</td>
                    <td class="font-bold text-teal-600 dark:text-teal-400 text-center">${char}</td>
                    <td class="font-bold text-gray-900 dark:text-white text-center">${originalChar}</td>
                </tr>
            `;
        });
    } else {
        // CHẾ ĐỘ MÃ HOÁ
        const chars = GrassEAD.RUSSIAN_ALPHABET.split('');
        const len = chars.length;

        chars.forEach((char, i) => {
            const index = GrassEAD.RUSSIAN_ALPHABET.indexOf(char);
            const newIndex = ((index + shift) % len + len) % len;
            const encryptedChar = GrassEAD.RUSSIAN_ALPHABET[newIndex];

            html += `
                <tr>
                    <td class="font-bold text-gray-500 dark:text-gray-400 text-center">${i + 1}</td>
                    <td class="font-bold text-gray-900 dark:text-white text-center">${char}</td>
                    <td class="font-bold text-blue-600 dark:text-blue-400 text-center">${encryptedChar}</td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

function renderCaesarTable(shift, isDecrypt = false, isVertical = false) {
    if (isVertical) {
        renderCaesarTableVertical(shift, isDecrypt);
    } else {
        renderCaesarTableHorizontal(shift, isDecrypt);
    }
}

// Hàm cập nhật background thanh trượt
function updateSliderBackground(slider) {
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const value = parseInt(slider.value);
    const percent = ((value - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
}

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('caesar-input');
    const output = document.getElementById('caesar-output');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const shiftInput = document.getElementById('shift');
    const shiftValue = document.getElementById('shift-value');
    const shiftNumber = document.getElementById('shift-number');
    const shiftDecrease = document.getElementById('shift-decrease');
    const shiftIncrease = document.getElementById('shift-increase');
    const tableShiftValue = document.getElementById('table-shift-value');
    const modeEncrypt = document.getElementById('mode-encrypt');
    const modeDecrypt = document.getElementById('mode-decrypt');
    const viewToggle = document.getElementById('view-toggle');
    const viewModeLabel = document.getElementById('view-mode-label');
    const pasteBtn = document.getElementById('paste-btn');
    const copyInputBtn = document.getElementById('copy-input-btn');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentMode = 'encrypt';
    let currentShift = 3;
    let isVertical = false;

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
        if (!text) {
            output.value = '';
            const isDecrypt = currentMode === 'decrypt';
            renderCaesarTable(currentShift, isDecrypt, isVertical);
            return;
        }
        let result;
        if (currentMode === 'encrypt') {
            result = caesarEncrypt(text, currentShift);
            result = GrassEAD.formatResult(result);
        } else {
            const cleanText = text.replace(/\s/g, '');
            result = caesarDecrypt(cleanText, currentShift);
        }
        output.value = result;
        const isDecrypt = currentMode === 'decrypt';
        renderCaesarTable(currentShift, isDecrypt, isVertical);
        if (tableShiftValue) tableShiftValue.textContent = currentShift;
    }

    function normalizeShift(value) {
        let num = parseInt(value);
        if (isNaN(num)) num = 0;

        if (num > 31 || num < -31) {
            let modded = ((num % 32) + 32) % 32;
            if (modded > 31) modded = modded - 32;
            return modded;
        }
        return num;
    }

    function updateShift(value) {
        let newShift = parseInt(value);
        if (isNaN(newShift)) newShift = 0;

        let normalizedShift = normalizeShift(newShift);
        currentShift = normalizedShift;

        if (shiftValue) shiftValue.textContent = currentShift;
        if (shiftNumber) shiftNumber.value = currentShift;
        if (shiftInput) {
            shiftInput.value = currentShift;
            updateSliderBackground(shiftInput);
        }
        if (tableShiftValue) tableShiftValue.textContent = currentShift;

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

    // Shift events
    if (shiftInput) {
        shiftInput.min = -31;
        shiftInput.max = 31;
        shiftInput.value = 3;
        updateSliderBackground(shiftInput);

        shiftInput.addEventListener('input', function () {
            const val = parseInt(this.value);
            if (!isNaN(val)) {
                currentShift = val;
                if (shiftValue) shiftValue.textContent = currentShift;
                if (shiftNumber) shiftNumber.value = currentShift;
                if (tableShiftValue) tableShiftValue.textContent = currentShift;
                updateSliderBackground(this);
                updateOutput();
            }
        });
    }

    if (shiftNumber) {
        shiftNumber.min = -31;
        shiftNumber.max = 31;
        shiftNumber.value = 3;

        shiftNumber.addEventListener('change', function () {
            let val = parseInt(this.value);
            if (isNaN(val)) val = 0;
            if (val > 31 || val < -31) {
                let modded = ((val % 32) + 32) % 32;
                if (modded > 31) modded = modded - 32;
                this.value = modded;
                GrassEAD.showMessage(`Shift đã được chuẩn hoá thành ${modded} (mod 32)`, 'info');
                updateShift(modded);
            } else {
                updateShift(val);
            }
        });

        shiftNumber.addEventListener('input', function () {
            let val = parseInt(this.value);
            if (!isNaN(val) && val >= -31 && val <= 31) {
                currentShift = val;
                if (shiftValue) shiftValue.textContent = currentShift;
                if (shiftInput) {
                    shiftInput.value = currentShift;
                    updateSliderBackground(shiftInput);
                }
                if (tableShiftValue) tableShiftValue.textContent = currentShift;
                updateOutput();
            }
        });
    }

    if (shiftDecrease) {
        shiftDecrease.addEventListener('click', function () {
            updateShift(currentShift - 1);
        });
    }

    if (shiftIncrease) {
        shiftIncrease.addEventListener('click', function () {
            updateShift(currentShift + 1);
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
            updateOutput();
        });
    }

    updateUI();
    updateShift(3);
});