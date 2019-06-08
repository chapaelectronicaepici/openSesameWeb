const listadoCursos = async () => {
  $(".btnAgregar").on("click", event => {
    event.preventDefault();
    redirectTo("cursos_formulario");
  });
console.log('xvx')

  const course = await fetchApi("/api/courses/");
  $("#cursosTable").append(`
    <tbody>
      ${course.map((course, index) => {
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${course.name} </td>
            <td>${course.user.name} ${course.user.lastName}</td>
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
