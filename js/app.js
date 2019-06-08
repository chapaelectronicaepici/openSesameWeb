//@prepros-prepend fetchival.js
//@prepros-prepend config.js
//@prepros-prepend login.js
//@prepros-prepend usuarios/formulario.js
//@prepros-prepend usuarios/listado.js
//@prepros-prepend cursos/formulario.js
//@prepros-prepend cursos/listado.js

const paths = {
  login: "/html/login.html",
  signup: "/html/signup.html",
  usuarios_listado: "/html/usuarios/listado.html",
  usuarios_formulario: "/html/usuarios/formulario.html",
  horarios_listado: "/html/horarios/listado.html",
  horarios_formulario: "/html/horarios/formulario.html",
  cursos_listado: "/html/cursos/listado.html",
  cursos_formulario: "/html/cursos/formulario.html"
};

const redirectTo = pathName => {
  if (paths[pathName]) window.location.href = paths[pathName];
};

class OpenSesame {
  currentPath = "";
  currentRoute = "";
  currentHref = "";
  init = () => {
    this.setCurrentPath();
    this.validateIsLogin();
    this.callScripts();
  };

  callScripts = () => {
    switch (this.currentPath) {
      case "login":
        loginForm();
        break;
      case "usuarios_listado":
        listadoUsuarios();
        break;
      case "usuarios_formulario":
        formularioUsuario();
        break;
      case "cursos_listado":
        listadoCursos();
        break;
      case "cursos_formulario":
        formularioCurso();
        break;
      default:
        loginForm();
        break;
    }
    this.dashboard();
  };

  dashboard = () => {
    $("#salir").on("click", event => {
      event.preventDefault();
      localStorage.clear();
      redirectTo("login");
    });

    $(".list-group-item,.nav-link").each((index, el) => {
      if (el.href === this.currentHref) {
        $(el).addClass("active");
        $(el)
          .parent(".nav-item")
          .addClass("active");
      }
    });

    fetchApi("/api/users/data/me")
      .then(res => {
        $(".textNombreUsuario").html(res.name);
      })
      .catch(err => {
        console.log(err);
      });
  };

  setCurrentPath = () => {
    const { pathname, origin } = window.location;
    for (let key in paths) {
      const path = paths[key];
      if (path === pathname) {
        this.currentPath = key;
        this.currentRoute = paths[key];
        this.currentHref = `${origin}${paths[key]}`;
      }
    }
  };

  validateIsLogin = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (this.currentPath !== "login") redirectTo("login");
    } else {
      if (this.currentPath === "login") redirectTo("usuarios_listado");
    }
  };
}

jQuery(document).ready(() => {
  const page = new OpenSesame();
  page.init();
});
