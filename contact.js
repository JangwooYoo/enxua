// ─── Contact Form — ENXUA ────────────────────────────────────────────────────
//
// EMAILJS SETUP (one-time):
//   1. Create a free account at https://www.emailjs.com/
//   2. Add an Email Service → copy the Service ID → set EMAILJS_SERVICE_ID
//   3. Create an Email Template with these variables:
//        {{from_name}}  {{from_email}}  {{from_phone}}  {{message}}
//      Set the template "To Email" or "Reply To" to: un@enxua.com
//   4. Copy the Template ID → set EMAILJS_TEMPLATE_ID
//   5. Copy your Public Key (Account → API Keys) → set EMAILJS_PUBLIC_KEY
//
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace

// ─── EmailJS init ─────────────────────────────────────────────────────────────
(function initEmailJS() {
    if (typeof emailjs !== 'undefined' &&
        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
})();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function setFieldError(groupId, errId, message) {
    const group = document.getElementById(groupId);
    const err   = document.getElementById(errId);
    if (!group || !err) return;
    group.classList.add('has-error');
    err.textContent = message;
    // Re-trigger animation
    err.style.animation = 'none';
    err.offsetHeight;           // reflow
    err.style.animation = '';
}

function clearFieldError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('has-error');
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateForm() {
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const phone   = document.getElementById('cf-phone').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    let valid = true;

    // Name
    if (!name) {
        setFieldError('group-name', 'err-name', '이름을 입력해 주세요.');
        valid = false;
    } else { clearFieldError('group-name'); }

    // Email
    if (!email) {
        setFieldError('group-email', 'err-email', '이메일 주소를 입력해 주세요.');
        valid = false;
    } else if (!isValidEmail(email)) {
        setFieldError('group-email', 'err-email', '메일 형식이 유효하지 않습니다.');
        valid = false;
    } else { clearFieldError('group-email'); }

    // Phone
    if (!phone) {
        setFieldError('group-phone', 'err-phone', '연락처를 입력해 주세요.');
        valid = false;
    } else { clearFieldError('group-phone'); }

    // Message
    if (!message) {
        setFieldError('group-message', 'err-message', '의견을 입력해 주세요.');
        valid = false;
    } else { clearFieldError('group-message'); }

    return valid;
}

// ─── Send via EmailJS ─────────────────────────────────────────────────────────
async function sendEmail() {
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const phone   = document.getElementById('cf-phone').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const params = {
        from_name:  name,
        from_email: email,
        from_phone: phone,
        message:    message,
        to_email:   'un@enxua.com',
    };

    // If EmailJS is not configured, fall back to mailto
    if (typeof emailjs === 'undefined' ||
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        const subject = encodeURIComponent(`[ENXUA 문의] ${name}`);
        const body = encodeURIComponent(
            `이름: ${name}\n이메일: ${email}\n연락처: ${phone}\n\n${message}`
        );
        window.location.href = `mailto:un@enxua.com?subject=${subject}&body=${body}`;
        return true;
    }

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    return true;
}

// ─── Show success state ───────────────────────────────────────────────────────
function showSuccess(form) {
    // Hide all fields and submit button
    Array.from(form.querySelectorAll('.input-group, #btn-submit')).forEach(el => {
        el.style.display = 'none';
    });
    const successEl = document.getElementById('form-success');
    if (successEl) successEl.classList.remove('hidden');
}

// ─── Highlight form ───────────────────────────────────────────────────────────
function highlightForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Pulse animation
    form.classList.remove('highlight');
    form.offsetHeight; // reflow
    form.classList.add('highlight');
    form.addEventListener('animationend', () => form.classList.remove('highlight'), { once: true });

    // Briefly focus the first empty field
    const firstInput = form.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 600);
}

// ─── Main Init ────────────────────────────────────────────────────────────────
function initContact() {
    const form       = document.getElementById('contact-form');
    const submitBtn  = document.getElementById('btn-submit');
    const contactBtn = document.getElementById('btn-contact-us');
    const learnBtn   = document.getElementById('btn-learn-more');

    if (!form) return;

    // Clear error on input
    ['cf-name', 'cf-email', 'cf-phone', 'cf-message'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            const groupId = el.closest('.input-group')?.id;
            if (groupId) clearFieldError(groupId);
        });
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';

        try {
            await sendEmail();
            showSuccess(form);
        } catch (err) {
            console.error('EmailJS error:', err);
            submitBtn.disabled = false;
            submitBtn.textContent = '문의 보내기';
            alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
    });

    // [문의하기] → highlight the form
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            // First scroll Section 7 into view if needed
            const section7 = document.getElementById('section-7');
            section7?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(highlightForm, section7 ? 600 : 0);
        });
    }

    // [더 알아보기] → scroll to FAQ section
    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            const faqSection = document.getElementById('section-faq');
            faqSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}
