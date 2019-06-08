const listadoCursos = async () => {
  $(".btnAgregar").on("click", event => {
    event.preventDefault();
    redirectTo("cursos_formulario");
  });

  const users = await fetchApi("/api/courses/");
};
