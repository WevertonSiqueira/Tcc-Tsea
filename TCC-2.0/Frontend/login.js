document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("email").value;
    let senha = document.getElementById("password").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos");
        return;
    }

    if (senha.length < 6) {
        alert("O mínimo de caracteres é 6");
        return;
    }

    alert("Login realizado com sucesso!");
});

function mostrarSenha() {

    let campo = document.getElementById("password");

    if (campo.type === "password") {
        campo.type = "text";
    } else {
        campo.type = "password";
    }
}