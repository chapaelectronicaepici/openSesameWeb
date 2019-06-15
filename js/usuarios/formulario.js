const formularioUsuario = async () => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const idUser = url.searchParams.get("id") || null;
  let method = "POST";
  if (idUser) {
    method = "PUT";
    try {
      const { error, user } = await fetchApi(`/api/users/${idUser}/`);
      if (error) {
        redirectTo("usuarios_listado");
      }
      document.querySelector("#name").value = user.name;
      document.querySelector("#lastName").value = user.lastName;
      document.querySelector("#email").value = user.email;
      document.querySelector("#role").value = user.role;
      document.querySelector("#btnRegistrarUsuario").innerHTML =
        "MODIFICAR USUARIO";
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
          redirectTo("usuarios_listado");
        }
      })
      .catch(err => {
        console.log(err);
        alert("error");
      });
  });
};
