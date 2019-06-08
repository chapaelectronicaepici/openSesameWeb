const formularioCurso = () => {
  const $form = $("#formularioCurso");
  $form.submit(event => {
    event.preventDefault();
    const name = $("#name").val();
    const lastName = $("#lastName").val();
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

  llenarFormulario();
};

const llenarFormulario = async () => {
  const users = await fetchApi("/api/users/", {
    role: "teacher"
  });
  $("#roleSelect").append(`
    ${users.map(user => {
      return `<option value="${user._id}">${user.name} ${
        user.lastName
      }</option>`;
    })}
  `);
};
