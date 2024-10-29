document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
          
            window.location.href = data.redirect;
        } else {
          
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    }
    
    
});
