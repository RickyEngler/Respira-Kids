document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao cadastrar usuário.');
    }
  });