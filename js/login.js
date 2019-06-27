const loginForm = () => {
  const $form = $("#formLogin");
  const spinner = document.querySelector("#spinLogin");
  const error = document.querySelector("#errorLogin");

  $("#email, #password").on("keyup", event => {
    error.classList.add("hidden");
  });

  $form.submit(event => {
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    if (email.trim() === "" || password.trim() === "") {
      return null;
    }
    spinner.classList.remove("hidden");
    fetchApi(
      `/api/users/login/`,
      {
        email,
        password
      },
      "POST"
    )
      .then(response => {
        console.log("response", response);
        if (response.data.role !== "administrator") {
          localStorage.clear();
          redirectTo("login");
          return;
        }
        if (response.error) {
          alert("Error al iniciar sesión, credenciales incorrectas.");
        } else {
          localStorage.setItem("token", response.token);
          redirectTo("usuarios_listado");
        }
      })
      .catch(function(err) {
        spinner.classList.add("hidden");
        error.classList.remove("hidden");
      });
  });
};
