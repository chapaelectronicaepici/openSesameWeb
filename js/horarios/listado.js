const configurarHorario = async () => {
  const baseDate = moment()
    .day(1)
    .set({
      minutes: 0,
      hours: 0
    });
  const courses = await fetchApi("/api/courses/");
  const schedulesR = [];

  const codesColor = [
    "#66DCC0",
    "#CC833F",
    "#3FB9CC",
    "#FFA66B",
    "#EE7E14",
    "#B6E587",
    "#D3D3BA",
    "#D67642",
    "#6BFFF0",
    "#64EFAA",
    "#ACC4EF",
    "#f7f957",
    "#F7BD51",
    "#B6F957",
    "#B6F957"
  ];
  courses.forEach(({ schedules, name }, index) => {
    schedules.forEach(schedule => {
      const durationStart = moment(schedule.startTime);
      const durationEnd = moment(schedule.endTime);
      schedulesR.push({
        textColor: "#000000",
        textAlign: "center",
        backgroundColor: codesColor[index],
        borderColor: codesColor[index],
        title: name,
        nowIndicator: true,
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
    columnHeaderText: date => {
      return daysName[moment(date).day() !== 0 ? moment(date).day() - 1 : 6];
    },
    events: schedulesR
  });

  calendar.render();
};
