"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  api: "https://shielded-thicket-71693.herokuapp.com"
  // api: "http://staff360api.socialpressplugin.xyz:8000"
  // api: "http://localhost:8000"
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
  var spinner = document.querySelector("#spinLogin");
  var error = document.querySelector("#errorLogin");

  $("#email, #password").on("keyup", function (event) {
    error.classList.add("hidden");
  });

  $form.submit(function (event) {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();

    if (email.trim() === "" || password.trim() === "") {
      return null;
    }
    spinner.classList.remove("hidden");
    fetchApi("/api/users/login/", {
      email: email,
      password: password
    }, "POST").then(function (response) {
      console.log("response", response);
      if (response.data.role !== "administrator") {
        localStorage.clear();
        redirectTo("login");
        return;
      }
      if (response.error) {
        alert("Error al iniciar sesión, credenciales incorrectas.");
      } else {
        localStorage.setItem("token", response.token);
        redirectTo("usuarios_listado");
      }
    }).catch(function (err) {
      spinner.classList.add("hidden");
      error.classList.remove("hidden");
    });
  });
};

var formularioUsuario = async function formularioUsuario() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var idUser = url.searchParams.get("id") || null;
  var method = "POST";
  if (idUser) {
    method = "PUT";
    try {
      var _ref = await fetchApi("/api/users/" + idUser + "/"),
          error = _ref.error,
          user = _ref.user;

      if (error) {
        redirectTo("usuarios_listado");
      }
      document.querySelector("#name").value = user.name;
      document.querySelector("#lastName").value = user.lastName;
      document.querySelector("#email").value = user.email;
      document.querySelector("#role").value = user.role;
      document.querySelector("#btnRegistrarUsuario").innerHTML = "MODIFICAR USUARIO";
    } catch (error) {
      redirectTo("usuarios_listado");
    }
  }
  var $form = $("#formularioUsuario");
  $form.submit(function (event) {
    event.preventDefault();
    var name = $("#name").val().trim();
    var lastName = $("#lastName").val().trim();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    var role = $("#role").val();
    fetchApi("/api/users/" + (idUser || ""), {
      name: name,
      lastName: lastName,
      email: email,
      password: password,
      role: role
    }, method).then(function (response) {
      if (response.error) {
        alert("Error al guardar al usuario.");
      } else {
        redirectTo("usuarios_listado");
      }
    }).catch(function (err) {
      console.log(err);
      alert("error");
    });
  });
};

var listadoUsuarios = function listadoUsuarios(page) {
  $(".btnAgregar").on("click", function (event) {
    event.preventDefault();
    redirectTo("usuarios_formulario");
  });

  renderUsuarios();
};

var renderUsuarios = async function renderUsuarios() {
  var users = await fetchApi("/api/users/");
  document.querySelector("#usuariosTable tbody").innerHTML = "";
  document.querySelector("#usuariosTable tbody").innerHTML = "\n    <tbody>\n      " + users.map(function (user, index) {
    var popup = "\n          <div class=\"modal fade\" id=\"confirmDeleteUser" + user._id + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\"\n              aria-hidden=\"true\">\n              <div class=\"modal-dialog\" role=\"document\">\n                <div class=\"modal-content\">\n                  <div class=\"modal-header\">\n                    <h5 class=\"modal-title\" id=\"exampleModalLabel\">\xBFSeguro que desea eliminar el usuario?</h5>\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                      <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                  </div>\n                  <div class=\"modal-body\">\n                    Ya no podr\xE1 acceder a este usuario despues.\n                  </div>\n                  <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cerrar</button>\n                    <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" onclick=\"eliminarUsuario('" + user._id + "')\">Eliminar</button>\n                  </div>\n                </div>\n              </div>\n        </div>\n        ";

    var html = "\n          <tr>\n            <td>" + (index + 1) + "</td>\n            <td>" + user.name + " " + user.lastName + "</td>\n            <td>" + user.email + "</td>\n            <td>" + (user.role === "teacher" ? "Docente" : "Administrador") + "</td>\n            <td>\n              <a href=\"" + getRoute("usuarios_formulario") + "?id=" + user._id + "\" type=\"button\" class=\"btn btn-outline-info btn-rounded waves-effect\">\n                <i class=\"fa fa-pen\" aria-hidden=\"true\"></i>\n              </a>\n              <button type=\"button\" class=\"btn btn-danger btn-rounded waves-effect\" data-toggle=\"modal\" data-target=\"#confirmDeleteUser" + user._id + "\">\n                <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n              </button>\n            </td>\n            <td>\n              " + popup + "\n            </td>\n          </tr>\n        ";
    return html;
  }) + "\n    </tbody>\n  ";
};

var eliminarUsuario = async function eliminarUsuario(id) {
  var userDelete = await fetchApi("/api/users/" + id + "/", {}, "DELETE");
  renderUsuarios();
};

