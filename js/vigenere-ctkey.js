// Mã hoá Vigenère với khoá là bản mã (Ciphertext Key)
function vigenereCTKeyEncrypt(text, key = 'А') {
    const processed = GrassEAD.processInput(text);
    let result = '';
    const upper = GrassEAD.RUSSIAN_ALPHABET;
    const lower = GrassEAD.RUSSIAN_ALPHABET_LOWER;
    const len = upper.length;
    
    let initialKey = key.toUpperCase();
    initialKey = initialKey.replace(/[^А-Я0-9]/g, '');
    if (initialKey.length === 0) initialKey = 'А';
    
    let gamma = initialKey;
    let ciphertext = '';
    
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
        
        let encryptedChar;
        if (upper.includes(char)) {
            const index = upper.indexOf(char);
            encryptedChar = upper[(index + shift) % len];
        } else if (lower.includes(char)) {
            const index = lower.indexOf(char);
            encryptedChar = lower[(index + shift) % len];
        } else {
            encryptedChar = char;
        }
        
        ciphertext += encryptedChar;
        gamma += encryptedChar;
    }
    return ciphertext;
}

// Giải mã Vigenère với khoá là bản mã (Ciphertext Key)
function vigenereCTKeyDecrypt(text, key = 'А') {
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
        gamma += char;
    }
    return plaintext;
}