function getNewTimeList() {
  let timeList = [];
  let das = new Date();
  let d =
    das.getMonth() +
    1 +
    "/" +
    das.getDate() +
    "/" +
    das.getFullYear() +
    " " +
    das.getHours() +
    ":" +
    (das.getMinutes() > 30 ? "30" : "00") +
    ":00";
  let startTime = new Date(d).getTime();
  let endTime = startTime + 24 * 60 * 60 * 1000;
  for (let i = startTime; i < endTime; i = i + 30 * 60 * 1000) {
    let iDate =
      (new Date(i).getHours() == 0
        ? "12"
        : new Date(i).getHours() > 12
          ? new Date(i).getHours() - 12 < 10
            ? "0" + (new Date(i).getHours() - 12)
            : new Date(i).getHours() - 12
          : new Date(i).getHours() < 10
            ? "0" + new Date(i).getHours()
            : new Date(i).getHours()) +
      ":" +
      (new Date(i).getMinutes() == 0 ? "00" : "30") +
      " " +
      (new Date(i).getHours() >= 12 ? "PM" : "AM");
    timeList.push(iDate);
  }
  return timeList; //24 hours need
}

export { getNewTimeList };
