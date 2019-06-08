const formularioCurso = async () => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const idUser = url.searchParams.get("id") || "";
  let method = "POST";
  if (idUser) {
    method = "PUT";
    try {
      const { error, course } = await fetchApi(`/api/courses/${idUser}`);
      if (error) {
        // redirectTo("cursos_listado");
      }
      $("#name").val(course.name);
      $("#user").val(course.user);
    } catch (error) {
      // redirectTo("cursos_listado");
    }
  }

  const $form = $("#formularioCurso");
  $form.submit(event => {
    event.preventDefault();
    const name = $("#name").val();
    const user = $("#userSelect").val();
    fetchApi(
      `/api/courses/${idUser}`,
      {
        name,
        user
      },
      method
    )
      .then(response => {
        if (response.error) {
          alert("Error al guardar al usuario.");
        } else {
          // localStorage.setItem("token", response.token);
          redirectTo("cursos_listado");
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
  if (users.length === 0) {
    alert("Por favor, registre profesores");
    return;
  }
  $("#userSelect").append(`
    ${users.map(user => {
      return `<option value="${user._id}">${user.name} ${
        user.lastName
      }</option>`;
    })}
  `);
};
