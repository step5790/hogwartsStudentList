"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";

let allStudent = [];
let jsonData = [];
let useFilterData = [];
let filteredData = [];
let modalFlag = true;

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
  enrolled: false,
};

// ****************click events****************
document.querySelector(".close").addEventListener("click", toggleModal);
document.querySelector(".generate").addEventListener("click", init);

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
}

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

  return student;
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

// function capitalize(name) {
//   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
// }

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
      document.querySelector(".crest-logo").src =
        "http://meetstephen.dk/KEA/3rd_semester/Hogwarts/assets/hufflepuff.png";
    } else if (houseColor === "Slytherin" || houseColor === "Sslytherin") {
      document.querySelector(".modal-container").style.background = "#6eb177";
      document.querySelector(".crest-logo").src =
        "http://meetstephen.dk/KEA/3rd_semester/Hogwarts/assets/slytherin.png";
    } else if (houseColor === "Ravenclaw" || houseColor === "Rravenclaw") {
      document.querySelector(".modal-container").style.background = "#9ba7b7";
      document.querySelector(".crest-logo").src =
        "http://meetstephen.dk/KEA/3rd_semester/Hogwarts/assets/ravenclaw.png";
    } else if (houseColor === "Ggryffindor" || houseColor === "Gryffindor") {
      document.querySelector(".modal-container").style.background = "#d3a625";
      document.querySelector(".crest-logo").src =
        "http://meetstephen.dk/KEA/3rd_semester/Hogwarts/assets/gryfgindor.png";
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
