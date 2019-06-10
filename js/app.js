//@prepros-prepend fetchival.js
//@prepros-prepend config.js
//@prepros-prepend login.js
//@prepros-prepend usuarios/formulario.js
//@prepros-prepend usuarios/listado.js
//@prepros-prepend cursos/formulario.js
//@prepros-prepend cursos/listado.js
//@prepros-prepend horarios/listado.js

const paths = {
  login: "/html/login.html",
  signup: "/html/signup.html",
  usuarios_listado: "/html/usuarios/listado.html",
  usuarios_formulario: "/html/usuarios/formulario.html",
  horarios_listado: "/html/horarios/listado.html",
  cursos_listado: "/html/cursos/listado.html",
  cursos_formulario: "/html/cursos/formulario.html"
};

const redirectTo = pathName => {
  if (paths[pathName]) window.location.href = paths[pathName];
};

const getRoute = pathName => {
  if (paths[pathName]) return paths[pathName];
  else return "";
};

class OpenSesame {
  currentPath = "";
  currentRoute = "";
  currentHref = "";
  origin = "";
  init = () => {
    this.setCurrentPath();
    this.validateIsLogin();
    this.callScripts();
  };

  callScripts = () => {
    switch (this.currentPath) {
      case "login":
        loginForm(this);
        break;
      case "usuarios_listado":
        listadoUsuarios(this);
        break;
      case "usuarios_formulario":
        formularioUsuario(this);
        break;
      case "cursos_listado":
        listadoCursos(this);
        break;
      case "cursos_formulario":
        formularioCurso();
        break;
      case "horarios_listado":
        configurarHorario();
        break;
      default:
        loginForm();
        break;
    }
    this.dashboard();
  };

  dashboard = async () => {
    if (this.currentPath === "login") return;
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
    const name = localStorage.getItem("name");
    if (!name) {
      const user = await fetchApi("/api/users/data/me");
      localStorage.setItem("name", `${user.name} ${user.lastName}`);
    }
    $(".textNombreUsuario").html(name);
  };

  setCurrentPath = () => {
    const { pathname, origin } = window.location;
    for (let key in paths) {
      const path = paths[key];
      if (path === pathname) {
        this.currentPath = key;
        this.currentRoute = paths[key];
        this.currentHref = `${origin}${paths[key]}`;
        this.origin = origin;
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