var formularioCurso = async function formularioCurso() {
  await llenarFormulario();
  var url_string = window.location.href;
  var url = new URL(url_string);
  var idCourse = url.searchParams.get("id") || null;
  var method = "POST";
  if (idCourse) {
    method = "PUT";
    try {
      var _ref2 = await fetchApi("/api/courses/" + idCourse + "/"),
          error = _ref2.error,
          course = _ref2.course;

      if (error) {
        redirectTo("cursos_listado");
      }
      document.querySelector("#name").value = course.name;
      document.querySelector("#userSelect").value = course.user._id;
      document.querySelector("#btnRegistrarButton").innerHTML = "MODIFICAR CURSO";
      horarioList = course.schedules;
      renderHorarioTable();
    } catch (error) {
      redirectTo("cursos_listado");
    }
  }

  var $form = $("#formularioCurso");
  $form.submit(function (event) {
    event.preventDefault();

    if (horarioList.length === 0) {
      alert("Debe de registrar al menos un horario.");
      return;
    }

    var name = $("#name").val();
    var user = $("#userSelect").val();
    if (!name || !user) {
      return;
    }
    fetchApi("/api/courses/" + (idCourse || ""), {
      name: name,
      user: user,
      schedules: horarioList
    }, method).then(function (response) {
      if (response.error) {
        alert("Error al guardar el curso.");
      } else {
        redirectTo("cursos_listado");
      }
    }).catch(function (err) {
      console.log(err);
      alert("error");
    });
  });
};

var llenarFormulario = async function llenarFormulario() {
  var users = await fetchApi("/api/users/", {
    role: "teacher"
  });
  if (users.length === 0) {
    alert("Por favor, registre profesores");
    return;
  }
  $("#userSelect").append("\n    " + users.map(function (user) {
    return "<option value=\"" + user._id + "\">" + user.name + " " + user.lastName + "</option>";
  }) + "\n  ");

  $(".btnAgregarHorario").on("click", function (event) {
    event.preventDefault();
    showFormularioHorario();
  });
};

var showFormularioHorario = function showFormularioHorario(edit) {
  $(".formularioHorario").removeClass("formHidden");
  $("#closeFormularioHorario,#formularioHorario .close").unbind("click");
  $("#btnSubmitFormularioHorario").unbind("click");
  $("#closeFormularioHorario,#formularioHorario .close").on("click", function (evt) {
    $(".formularioHorario").addClass("formHidden");
    currentHorario = {
      isNew: true,
      day: 0
    };
  });

  $("#btnSubmitFormularioHorario").on("click", function (evt) {
    evt.preventDefault();
    saveHorario();
  });
  $("#daySelect").on("change", function (event) {
    currentHorario.day = $(this).val();
  });
  if (edit !== true) setDefaultValuesFormHorario();
};

var currentHorario = {
  isNew: true,
  day: 0
};

var horarioList = [];

var daysName = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

var saveHorario = async function saveHorario() {
  if (currentHorario.isNew) {
    horarioList.push(currentHorario);
  } else {
    horarioList[currentHorario.index] = _extends({}, currentHorario);
  }
  currentHorario = {
    isNew: true,
    day: 0
  };
  renderHorarioTable();
  $(".formularioHorario").addClass("formHidden");
  setDefaultValuesFormHorario();
};

var renderHorarioTable = function renderHorarioTable() {
  document.querySelector("#horarioTable tbody").innerHTML = "";
  document.querySelector("#horarioTable").innerHTML = "\n    <tbody>\n      " + horarioList.map(function (horario, index) {
    var popup = "\n          <div class=\"modal fade\" id=\"confirmDeleteHorario" + index + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\"\n              aria-hidden=\"true\">\n              <div class=\"modal-dialog\" role=\"document\">\n                <div class=\"modal-content\">\n                  <div class=\"modal-header\">\n                    <h5 class=\"modal-title\" id=\"exampleModalLabel\">\xBFSeguro que desea eliminar el horario?</h5>\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                      <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                  </div>\n                  <div class=\"modal-body\">\n                    Ya no podr\xE1 acceder a este horario despues.\n                  </div>\n                  <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cerrar</button>\n                    <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" onclick=\"eliminarHorario(" + index + ")\">Eliminar</button>\n                  </div>\n                </div>\n              </div>\n        </div>\n        ";

    var html = "\n          <tr>\n            <td>" + (index + 1) + "</td>\n            <td>" + daysName[horario.day] + "</td>\n            <td>" + moment(horario.startTime).format("HH:mm") + "</td>\n            <td>" + moment(horario.endTime).format("HH:mm") + "</td>\n            <td>\n              <button type=\"button\" class=\"btn btn-outline-info btn-rounded waves-effect\" onclick=\"editarHorario(" + index + ")\">\n                <i class=\"fa fa-pen\" aria-hidden=\"true\"></i>\n              </button>\n              <button type=\"button\" class=\"btn btn-danger btn-rounded waves-effect\" data-toggle=\"modal\" data-target=\"#confirmDeleteHorario" + index + "\">\n                <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n              </button>\n            </td>\n            <td>\n              " + popup + "\n            </td>\n          </tr>\n        ";
    return html;
  }) + "\n    </tbody>\n  ";
};

