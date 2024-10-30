document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('respiracao-video');
    const respostaContainer = document.getElementById('resposta-container');
    const videoPrincipal = '/assets/PRINCIPAL.mp4';
    const videoRespostaSim = '/assets/SIM.mp4'; 
    const videoRespostaNao = '/assets/NÃO.mp4'; 

    // Definir o volume para 30%
    video.volume = 0.3;

    function mostrarRespostas() {
        respostaContainer.style.display = 'block';
    }

    video.onended = mostrarRespostas;


    document.getElementById('sim-btn').onclick = function() {
        respostaContainer.style.display = 'none'; 
        video.src = videoRespostaSim; 
        video.play();

        video.onended = function() {
            alert('Obrigado por participar!');
            window.location.href = '/';
        };
    };

    document.getElementById('nao-btn').onclick = function() {
        respostaContainer.style.display = 'none';
        video.src = videoRespostaNao;
        video.play();

        video.onended = function() {
            respostaContainer.style.display = 'block'; 
        };
    };
});
