document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário

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
            // Se o login for bem-sucedido, redireciona para a página home
            window.location.href = data.redirect;
        } else {
            // Exibe a mensagem de erro recebida do servidor
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao realizar o login:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    }
    
    
});