var setDateTimePicker = function setDateTimePicker(selector, date, min, max, fieldName) {
  var defaultTime = !moment(date).isValid() ? date : moment(date).format("HH:mm");
  $(selector).timepicker("destroy");
  $(selector).timepicker({
    timeFormat: "HH:mm",
    interval: 50, // minutes
    minTime: min,
    maxTime: max,
    defaultTime: defaultTime,
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    change: function change(time) {
      currentHorario[fieldName] = time;
      // validateTime();
    }
  });
};

//let newMinStartTime = null;
//let newMinEndTime = null;

/*const validateTime = () => {
  console.log("---------");
  console.log(currentHorario.startTime);
  console.log(currentHorario.endTime);
  console.log("---------");

  const minEndTime = currentHorario.startTime;
  const minStartTime = currentHorario.endTime;
  if (
    moment(minEndTime).isSame(newMinEndTime) &&
    moment(minStartTime).isSame(newMinStartTime)
  ) {
    return;
  }
  newMinEndTime = minEndTime;
  newMinStartTime = minStartTime;
  //if (moment(currentHorario.startTime).isAfter(currentHorario.endTime)) {
  setDateTimePicker(
    "#timepickerStart",
    newMinEndTime,
    moment(newMinEndTime).format("HH:mm"),
    "19:30",
    "endTime"
  );

  setDateTimePicker(
    "#timepickerEnd",
    newMinStartTime,
    moment(newMinStartTime).format("HH:mm"),
    "19:30",
    "endTime"
  );
  // console.log("after start to end");
  //}
  //if (moment(currentHorario.endTime).isAfter(currentHorario.starTime)) {
  // console.log("after end to start");

  //}
};*/

var editarHorario = function editarHorario(index) {
  var horario = horarioList[index];
  currentHorario = _extends({}, horario);
  currentHorario.isNew = false;
  currentHorario.index = index;
  showFormularioHorario(true);
  $("#btnSubmitFormularioHorario").html("MODIFICAR");
  $("#formularioHorario .h4").html("MODIFICAR HORARIO");
  $("#daySelect").val(String(horario.day));
  setDateTimePicker("#timepickerStart", horario.startTime, "7:30", "19:30", "startTime");
  setDateTimePicker("#timepickerEnd", horario.endTime, "8:20", "19:30", "endTime");
};

var eliminarHorario = function eliminarHorario(index) {
  horarioList = horarioList.filter(function (el, pos) {
    return index !== pos;
  });
  renderHorarioTable();
  $(".modal-backdrop").remove();
};

var setDefaultValuesFormHorario = function setDefaultValuesFormHorario() {
  $("#daySelect").val("0");
  $("#daySelect").on("change", function (event) {
    currentHorario.day = $(this).val();
  });
  setDateTimePicker("#timepickerStart", "7:30", "7:30", "19:30", "startTime");
  setDateTimePicker("#timepickerEnd", "8:20", "8:20", "19:30", "endTime");
};

var listadoCursos = function listadoCursos() {
  $(".btnAgregar").on("click", function (event) {
    event.preventDefault();
    redirectTo("cursos_formulario");
  });
  renderCursos();
};

var renderCursos = async function renderCursos() {
  var courses = await fetchApi("/api/courses/");
  document.querySelector("#cursosTable tbody").innerHTML = "";
  document.querySelector("#cursosTable tbody").innerHTML = "\n    <tbody>\n      " + courses.map(function (course, index) {
    var popup = "\n          <div class=\"modal fade\" id=\"confirmDeleteCurso" + course._id + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\"\n              aria-hidden=\"true\">\n              <div class=\"modal-dialog\" role=\"document\">\n                <div class=\"modal-content\">\n                  <div class=\"modal-header\">\n                    <h5 class=\"modal-title\" id=\"exampleModalLabel\">\xBFSeguro que desea eliminar el curso?</h5>\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                      <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                  </div>\n                  <div class=\"modal-body\">\n                    Ya no podr\xE1 acceder a este curso despues.\n                  </div>\n                  <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cerrar</button>\n                    <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" onclick=\"eliminarCurso('" + course._id + "')\">Eliminar</button>\n                  </div>\n                </div>\n              </div>\n        </div>\n        ";
    var userName = "No asignado";
    if (course.user) userName = course.user.name + " " + course.user.lastName;

    return "\n          <tr>\n            <td>" + (index + 1) + "</td>\n            <td>" + course.name + "</td>\n            <td>" + userName + "</td>\n            <td>\n              <a href=\"" + getRoute("cursos_formulario") + "?id=" + course._id + "\" type=\"button\" class=\"btn btn-outline-info btn-rounded waves-effect\">\n                <i class=\"fa fa-pen\" aria-hidden=\"true\"></i>\n              </a>\n              <button type=\"button\" class=\"btn btn-danger btn-rounded waves-effect\" data-toggle=\"modal\" data-target=\"#confirmDeleteCurso" + course._id + "\">\n                <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n              </button>\n            </td>\n            <td>" + popup + " </td>\n          </tr>\n        ";
  }) + "\n    </tbody>\n  ";
};

