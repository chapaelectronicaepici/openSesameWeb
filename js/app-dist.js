"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (e) {
  function n(e, n) {
    for (var t in n) {
      e[t] = e[t] || n[t];
    }
  }
  function t(e) {
    var n = Object.keys(e).map(function (n) {
      return n + "=" + encodeURIComponent(e[n]);
    });
    return "?" + n.join("&");
  }
  function o(e, o, r, s, i) {
    r.method = e;
    r.headers = r.headers || {};
    r.responseAs = r.responseAs && ["json", "text", "response"].indexOf(r.responseAs) >= 0 ? r.responseAs : "json";
    n(r.headers, {
      Accept: "application/json",
      "Content-Type": "application/json"
    });
    if (i) {
      o += t(i);
    }
    if (s) {
      r.body = JSON.stringify(s);
    } else {
      delete r.body;
    }
    return fetchival.fetch(o, r).then(function (e) {
      if (e.status >= 200 && e.status < 300) {
        if (r.responseAs == "response") return e;
        if (e.status == 204) return null;
        return e[r.responseAs]();
      }
      var n = new Error(e.statusText);
      n.response = e;
      throw n;
    });
  }
  function fetchival(e, t) {
    t = t || {};
    var r = function r(o, _r) {
      o = e + "/" + o;
      _r = _r || {};
      n(_r, t);
      return fetchival(o, _r);
    };
    r.get = function (n) {
      return o("GET", e, t, null, n);
    };
    r.post = function (n) {
      return o("POST", e, t, n);
    };
    r.put = function (n) {
      return o("PUT", e, t, n);
    };
    r.patch = function (n) {
      return o("PATCH", e, t, n);
    };
    r.delete = function () {
      return o("DELETE", e, t);
    };
    return r;
  }
  fetchival.fetch = typeof fetch !== "undefined" ? fetch.bind(e) : null;
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") module.exports = fetchival;else if (typeof define === "function" && define.amd) define(function () {
    return fetchival;
  });else e.fetchival = fetchival;
})(typeof window != "undefined" ? window : undefined);

var config = {
  // api: "http://staff360api.socialpressplugin.xyz:8000"
  api: "http://localhost:8000"
};

var fetchApi = async function fetchApi(endPoint) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "get";
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var token = localStorage.getItem("token");
  if (token !== null) {
    headers.Authorization = "Bearer " + token;
  }
  return fetchival("" + config.api + endPoint, {
    headers: headers
  })[method.toLowerCase()](payload);
};

var loginForm = function loginForm() {
  var $form = $("#formLogin");
  $form.submit(function (event) {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();
    fetchApi("/api/users/login/", {
      email: email,
      password: password
    }, "POST").then(function (response) {
      if (response.error) {
        alert("Error al iniciar sesión, credenciales incorrectas.");
      } else {
        localStorage.setItem("token", response.token);
        redirectTo("usuarios_listado");
      }
    }).catch(function (err) {
      console.log(err);
      alert("error");
    });
  });
};

var formularioUsuario = function formularioUsuario() {
  var $form = $("#formularioUsuario");
  $form.submit(function (event) {
    event.preventDefault();
    var name = $("#name").val();
    var lastName = $("#lastName").val();
    var dni = $("#dni").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var role = $("#role").val();
    var token = localStorage.getItem("token");
    fetchApi("/api/users/", {
      name: name,
      lastName: lastName,
      dni: dni,
      email: email,
      password: password,
      role: role
    }, "POST").then(function (response) {
      if (response.error) {
        alert("Error al guardar al usuario.");
      } else {
        // localStorage.setItem("token", response.token);
        redirectTo("usuarios_listado");
      }
    }).catch(function (err) {
      console.log(err);
      alert("error");
    });
  });
};

var listadoUsuarios = async function listadoUsuarios() {
  $(".btnAgregar").on("click", function (event) {
    event.preventDefault();
    redirectTo("usuarios_formulario");
  });

  var users = await fetchApi("/api/users/");
  $("#usuariosTable").append("\n    <tbody>\n      " + users.map(function (user, index) {
    return "\n          <tr>\n            <td>" + (index + 1) + "</td>\n            <td>" + user.name + " " + user.lastName + "</td>\n            <td>" + user.email + "</td>\n            <td>" + (user.role === "teacher" ? "Profesor" : "Administrador") + "</td>\n            <td>\n              <button type=\"button\" class=\"btn btn-outline-info btn-rounded waves-effect\">\n                <i class=\"fa fa-pen\" aria-hidden=\"true\"></i>\n              </button>\n              <button type=\"button\" class=\"btn btn-danger btn-rounded waves-effect\">\n                <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n              </button>\n            </td>\n          </tr>\n        ";
  }) + "\n    </tbody>\n  ");
};

