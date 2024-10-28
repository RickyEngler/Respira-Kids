function logar() {
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.href = "../views/home.html"; // Redireciona para a página ../views/home.html se o login for bem-sucedido
        } else {
            alert('Usuário e/ou senha incorretos');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar logar:', error);
        alert('Erro desconhecido. Tente novamente mais tarde.');
    });
}