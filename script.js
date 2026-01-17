document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const loadingModal = document.getElementById('loadingModal');
    const successModal = document.getElementById('successModal');
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const applyDateInput = document.getElementById('applyDate');

    // --- Set Current Date ---
    if (applyDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        applyDateInput.value = formattedDate;
        applyDateInput.defaultValue = formattedDate;
    }

    // --- Configuration ---
    // IMPORTANT: The user must replace this URL with their own web app URL after deployment
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6Rc2AjcOo7GW4bAdhiuLKjLmrjHiSkZ0rZMB1z2-YRniIAlz4efwphpkaitv2o9Eg1g/exec';

    // --- Image Preview ---
    photoInput.addEventListener('change', function (e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%; border-radius: 10px;">`;
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Show loading
        loadingModal.style.display = 'flex';

        // Collect Data
        const formData = new FormData(form);
        const data = {};

        // Convert FormData to JSON object
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Handle File (Convert to Base64 if needed, usually passed as string for simple Apps Script)
        // Note: Sending large base64 strings might hit limits. For this demo, we'll try to send it if it's small, 
        // or just the name if logic requires more complex handling.
        // For a robust solution, we'd upload to Drive separately, but here we'll try to bundle.
        if (photoInput.files.length > 0) {
            try {
                const base64 = await toBase64(photoInput.files[0]);
                data['studentPhotoBase64'] = base64; // Send base64 data
                data['studentPhotoName'] = photoInput.files[0].name;
            } catch (error) {
                console.error("Error converting image", error);
            }
        }

        // Special handling for checkboxes/radios that might not be in formData if unchecked (though required ones will be)
        // Manually collecting some complex fields if needed, but FormData usually covers named inputs.

        try {
            // In a real scenario, we use fetch. 
            // Since we don't have the real URL yet, we will simulate a success for the UI demo.
            if (SCRIPT_URL === 'URL Plaese.....') {
                console.warn("Script URL not set. Simulating success.");
                await new Promise(r => setTimeout(r, 1500));
                showSuccess();
            } else {
                // Use no-cors mode to allow submission from file:// and arbitrary domains
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    body: JSON.stringify(data)
                });

                // With 'no-cors', we cannot access the response status or body.
                // We assume if the fetch didn't throw a network error, it was sent.
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
        photoPreview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>คลิกเพื่ออัปโหลดรูปภาพ</span>';
    }

    // Helper: Convert file to Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}