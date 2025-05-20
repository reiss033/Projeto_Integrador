document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    // Validação fictícia
    if (email === 'admin@teste.com' && senha === '1234') {
      window.location.href = 'tela_Central.html';
    } else {
      document.getElementById('mensagemErro').style.display = 'block';
    }
  });