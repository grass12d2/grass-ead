// ==================== WARNING POPUP MANAGER ====================
(function () {
    'use strict';

    let bound = false;
    let isOpen = false;

    // ==================== LOAD ====================
    async function loadWarning() {
        console.log('[Warning] Bắt đầu loadWarning()');

        const ph = document.getElementById('warning-placeholder');
        if (!ph) {
            console.warn('[Warning] ❌ Không tìm thấy #warning-placeholder trong HTML');
            console.warn('[Warning] Hãy thêm <div id="warning-placeholder"></div> vào sau #navbar-placeholder');
            return;
        }
        console.log('[Warning] ✅ Tìm thấy placeholder');

        const isInPages = window.location.pathname.includes('/pages/');
        const basePath = isInPages ? '../' : '';
        const url = basePath + 'components/warning.html?v=' + Date.now();
        console.log('[Warning] Fetch URL:', url);

        let htmlContent = '';

        try {
            const res = await fetch(url);
            console.log('[Warning] Response status:', res.status);

            if (res.ok) {
                htmlContent = await res.text();
                console.log('[Warning] ✅ Fetch thành công, độ dài HTML:', htmlContent.length);
            } else {
                console.error('[Warning] ❌ Fetch fail status', res.status);
                return;
            }
        } catch (err) {
            console.error('[Warning] ❌ Fetch error:', err);
            return;
        }

        ph.innerHTML = htmlContent;

        // Verify các element quan trọng đã có trong DOM
        const popup = document.getElementById('warning-popup');
        const backdrop = document.getElementById('warning-backdrop');
        const panel = document.getElementById('warning-panel');

        console.log('[Warning] #warning-popup:', popup ? '✅' : '❌');
        console.log('[Warning] #warning-backdrop:', backdrop ? '✅' : '❌');
        console.log('[Warning] #warning-panel:', panel ? '✅' : '❌');

        if (!popup || !backdrop || !panel) {
            console.error('[Warning] ❌ Element bị thiếu, không thể mở popup');
            return;
        }

        openWarning();
    }

    // ==================== OPEN ====================
    function openWarning() {
        const popup = document.getElementById('warning-popup');
        const backdrop = document.getElementById('warning-backdrop');
        const panel = document.getElementById('warning-panel');
        if (!popup || !backdrop || !panel) {
            console.error('[Warning] openWarning: thiếu element');
            return;
        }

        isOpen = true;
        console.log('[Warning] Mở popup...');

        // 1) Bỏ display: none (inline style)
        popup.style.display = 'block';

        // 2) Khóa scroll
        document.body.style.overflow = 'hidden';

        // 3) Ép browser reflow — quan trọng để transition chạy
        //    Đọc layout property sẽ buộc browser tính lại → transition có điểm bắt đầu
        popup.getBoundingClientRect();

        // 4) Set trạng thái cuối → transition tự chạy từ giá trị cũ (opacity 0, scale 0.92) đến giá trị mới
        backdrop.style.opacity = '1';
        panel.style.opacity = '1';
        panel.style.transform = 'translate(-50%, -50%) scale(1)';

        console.log('[Warning] ✅ Đã set display:block + opacity:1 cho popup và panel');
    }

    // ==================== CLOSE ====================
    function closeWarning() {
        const popup = document.getElementById('warning-popup');
        const backdrop = document.getElementById('warning-backdrop');
        const panel = document.getElementById('warning-panel');
        if (!popup || !backdrop || !panel) return;

        console.log('[Warning] Đóng popup...');
        isOpen = false;

        backdrop.style.opacity = '0';
        panel.style.opacity = '0';
        panel.style.transform = 'translate(-50%, -50%) scale(0.92)';

        setTimeout(() => {
            popup.style.display = 'none';
            document.body.style.overflow = '';
            console.log('[Warning] ✅ Đã đóng');
        }, 320);
    }

    // ==================== EVENT BINDING ====================
    function bindEvents() {
        if (bound) return;
        bound = true;

        document.addEventListener('click', function (e) {
            if (e.target.closest('#warning-ok')) {
                e.preventDefault();
                console.log('[Warning] Click nút Đã hiểu');
                closeWarning();
                return;
            }

            if (e.target.closest('#warning-backdrop')) {
                console.log('[Warning] Click backdrop');
                closeWarning();
                return;
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                console.log('[Warning] Nhấn ESC');
                closeWarning();
            }
        });
    }

    // ==================== START ====================
    console.log('[Warning] script ready — window.location:', window.location.href);

    bindEvents();

    // Đợi DOM ready rồi mới load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWarning);
    } else {
        // DOM đã ready nhưng body có thể chưa parse xong → dùng setTimeout nhỏ cho chắc
        setTimeout(loadWarning, 50);
    }
})();