var formularioCurso = function formularioCurso() {
  var $form = $("#formularioCurso");
  $form.submit(function (event) {
    event.preventDefault();
    var name = $("#name").val();
    var user = $("#userSelect").val();
    fetchApi("/api/courses/", {
      name: name,
      user: user
    }, "POST").then(function (response) {
      if (response.error) {
        alert("Error al guardar al usuario.");
      } else {
        // localStorage.setItem("token", response.token);
        redirectTo("usuarios_listado");
      }
    }).catch(function (err) {
      console.log(err);
      alert("error");
    });
  });

  llenarFormulario();
};

var llenarFormulario = async function llenarFormulario() {
  var users = await fetchApi("/api/users/", {
    role: "teacher"
  });
  $("#userSelect").append("\n    " + users.map(function (user) {
    return "<option value=\"" + user._id + "\">" + user.name + " " + user.lastName + "</option>";
  }) + "\n  ");
};

var listadoCursos = async function listadoCursos() {
  $(".btnAgregar").on("click", function (event) {
    event.preventDefault();
    redirectTo("cursos_formulario");
  });

  var users = await fetchApi("/api/courses/");
};

//@prepros-prepend fetchival.js
//@prepros-prepend config.js
//@prepros-prepend login.js
//@prepros-prepend usuarios/formulario.js
//@prepros-prepend usuarios/listado.js
//@prepros-prepend cursos/formulario.js
//@prepros-prepend cursos/listado.js

var paths = {
  login: "/html/login.html",
  signup: "/html/signup.html",
  usuarios_listado: "/html/usuarios/listado.html",
  usuarios_formulario: "/html/usuarios/formulario.html",
  horarios_listado: "/html/horarios/listado.html",
  horarios_formulario: "/html/horarios/formulario.html",
  cursos_listado: "/html/cursos/listado.html",
  cursos_formulario: "/html/cursos/formulario.html"
};

var redirectTo = function redirectTo(pathName) {
  if (paths[pathName]) window.location.href = paths[pathName];
};

var OpenSesame = function OpenSesame() {
  var _this = this;

  _classCallCheck(this, OpenSesame);

  this.currentPath = "";
  this.currentRoute = "";
  this.currentHref = "";

  this.init = function () {
    _this.setCurrentPath();
    _this.validateIsLogin();
    _this.callScripts();
  };

  this.callScripts = function () {
    switch (_this.currentPath) {
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
    _this.dashboard();
  };

  this.dashboard = async function () {
    if (_this.currentPath === "login") return;
    $("#salir").on("click", function (event) {
      event.preventDefault();
      localStorage.clear();
      redirectTo("login");
    });
    $(".list-group-item,.nav-link").each(function (index, el) {
      if (el.href === _this.currentHref) {
        $(el).addClass("active");
        $(el).parent(".nav-item").addClass("active");
      }
    });
    var name = localStorage.getItem("name");
    if (!name) {
      var user = await fetchApi("/api/users/data/me");
      localStorage.setItem("name", user.name + " " + user.lastName);
    }
    $(".textNombreUsuario").html(name);
  };

  this.setCurrentPath = function () {
    var _window$location = window.location,
        pathname = _window$location.pathname,
        origin = _window$location.origin;

    for (var key in paths) {
      var path = paths[key];
      if (path === pathname) {
        _this.currentPath = key;
        _this.currentRoute = paths[key];
        _this.currentHref = "" + origin + paths[key];
      }
    }
  };

  this.validateIsLogin = function () {
    var token = localStorage.getItem("token");
    if (!token) {
      if (_this.currentPath !== "login") redirectTo("login");
    } else {
      if (_this.currentPath === "login") redirectTo("usuarios_listado");
    }
  };
};

jQuery(document).ready(function () {
  var page = new OpenSesame();
  page.init();
});
//# sourceMappingURL=app-dist.js.map