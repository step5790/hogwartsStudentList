"use strict";

window.addEventListener("DOMContentLoaded", init);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";

let allStudent = [];
let jsonData = [];
let useFilterData = [];
let filteredData = [];
let modalFlag = true;
let numberOfGryffindor = 0;
let numberOfHufflepuff = 0;
let numberOfSlytherin = 0;
let numberOfRavenclaw = 0;

const studentPrototype = {
  lastName: "—",
  firstName: "—",
  middleName: "—",
  nickName: "—",
  gender: "—",
  bloodStatus: "—",
  house: "—",
  prefect: true,
  inquisitorial: true,
  enrolled: true,
};

const settings = {
  filterBy: "all",
  sortBy: "lastName",
  sortDir: "asc",
};

// ****************click events****************
function registerButton() {
  document.querySelector(".close").addEventListener("click", toggleModal);

  // document
  //   .querySelectorAll("[data-action='sort']")
  //   .addEventListener("change", selectFilter);

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((option) => option.addEventListener("click", selectSort));
}

// ***************initialization**************
function init() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareDatas(jsonData);
      // injectMyself();
    });

  // *************blood status************
  //   fetch(urlFamilies)
  //     .then((e) => e.json())
  //     .then((data) => {
  //       findBloodStatus(data);
  //     });

  //   *******************clean and load data***************
  function prepareDatas(jsonData) {
    allStudent = jsonData.map(prepareData);

    // TODO: This might not be the function we want to call first
    displayList(allStudent);
  }

  function prepareData(students) {
    const student = Object.create(studentPrototype);
    const fullname = students.fullname.trim();
    const firstSpace = fullname.indexOf(" ");
    const lastSpace = fullname.lastIndexOf(" ");

    const firstName = fullname.substring(0, firstSpace);
    const lastName = fullname.substring(lastSpace + 1);
    const middleName = fullname.substring(firstSpace + 1, lastSpace);
    const newFirstName =
      firstName.substring(0, 1).toUpperCase() +
      firstName.substring(1).toLowerCase();

    const newLastName =
      lastName.substring(0, 1).toUpperCase() +
      lastName.substring(1).toLowerCase();

    const newMiddleName =
      middleName.substring(0, 1).toUpperCase() +
      middleName.substring(1).toLowerCase();

    const house = students.house.trim();

    student.firstName = newFirstName;
    student.lastName = newLastName;

    student.gender =
      students.gender.substring(0, 1).toUpperCase() +
      students.gender.substring(1).toLowerCase();

    student.house =
      house.substring(0, 1).toUpperCase() +
      students.house.substring(1).toLowerCase();

    // check if house name is double letters
    if (
      student.house.charAt(0).toLowerCase() ===
      student.house.charAt(1).toLowerCase()
    ) {
      student.house = house.replace(student.house.charAt(1), "");
      student.house =
        house.slice(0, 1) + house.substring(1, house.length).toLowerCase();
      console.log("1" + student.house);
    } else {
      console.log("2" + student.house);
    }

    // ***************check first name*****************
    if (students.fullname.trim().indexOf(" ") < 0) {
      console.log("first name only");
      console.log(students.fullname.trim());
      student.firstName = students.fullname.trim();
      student.lastName = "—";
      student.middleName = "—";
    }

    //  ***************check middle name***************
    if (newMiddleName === " ") {
      student.middleName = "—";
      console.log("no middle name");
    } else if (newMiddleName !== " ") {
      student.middleName = newMiddleName;
      console.log(newMiddleName);
    }

    // **********call count students function*********
    studentCounter(student);
    return student;
  }

  registerButton();
}

// **************filter events, get target for sort and filter value*********************
function selectFilter(event) {
  const filter = document.getElementById("dropDown").value;
  setFilter(filter);
}

//  setFilter for selectFilter function

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

// setting for selectSort

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //  flagging directions
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else if (sortDir === "desc") {
    event.target.dataset.sortDirection = "asc";
  }

  setSort(sortBy, sortDir);
}

//  setting for setSort, and then go to buildList

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

// ****************filtering and sorting*******************

// filtering

function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudent.filter(isGryffindor);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudent.filter(isSlytherin);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudent.filter(isHufflepuff);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudent.filter(isRavenclaw);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "enrolled") {
    filteredList = allStudent.filter(isEnrolled);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudent.filter(isExpelled);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "prefects") {
    filteredList = allStudent.filter(isPrefects);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "blood-status") {
    filteredList = allStudent.filter(isBloodStatus);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "inquisitorial") {
    filteredList = allStudent.filter(isInquisitorial);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  }
  return filteredList;
}

//  filtering function call
function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isEnrolled(student) {
  return student.enrolled === true;
}

