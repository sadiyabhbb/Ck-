const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

const registerForm = document.querySelector('.form-box.register form');
const loginForm = document.querySelector('.form-box.login form');

registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// REGISTER
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
        alert(data.success ? `Registered as ${data.username}` : data.error);
        if(data.success) container.classList.remove('active'); // auto switch to login
    } catch (err) { console.error(err); }
});

// LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('input[placeholder="Usuario"]').value;
    const password = loginForm.querySelector('input[placeholder="Contraseña"]').value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        alert(data.success ? `Logged in as ${data.username}` : data.error);
        if(data.success){
            // hide login popup or redirect to dashboard
            alert("Now you can use Monitor dashboard!");
        }
    } catch (err) { console.error(err); }
});
