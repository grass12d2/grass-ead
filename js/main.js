// ==================== XỬ LÝ VĂN BẢN ====================

// Chuẩn hoá Ё → Е
function normalizeRussianText(text) {
    return text.replace(/[Ёё]/g, match => match === 'Ё' ? 'Е' : 'е');
}

// Bảng chữ cái tiếng Nga (33 chữ, không có Ё)
const RUSSIAN_ALPHABET = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const RUSSIAN_ALPHABET_LOWER = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';

// CHỈ chấp nhận А-Я và dấu cách (bỏ 0-9, dấu . và ,)
const VALID_CHARS = RUSSIAN_ALPHABET + RUSSIAN_ALPHABET_LOWER + ' ';

function processInput(text) {
    let result = normalizeRussianText(text);
    // Chỉ lấy các ký tự chữ cái tiếng Nga và dấu cách
    let filtered = '';
    for (let char of result) {
        if (RUSSIAN_ALPHABET.includes(char) || RUSSIAN_ALPHABET_LOWER.includes(char) || char === ' ') {
            filtered += char;
        }
    }
    return filtered;
}

function formatResult(text) {
    let clean = text.replace(/\s+/g, '');
    if (clean.length === 0) return '';
    const chunks = [];
    for (let i = 0; i < clean.length; i += 5) {
        chunks.push(clean.slice(i, i + 5));
    }
    return chunks.join(' ');
}

// Format cho Polybius: chia thành cụm 5 số
function formatPolybiusResult(text) {
    let clean = text.replace(/\s+/g, '');
    if (clean.length === 0) return '';
    const chunks = [];
    for (let i = 0; i < clean.length; i += 5) {
        chunks.push(clean.slice(i, i + 5));
    }
    return chunks.join(' ');
}

// Lấy danh sách các chữ cái cho bảng (33 chữ)
function getFullAlphabet() {
    return RUSSIAN_ALPHABET.split('');
}

// Lấy bảng chữ cái đảo ngược (cho Atbash)
function getReversedAlphabet() {
    return RUSSIAN_ALPHABET.split('').reverse().join('');
}

// Kiểm tra ký tự hợp lệ
function isValidChar(char) {
    return VALID_CHARS.includes(char);
}

// ==================== POPUP THÔNG BÁO ====================

// Hiển thị popup thông báo
function showMessage(message, type = 'success') {
    const existingPopup = document.querySelector('.message-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    const popup = document.createElement('div');
    popup.className = `message-popup fixed top-4 right-4 z-50 ${colors[type] || colors.success} text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-in`;
    popup.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas ${icons[type] || icons.success} text-xl"></i>
            <span class="font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 3000);
}

// ==================== XỬ LÝ INPUT ====================

// Xử lý input: chuyển UPPERCASE và kiểm tra ký tự hợp lệ
function handleTextInput(text, showAlert = true) {
    let upperText = text.toUpperCase();

    if (showAlert) {
        for (let char of upperText) {
            if (char === ' ' || char === '\n' || char === '\t') continue;
            if (!RUSSIAN_ALPHABET.includes(char)) {
                showMessage(`Ký tự "${char}" không hợp lệ! Chỉ chấp nhận chữ cái А-Я và dấu cách`, 'error');
                // Lọc bỏ ký tự không hợp lệ
                return upperText.split('').filter(c =>
                    c === ' ' || c === '\n' || c === '\t' || RUSSIAN_ALPHABET.includes(c)
                ).join('');
            }
        }
    }

    return upperText;
}

// ==================== COPY / PASTE ====================

// Hàm copy text
function copyText(text, showSuccess = true) {
    if (!text || text.trim() === '') {
        showMessage('Không có nội dung để sao chép!', 'warning');
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (showSuccess) {
                showMessage('Sao chép thành công!', 'success');
            }
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// Fallback copy
function fallbackCopy(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showMessage('Sao chép thành công!', 'success');
    } catch (err) {
        showMessage('Không thể sao chép! Vui lòng thử lại.', 'error');
    }
}

// Hàm paste text
function pasteText(textarea) {
    if (!textarea) {
        showMessage('Không tìm thấy ô nhập văn bản!', 'error');
        return;
    }

    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(text => {
            if (text) {
                textarea.value = text;
                textarea.dispatchEvent(new Event('input'));
                showMessage('Đã dán văn bản từ bảng nhớ tạm!', 'success');
            } else {
                showMessage('Bảng nhớ tạm trống!', 'warning');
            }
        }).catch(() => {
            fallbackPaste(textarea);
        });
    } else {
        fallbackPaste(textarea);
    }
}

// Fallback paste
function fallbackPaste(textarea) {
    showMessage('Vui lòng dán thủ công bằng Ctrl+V (hoặc Cmd+V)', 'warning');

    const hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.style.position = 'fixed';
    hiddenTextarea.style.opacity = '0';
    hiddenTextarea.style.left = '-9999px';
    hiddenTextarea.style.top = '-9999px';
    hiddenTextarea.style.width = '1px';
    hiddenTextarea.style.height = '1px';
    document.body.appendChild(hiddenTextarea);

    hiddenTextarea.focus();

    hiddenTextarea.addEventListener('paste', function (e) {
        e.preventDefault();
        const text = e.clipboardData ? e.clipboardData.getData('text/plain') : '';
        if (text && textarea) {
            textarea.value = text;
            textarea.dispatchEvent(new Event('input'));
            showMessage('Đã dán văn bản thành công!', 'success');
        } else {
            showMessage('Không có dữ liệu để dán!', 'warning');
        }
        if (document.body.contains(hiddenTextarea)) {
            document.body.removeChild(hiddenTextarea);
        }
    }, { once: true });

    setTimeout(() => {
        if (document.body.contains(hiddenTextarea)) {
            document.body.removeChild(hiddenTextarea);
            textarea.focus();
        }
    }, 5000);
}

// ==================== CLEAR TEXT ====================

// Hàm clear textarea
function clearText(textarea) {
    if (textarea) {
        textarea.value = '';
        textarea.dispatchEvent(new Event('input'));
        showMessage('Đã xoá nội dung!', 'info');
    }
}

// ==================== EXPORT ====================

window.GrassEAD = {
    normalizeRussianText,
    processInput,
    formatResult,
    formatPolybiusResult,
    RUSSIAN_ALPHABET,
    RUSSIAN_ALPHABET_LOWER,
    VALID_CHARS,
    getFullAlphabet,
    getReversedAlphabet,
    isValidChar,
    showMessage,
    handleTextInput,
    copyText,
    pasteText,
    clearText
};