const configurarHorario = async () => {
  const baseDate = moment()
    .day(1)
    .set({
      minutes: 0,
      hours: 0
    });
  const courses = await fetchApi("/api/courses/");
  const schedulesR = [];
  courses.forEach(({ schedules, name }) => {
    schedules.forEach(schedule => {
      const durationStart = moment(schedule.startTime);
      const durationEnd = moment(schedule.endTime);
      schedulesR.push({
        textColor: "#000000",
        textAlign: "center",
        color: "#66DCC0",
        backgroundColor: "#66DCC0",
        title: name,
        start: baseDate
          .clone()
          .add({
            days: schedule.day,
            minutes: durationStart.minutes(),
            hours: durationStart.hours(),
            seconds: durationStart.seconds()
          })
          .toDate(),
        end: baseDate
          .clone()
          .add({
            days: schedule.day,
            minutes: durationEnd.minutes(),
            hours: durationEnd.hours(),
            seconds: durationEnd.seconds()
          })
          .toDate()
      });
    });
  });

  schedulesR.map(sche => {
    console.log("start", moment(sche.start).format("DD/MM/YY HH:mm"));
    console.log("end", moment(sche.end).format("DD/MM/YY HH:mm"));
  });

  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ["dayGrid", "timeGrid"],
    header: {
      left: "",
      center: "",
      right: ""
    }, // buttons for switching between views
    selectable: false,
    selectHelper: false,
    editable: false,
    eventLimit: true,
    defaultView: "timeGridWeek",
    minTime: "07:30:00",
    maxTime: "20:10:00",
    scrollTime: "20:10:00",
    defaultDate: baseDate.toDate(),
    slotDuration: { minutes: 50 },
    showNonCurrentDates: false,
    firstDay: 1,
    columnHeaderText: date => {
      return daysName[moment(date).day() !== 0 ? moment(date).day() - 1 : 6];
    },
    events: schedulesR
  });

  calendar.render();
};