var eliminarCurso = async function eliminarCurso(id) {
  await fetchApi("/api/courses/" + id + "/", {}, "DELETE");
  renderCursos();
};

var configurarHorario = async function configurarHorario() {
  var baseDate = moment().day(1).set({
    minutes: 0,
    hours: 0
  });
  var courses = await fetchApi("/api/courses/");
  var schedulesR = [];

  var codesColor = ["#66DCC0", "#CC833F", "#3FB9CC", "#FFA66B", "#EE7E14", "#B6E587", "#D3D3BA", "#D67642", "#6BFFF0", "#64EFAA", "#ACC4EF", "#f7f957", "#F7BD51", "#B6F957", "#B6F957"];
  courses.forEach(function (_ref3, index) {
    var schedules = _ref3.schedules,
        name = _ref3.name;

    schedules.forEach(function (schedule) {
      var durationStart = moment(schedule.startTime);
      var durationEnd = moment(schedule.endTime);
      schedulesR.push({
        textColor: "#000000",
        textAlign: "center",
        backgroundColor: codesColor[index],
        borderColor: codesColor[index],
        title: name,
        nowIndicator: true,
        start: baseDate.clone().add({
          days: schedule.day,
          minutes: durationStart.minutes(),
          hours: durationStart.hours(),
          seconds: durationStart.seconds()
        }).toDate(),
        end: baseDate.clone().add({
          days: schedule.day,
          minutes: durationEnd.minutes(),
          hours: durationEnd.hours(),
          seconds: durationEnd.seconds()
        }).toDate()
      });
    });
  });
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ["dayGrid", "timeGrid"],
    header: {
      left: "",
      center: "",
      right: ""
    },
    weekends: false,
    selectable: false,
    selectHelper: false,
    editable: false,
    eventLimit: true,
    defaultView: "timeGridWeek",
    allDaySlot: false,
    minTime: "07:30:00",
    maxTime: "20:10:00",
    scrollTime: "20:10:00",
    defaultDate: baseDate.toDate(),
    slotDuration: { minutes: 50 },
    showNonCurrentDates: false,
    firstDay: 1,
    columnHeaderText: function columnHeaderText(date) {
      return daysName[moment(date).day() !== 0 ? moment(date).day() - 1 : 6];
    },
    events: schedulesR
  });

  calendar.render();
};

//@prepros-prepend fetchival.js
//@prepros-prepend config.js
//@prepros-prepend login.js
//@prepros-prepend usuarios/formulario.js
//@prepros-prepend usuarios/listado.js
//@prepros-prepend cursos/formulario.js
//@prepros-prepend cursos/listado.js
//@prepros-prepend horarios/listado.js

var paths = {
  login: "/html/login.html",
  signup: "/html/signup.html",
  usuarios_listado: "/html/usuarios/listado.html",
  usuarios_formulario: "/html/usuarios/formulario.html",
  horarios_listado: "/html/horarios/listado.html",
  cursos_listado: "/html/cursos/listado.html",
  cursos_formulario: "/html/cursos/formulario.html"
};

var redirectTo = function redirectTo(pathName) {
  if (paths[pathName]) window.location.href = paths[pathName];
};

var getRoute = function getRoute(pathName) {
  if (paths[pathName]) return paths[pathName];else return "";
};

var OpenSesame = function OpenSesame() {
  var _this = this;

  _classCallCheck(this, OpenSesame);

  this.currentPath = "";
  this.currentRoute = "";
  this.currentHref = "";
  this.origin = "";

  this.init = function () {
    _this.setCurrentPath();
    _this.validateIsLogin();
    _this.callScripts();
  };

  this.callScripts = function () {
    switch (_this.currentPath) {
      case "login":
        loginForm(_this);
        break;
      case "usuarios_listado":
        listadoUsuarios(_this);
        break;
      case "usuarios_formulario":
        formularioUsuario(_this);
        break;
      case "cursos_listado":
        listadoCursos(_this);
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
      name = localStorage.getItem("name");
    }
    document.querySelector(".textNombreUsuario").innerHTML = name;
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
        _this.origin = origin;
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