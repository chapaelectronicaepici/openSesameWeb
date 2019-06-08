const formularioUsuario = () => {
  const $form = $("#formularioUsuario");
  $form.submit(event => {
    event.preventDefault();
    const name = $("#name").val();
    const lastName = $("#lastName").val();
    const dni = $("#dni").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const role = $("#role").val();
    const token = localStorage.getItem("token");
    fetchApi(
      "/api/users/",
      {
        name,
        lastName,
        dni,
        email,
        password,
        role
      },
      "POST"
    )
      .then(response => {
        if (response.error) {
          alert("Error al guardar al usuario.");
        } else {
          // localStorage.setItem("token", response.token);
          redirectTo("usuarios_listado");
        }
      })
      .catch(err => {
        console.log(err);
        alert("error");
      });
  });
};
