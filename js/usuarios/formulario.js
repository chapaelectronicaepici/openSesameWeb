const formularioUsuario = async () => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const idUser = url.searchParams.get("id") || "";
  let method = "POST";
  if (idUser) {
    method = "PUT";
    try {
      const { error, user } = await fetchApi(`/api/users/${idUser}`);
      if (error) {
        redirectTo("usuarios_listado");
      }
      $("#name").val(user.name);
      $("#lastName").val(user.lastName);
      $("#dni").val(user.dni);
      $("#email").val(user.email);
      $("#password").val(user.password);
      $("#role").val(user.role);
    } catch (error) {
      redirectTo("usuarios_listado");
    }
  }
  const $form = $("#formularioUsuario");
  $form.submit(event => {
    event.preventDefault();
    const name = $("#name")
      .val()
      .trim();
    const lastName = $("#lastName")
      .val()
      .trim();
    const dni = $("#dni")
      .val()
      .trim();
    const email = $("#email")
      .val()
      .trim();
    const password = $("#password")
      .val()
      .trim();
    const role = $("#role").val();
    fetchApi(
      `/api/users/${idUser}`,
      {
        name,
        lastName,
        dni,
        email,
        password,
        role
      },
      method
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
