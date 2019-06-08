const listadoUsuarios = page => {
  $(".btnAgregar").on("click", event => {
    event.preventDefault();
    redirectTo("usuarios_formulario");
  });

  renderUsuarios();
};

const renderUsuarios = async () => {
  const users = await fetchApi("/api/users/");
  $("#usuariosTable tbody").html("");
  $("#usuariosTable").append(`
    <tbody>
      ${users.map((user, index) => {
        const popup = `
          <div class="modal fade" id="confirmDeleteUser${
            user._id
          }" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">¿Seguro que desea eliminar el usuario?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    Ya no podrá acceder a este usuario despues.
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="eliminarUsuario('${
                      user._id
                    }')">Eliminar</button>
                  </div>
                </div>
              </div>
        </div>
        `;

        const html = `
          <tr>
            <td>${index + 1}</td>
            <td>${user.name} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role === "teacher" ? "Profesor" : "Administrador"}</td>
            <td>
              <a href="${getRoute("usuarios_formulario")}?id=${
          user._id
        }" type="button" class="btn btn-outline-info btn-rounded waves-effect">
                <i class="fa fa-pen" aria-hidden="true"></i>
              </a>
              <button type="button" class="btn btn-danger btn-rounded waves-effect" data-toggle="modal" data-target="#confirmDeleteUser${
                user._id
              }">
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </td>
            <td>
              ${popup}
            </td>
          </tr>
        `;
        return html;
      })}
    </tbody>
  `);
};

const eliminarUsuario = async id => {
  const userDelete = await fetchApi(`/api/users/${id}/`, {}, "DELETE");
  renderUsuarios();
};
