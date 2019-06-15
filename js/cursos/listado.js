const listadoCursos = () => {
  $(".btnAgregar").on("click", event => {
    event.preventDefault();
    redirectTo("cursos_formulario");
  });
  renderCursos();
};

const renderCursos = async () => {
  const courses = await fetchApi("/api/courses/");
  document.querySelector("#cursosTable tbody").innerHTML = "";
  document.querySelector("#cursosTable tbody").innerHTML = `
    <tbody>
      ${courses.map((course, index) => {
        const popup = `
          <div class="modal fade" id="confirmDeleteCurso${
            course._id
          }" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">¿Seguro que desea eliminar el curso?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    Ya no podrá acceder a este curso despues.
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="eliminarCurso('${
                      course._id
                    }')">Eliminar</button>
                  </div>
                </div>
              </div>
        </div>
        `;
        let userName = "No asignado";
        if (course.user)
          userName = `${course.user.name} ${course.user.lastName}`;

        return `
          <tr>
            <td>${index + 1}</td>
            <td>${course.name}</td>
            <td>${userName}</td>
            <td>
              <a href="${getRoute("cursos_formulario")}?id=${
          course._id
        }" type="button" class="btn btn-outline-info btn-rounded waves-effect">
                <i class="fa fa-pen" aria-hidden="true"></i>
              </a>
              <button type="button" class="btn btn-danger btn-rounded waves-effect" data-toggle="modal" data-target="#confirmDeleteCurso${
                course._id
              }">
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </td>
            <td>${popup} </td>
          </tr>
        `;
      })}
    </tbody>
  `;
};

const eliminarCurso = async id => {
  await fetchApi(`/api/courses/${id}/`, {}, "DELETE");
  renderCursos();
};