function isExpelled(student) {
  return student.enrolled === false;
}

function isPrefects(student) {
  return student.prefect === true;
}

function isBloodStatus(student) {
  return student.bloodStatus === "—";
}

function isInquisitorial(student) {
  return student.inquisitorial === true;
}

// *******************sorting algorithm***************
function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  console.log(settings.sortDir);

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

// ********counting students*********
function studentCounter(student) {
  if (student.house === "Ravenclaw") {
    numberOfRavenclaw++;
  } else if (student.house === "Hufflepuff") {
    numberOfHufflepuff++;
  } else if (student.house === "Slytherin") {
    numberOfSlytherin++;
  } else if (student.house === "Gryffindor") {
    numberOfGryffindor++;
  }
}

// ******build list for combining filter and sort************
function buildList() {
  const currentList = filterList(allStudent);
  const sortedList = sortList(currentList);
  console.log(sortedList);
  displayList(sortedList);
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

//   *************************display data***************
function displayStudent(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // *********check student status e.g. enrolled, expelled, inquisitor, prefect*************

  let enrolledStatus;
  let prefectStatus;
  let insiquisitorStatus;

  if (student.enrolled) {
    enrolledStatus = "Enrolled";
  } else {
    enrolledStatus = "Expelled";
  }

  if (student.prefect) {
    prefectStatus = "Prefect";
  } else {
    prefectStatus = "";
  }

  if (student.inquisitorial) {
    insiquisitorStatus = "Inquisitorial";
  } else {
    insiquisitorStatus = "";
  }

  // ******display count number************
  document.querySelector(".numberOfstudents span").innerHTML =
    allStudent.length;
  document.querySelector(".numberOfenrolled span").innerHTML = "";
  document.querySelector(".numberOfexpelled span").innerHTML = "";
  document.querySelector(".numberOfGryffindor span").innerHTML =
    numberOfGryffindor;
  document.querySelector(".numberOfHufflepuff span").innerHTML =
    numberOfHufflepuff;
  document.querySelector(".numberOfSlytherin span").innerHTML =
    numberOfSlytherin;
  document.querySelector(".numberOfRavenclaw span").innerHTML =
    numberOfRavenclaw;

  // set clone data
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=midName]").textContent = student.middleName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=houseName]").textContent = student.house;
  clone.querySelector("[data-field=status]").textContent =
    enrolledStatus + ", " + prefectStatus + ", " + insiquisitorStatus;

  // *********set addEventListener to each student with modal data insertion******************
  clone.querySelector(".cell").addEventListener("click", function () {
    const modalName =
      student.firstName + " " + student.middleName + " " + student.lastName;
    toggleModal();
    document.querySelector(".student-name").textContent = modalName.replace(
      "—",
      ""
    );
    document.querySelector(".student-nickname span").textContent =
      student.nickName;
    document.querySelector(".student-house span").textContent = student.house;
    document.querySelector(".student-gender span").textContent = student.gender;
    document.querySelector(".student-blood span").textContent =
      student.bloodStatus;

    document.querySelector(".student-enrolled span").textContent =
      enrolledStatus;
    document.querySelector(".student-inquisitor span").textContent =
      insiquisitorStatus;
    document.querySelector(".student-prefect span").textContent = prefectStatus;

    // ***************** check student house for color *******************
    const houseColor = student.house.trim();

    if (houseColor === "Hhufflepuff" || houseColor === "Hufflepuff") {
      document.querySelector(".modal-container").style.background = "#ffed86";
      document.querySelector(".crest-logo").src = "assets/hufflepuff.png";
    } else if (houseColor === "Slytherin" || houseColor === "Sslytherin") {
      document.querySelector(".modal-container").style.background = "#6eb177";
      document.querySelector(".crest-logo").src = "assets/slytherin.png";
    } else if (houseColor === "Ravenclaw" || houseColor === "Rravenclaw") {
      document.querySelector(".modal-container").style.background = "#9ba7b7";
      document.querySelector(".crest-logo").src = "assets/ravenclaw.png";
    } else if (houseColor === "Ggryffindor" || houseColor === "Gryffindor") {
      document.querySelector(".modal-container").style.background = "#d3a625";
      document.querySelector(".crest-logo").src = "assets/griffyndor.png";
    }
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

// ************************** open modal ******************
function toggleModal() {
  if (modalFlag) {
    modalFlag = false;
    console.log(modalFlag);
    document.querySelector(".modal-container").classList.remove("hide");
    document.querySelector(".main-container").classList.add("disable");
  } else {
    modalFlag = true;
    console.log(modalFlag);
    document.querySelector(".modal-container").classList.add("hide");
    document.querySelector(".main-container").classList.remove("disable");
  }
}
