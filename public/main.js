// Toggle between login and register
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})

// Registration
document.querySelector('.register form').addEventListener('submit', async e => {
    e.preventDefault();
    const username = e.target.querySelector('input[placeholder="Usuario"]').value;
    const password = e.target.querySelector('input[placeholder="Contraseña"]').value;
    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        alert(data.success ? "Registered!" : "Error: " + data.error);
    } catch (err) {
        alert("Server error!");
    }
});

// Login
document.querySelector('.login form').addEventListener('submit', async e => {
    e.preventDefault();
    const username = e.target.querySelector('input[placeholder="Usuario"]').value;
    const password = e.target.querySelector('input[placeholder="Contraseña"]').value;
    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        alert(data.success ? "Logged in!" : "Error: " + data.error);
    } catch (err) {
        alert("Server error!");
    }
});
