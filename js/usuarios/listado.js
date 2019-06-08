const listadoUsuarios = async () => {
  $(".btnAgregar").on("click", event => {
    event.preventDefault();
    redirectTo("usuarios_formulario");
  });

  const users = await fetchApi("/api/users/");
  $("#usuariosTable").append(`
    <tbody>
      ${users.map((user, index) => {
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${user.name} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role === "teacher" ? "Profesor" : "Administrador"}</td>
            <td>
              <button type="button" class="btn btn-outline-info btn-rounded waves-effect">
                <i class="fa fa-pen" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-danger btn-rounded waves-effect">
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        `;
      })}
    </tbody>
  `);
};
