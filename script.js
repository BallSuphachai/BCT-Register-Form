document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const loadingModal = document.getElementById('loadingModal');
    const successModal = document.getElementById('successModal');
    const applyDateInput = document.getElementById('applyDate');
    const academicYearInput = document.getElementById('academicYear');

    // --- Set Current Date & Academic Year ---
    const today = new Date();

    // Set Apply Date
    if (applyDateInput) {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        applyDateInput.value = formattedDate;
    }

    // Set Academic Year (Thai Year)
    if (academicYearInput) {
        // Current Thai Year is Gregorian Year + 543
        const thaiYear = today.getFullYear() + 543;
        academicYearInput.value = thaiYear;
    }

    // --- Prefix Logic ---
    const prefixSelect = document.getElementById('prefix');
    const prefixOtherInput = document.getElementById('prefixOther');

    if (prefixSelect && prefixOtherInput) {
        prefixSelect.addEventListener('change', () => {
            if (prefixSelect.value === 'other') {
                prefixOtherInput.style.display = 'block';
                prefixOtherInput.required = true;
            } else {
                prefixOtherInput.style.display = 'none';
                prefixOtherInput.required = false;
                prefixOtherInput.value = '';
            }
        });
    }

    // --- Vocational Major Logic ---
    const vocationalRadios = document.querySelectorAll('input[name="vocationalType"]');
    const majorBusinessInput = document.getElementById('vocationalMajorBusiness');
    const majorTechnicalInput = document.getElementById('vocationalMajorTechnical');
    const labelMajorBusiness = document.getElementById('labelMajorBusiness');
    const labelMajorTechnical = document.getElementById('labelMajorTechnical');

    function updateVocationalInputs() {
        // Reset both first
        if (majorBusinessInput) {
            majorBusinessInput.style.display = 'none';
            majorBusinessInput.required = false;
        }
        if (majorTechnicalInput) {
            majorTechnicalInput.style.display = 'none';
            majorTechnicalInput.required = false;
        }
        if (labelMajorBusiness) labelMajorBusiness.style.display = 'none';
        if (labelMajorTechnical) labelMajorTechnical.style.display = 'none';

        const selected = document.querySelector('input[name="vocationalType"]:checked');
        if (selected) {
            if (selected.value === 'สายบริหารธุรกิจ') {
                if (majorBusinessInput) {
                    majorBusinessInput.style.display = 'block';
                    majorBusinessInput.required = true;
                }
                if (labelMajorBusiness) labelMajorBusiness.style.display = 'inline';
            } else if (selected.value === 'สายช่าง') {
                if (majorTechnicalInput) {
                    majorTechnicalInput.style.display = 'block';
                    majorTechnicalInput.required = true;
                }
                if (labelMajorTechnical) labelMajorTechnical.style.display = 'inline';
            }
        }
    }

    vocationalRadios.forEach(radio => {
        radio.addEventListener('change', updateVocationalInputs);
    });

    // --- Configuration ---
    // IMPORTANT: The user must replace this URL with their own web app URL after deployment
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6Rc2AjcOo7GW4bAdhiuLKjLmrjHiSkZ0rZMB1z2-YRniIAlz4efwphpkaitv2o9Eg1g/exec';

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Custom validation check (if needed beyond HTML5)
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Show loading
        loadingModal.style.display = 'flex';

        // Collect Data
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Handle Prefix 'other' merge logic for simpler backend handling
        if (data['prefix'] === 'other' && data['prefixOther']) {
            data['prefix'] = data['prefixOther'];
        }

        // We leave vocationalMajor fields as separate keys in 'data' object.
        // Google Script will receive: vocationalType, vocationalMajorBusiness, vocationalMajorTechnical

        try {
            // Check if URL is placeholder
            if (SCRIPT_URL === 'URL Plaese.....') {
                console.warn("Script URL not set. Simulating success.");
                await new Promise(r => setTimeout(r, 1500));
                showSuccess();
            } else {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);

                try {
                    await fetch(SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        redirect: 'follow',
                        body: JSON.stringify(data),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    showSuccess();
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError.name === 'AbortError') {
                        throw new Error('การเชื่อมต่อหมดเวลา (Request Timeout) - กรุณาตรวจสอบอินเทอร์เน็ต');
                    }
                    throw fetchError;
                }

                showSuccess();
            }

        } catch (error) {
            console.error('Error!', error.message);
            alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
            loadingModal.style.display = 'none';
        }
    });

    function showSuccess() {
        loadingModal.style.display = 'none';
        successModal.style.display = 'flex';
        form.reset();

        // Reset UI states
        if (prefixOtherInput) prefixOtherInput.style.display = 'none';

        // Reset vocational inputs
        if (majorBusinessInput) {
            majorBusinessInput.style.display = 'none';
            majorBusinessInput.required = false;
        }
        if (majorTechnicalInput) {
            majorTechnicalInput.style.display = 'none';
            majorTechnicalInput.required = false;
        }
        if (labelMajorBusiness) labelMajorBusiness.style.display = 'none';
        if (labelMajorTechnical) labelMajorTechnical.style.display = 'none';

        // Re-set defaults
        if (applyDateInput) {
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            applyDateInput.value = `${y}-${m}-${d}`;
        }
        if (academicYearInput) {
            academicYearInput.value = today.getFullYear() + 543;
        }
    }
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}