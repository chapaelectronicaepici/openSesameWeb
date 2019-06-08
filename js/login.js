const loginForm = () => {
  const $form = $("#formLogin");
  $form.submit(event => {
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    fetchApi(
      `/api/users/login/`,
      {
        email,
        password
      },
      "POST"
    )
      .then(response => {
        if (response.error) {
          alert("Error al iniciar sesión, credenciales incorrectas.");
        } else {
          localStorage.setItem("token", response.token);
          redirectTo("usuarios_listado");
        }
      })
      .catch(function(err) {
        console.log(err);
        alert("error");
      });
  });
};
