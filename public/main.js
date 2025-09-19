const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active'); // register popup
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active'); // login popup
});

// REGISTER
const registerForm = document.querySelector('.register form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if(data.success){
            alert('✅ Registered! Logging you in...');
            
            // Auto-login after registration
            const loginRes = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const loginData = await loginRes.json();

            if(loginData.success){
                container.classList.remove('active'); // close popup
                alert('✅ Logged in successfully!');
            } else {
                alert('❌ Auto-login failed: ' + loginData.error);
            }
        } else {
            alert('❌ Registration failed: ' + data.error);
        }
    } catch(err) {
        console.error(err);
        alert('❌ Something went wrong!');
    }
});

// LOGIN
const loginForm = document.querySelector('.login form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if(data.success){
            container.classList.remove('active'); // close popup
            alert('✅ Logged in successfully!');
        } else {
            alert('❌ Login failed: ' + data.error);
        }
    } catch(err) {
        console.error(err);
        alert('❌ Something went wrong!');
    }
});
