function cadastrarUsuario() {
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('telefone').value;
    var data_nascimento = document.getElementById('data_nascimento').value;
    var senha = document.getElementById('cadastro-senha').value;

    fetch('/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, email: email, telefone: telefone, data_nascimento: data_nascimento, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    });
};
