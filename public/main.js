const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

const registerForm = document.querySelector('.form-box.register form');
const loginForm = document.querySelector('.form-box.login form');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Register submit
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerForm.querySelector('input[placeholder="Usuario"]').value;
    const email = registerForm.querySelector('input[placeholder="Email"]').value;
    const password = registerForm.querySelector('input[placeholder="Contraseña"]').value;

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
            alert(`✅ Registered as ${data.username}`);
            container.classList.remove('active'); // auto-login UI
        } else {
            alert(`❌ ${data.error}`);
        }
    } catch (err) {
        alert("❌ Server error");
    }
});

// Login submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[placeholder="Usuario"]').value;
    const password = loginForm.querySelector('input[placeholder="Contraseña"]').value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            alert(`✅ Logged in as ${data.username}`);
            // redirect or hide login box
        } else {
            alert(`❌ ${data.error}`);
        }
    } catch (err) {
        alert("❌ Server error");
    }
});
