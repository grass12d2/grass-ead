function atbash(text) {
    const processed = GrassEAD.processInput(text);
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;

    for (let char of processed) {
        if (upper.includes(char)) {
            const index = upper.indexOf(char);
            result += upper[len - 1 - index];
        } else if (lower.includes(char)) {
            const index = lower.indexOf(char);
            result += lower[len - 1 - index];
        } else {
            result += char;
        }
    }
    return result;
}

// Render bảng Atbash (ngang)
function renderAtbashTableHorizontal(isDecrypt = false) {
    const container = document.getElementById('atbash-table');
    if (!container) return;

    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const len = upper.length;
    const chars = upper.split('');

    let html = `
        <div class="overflow-x-auto">
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-purple-100 dark:bg-purple-900/30">Ký tự</th>
    `;

    if (isDecrypt) {
        // CHẾ ĐỘ GIẢI MÃ: hàng mã hoá cố định А-Я, hàng gốc thay đổi
        // Header hiển thị ký tự mã hoá (cố định А-Я)
        chars.forEach(char => {
            html += `
                <th class="bg-purple-100 dark:bg-purple-900/30">
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

        // Hàng 2: Gốc (thay đổi theo Atbash)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700">Gốc</td>`;
        chars.forEach(char => {
            const index = upper.indexOf(char);
            const originalChar = upper[len - 1 - index];
            html += `
                <td class="font-bold text-gray-900 dark:text-white">
                    ${originalChar}
                </td>
            `;
        });
        html += `</tr>`;
    } else {
        // CHẾ ĐỘ MÃ HOÁ
        // Header hiển thị ký tự gốc
        chars.forEach(char => {
            html += `
                <th class="bg-purple-100 dark:bg-purple-900/30">
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

        // Hàng 2: Mã hoá (thay đổi theo Atbash)
        html += `<tr><td class="font-bold bg-gray-100 dark:bg-gray-700">Mã hoá</td>`;
        chars.forEach(char => {
            const index = upper.indexOf(char);
            const encryptedChar = upper[len - 1 - index];
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

// Render bảng Atbash (dọc)
function renderAtbashTableVertical(isDecrypt = false) {
    const container = document.getElementById('atbash-table');
    if (!container) return;

    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const len = upper.length;
    const chars = upper.split('');

    let html = `
        <div>
            <table class="table-encrypt">
                <thead>
                    <tr>
                        <th class="bg-purple-100 dark:bg-purple-900/30">Vị trí</th>
                        <th class="bg-purple-100 dark:bg-purple-900/30">Mã hoá</th>
                        <th class="bg-purple-100 dark:bg-purple-900/30">Gốc</th>
                    </tr>
                </thead>
                <tbody>
    `;

    if (isDecrypt) {
        // CHẾ ĐỘ GIẢI MÃ: hàng mã hoá cố định А-Я, hàng gốc thay đổi
        chars.forEach((char, i) => {
            const index = upper.indexOf(char);
            const originalChar = upper[len - 1 - index];

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
        chars.forEach((char, i) => {
            const index = upper.indexOf(char);
            const encryptedChar = upper[len - 1 - index];

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

function renderAtbashTable(isDecrypt = false, isVertical = false) {
    if (isVertical) {
        renderAtbashTableVertical(isDecrypt);
    } else {
        renderAtbashTableHorizontal(isDecrypt);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('atbash-input');
    const output = document.getElementById('atbash-output');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const modeEncrypt = document.getElementById('mode-encrypt');
    const modeDecrypt = document.getElementById('mode-decrypt');
    const viewToggle = document.getElementById('view-toggle');
    const viewModeLabel = document.getElementById('view-mode-label');
    const pasteBtn = document.getElementById('paste-btn');
    const copyInputBtn = document.getElementById('copy-input-btn');
    const copyOutputBtn = document.getElementById('copy-output-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentMode = 'encrypt';
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
            renderAtbashTable(currentMode === 'decrypt', isVertical);
            return;
        }
        let result;
        if (currentMode === 'encrypt') {
            result = atbash(text);
            result = GrassEAD.formatResult(result);
        } else {
            const cleanText = text.replace(/\s/g, '');
            result = atbash(cleanText);
        }
        output.value = result;
        renderAtbashTable(currentMode === 'decrypt', isVertical);
    }

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

    if (viewToggle) {
        viewToggle.addEventListener('click', function () {
            isVertical = !isVertical;
            updateUI();
            updateOutput();
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
    renderAtbashTable(false, isVertical);
    updateOutput();
});