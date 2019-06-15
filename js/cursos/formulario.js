const formularioCurso = async () => {
  await llenarFormulario();
  const url_string = window.location.href;
  const url = new URL(url_string);
  const idCourse = url.searchParams.get("id") || null;
  let method = "POST";
  if (idCourse) {
    method = "PUT";
    try {
      const { error, course } = await fetchApi(`/api/courses/${idCourse}/`);
      if (error) {
        redirectTo("cursos_listado");
      }
      document.querySelector("#name").value = course.name;
      document.querySelector("#userSelect").value = course.user._id;
      document.querySelector("#btnRegistrarButton").innerHTML =
        "MODIFICAR CURSO";
      horarioList = course.schedules;
      renderHorarioTable();
    } catch (error) {
      redirectTo("cursos_listado");
    }
  }

  const $form = $("#formularioCurso");
  $form.submit(event => {
    event.preventDefault();

    if (horarioList.length === 0) {
      alert("Debe de registrar al menos un horario.");
      return;
    }

    const name = $("#name").val();
    const user = $("#userSelect").val();
    fetchApi(
      `/api/courses/${idCourse}`,
      {
        name,
        user,
        schedules: horarioList
      },
      method
    )
      .then(response => {
        if (response.error) {
          alert("Error al guardar el curso.");
        } else {
          redirectTo("cursos_listado");
        }
      })
      .catch(err => {
        console.log(err);
        alert("error");
      });
  });
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

  $(".btnAgregarHorario").on("click", event => {
    event.preventDefault();
    showFormularioHorario();
  });
};

const showFormularioHorario = edit => {
  $(".formularioHorario").removeClass("formHidden");
  $("#closeFormularioHorario,#formularioHorario .close").unbind("click");
  $("#btnSubmitFormularioHorario").unbind("click");
  $("#closeFormularioHorario,#formularioHorario .close").on("click", evt => {
    $(".formularioHorario").addClass("formHidden");
    currentHorario = {
      isNew: true,
      day: 0
    };
  });

  $("#btnSubmitFormularioHorario").on("click", evt => {
    evt.preventDefault();
    saveHorario();
  });
  $("#daySelect").on("change", function(event) {
    currentHorario.day = $(this).val();
  });
  if (edit !== true) setDefaultValuesFormHorario();
};

let currentHorario = {
  isNew: true,
  day: 0
};

let horarioList = [];

const daysName = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO"
];

const saveHorario = async () => {
  if (currentHorario.isNew) {
    horarioList.push(currentHorario);
  } else {
    horarioList[currentHorario.index] = { ...currentHorario };
  }
  currentHorario = {
    isNew: true,
    day: 0
  };
  renderHorarioTable();
  $(".formularioHorario").addClass("formHidden");
  setDefaultValuesFormHorario();
};

const renderHorarioTable = () => {
  document.querySelector("#horarioTable tbody").innerHTML = "";
  document.querySelector("#horarioTable").innerHTML = `
    <tbody>
      ${horarioList.map((horario, index) => {
        const popup = `
          <div class="modal fade" id="confirmDeleteHorario${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">¿Seguro que desea eliminar el horario?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    Ya no podrá acceder a este horario despues.
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="eliminarHorario(${index})">Eliminar</button>
                  </div>
                </div>
              </div>
        </div>
        `;

        const html = `
          <tr>
            <td>${index + 1}</td>
            <td>${daysName[horario.day]}</td>
            <td>${moment(horario.startTime).format("HH:mm")}</td>
            <td>${moment(horario.endTime).format("HH:mm")}</td>
            <td>
              <button type="button" class="btn btn-outline-info btn-rounded waves-effect" onclick="editarHorario(${index})">
                <i class="fa fa-pen" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-danger btn-rounded waves-effect" data-toggle="modal" data-target="#confirmDeleteHorario${index}">
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
  `;
};

const setDateTimePicker = (selector, date, min, max, fieldName) => {
  const defaultTime = !moment(date).isValid()
    ? date
    : moment(date).format("HH:mm");
  $(selector).timepicker("destroy");
  $(selector).timepicker({
    timeFormat: "HH:mm",
    interval: 50, // minutes
    minTime: min,
    maxTime: max,
    defaultTime,
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    change: function(time) {
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

const editarHorario = index => {
  const horario = horarioList[index];
  currentHorario = { ...horario };
  currentHorario.isNew = false;
  currentHorario.index = index;
  showFormularioHorario(true);
  $("#btnSubmitFormularioHorario").html("MODIFICAR");
  $("#formularioHorario .h4").html("MODIFICAR HORARIO");
  $("#daySelect").val(String(horario.day));
  setDateTimePicker(
    "#timepickerStart",
    horario.startTime,
    "7:30",
    "19:30",
    "startTime"
  );
  setDateTimePicker(
    "#timepickerEnd",
    horario.endTime,
    "8:20",
    "19:30",
    "endTime"
  );
};

const eliminarHorario = index => {
  horarioList = horarioList.filter((el, pos) => index !== pos);
  renderHorarioTable();
  $(".modal-backdrop").remove();
};

const setDefaultValuesFormHorario = () => {
  $("#daySelect").val("0");
  $("#daySelect").on("change", function(event) {
    currentHorario.day = $(this).val();
  });
  setDateTimePicker("#timepickerStart", "7:30", "7:30", "19:30", "startTime");
  setDateTimePicker("#timepickerEnd", "8:20", "8:20", "19:30", "endTime");
};
