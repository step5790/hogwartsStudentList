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
  expelled: "EXPELLED",
  prefect: "—",
  inquisitorial: "—",
  enroled: "ENROLLED",
};

// ****************click events****************
document.querySelector(".close").addEventListener("click", toggleModal);
document.querySelector(".generate").addEventListener("click", init);

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

  // set clone data
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=midName]").textContent = student.middleName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=houseName]").textContent = student.house;
  clone.querySelector("[data-field=status]").textContent = student.enroled;

  // *********set addEventListener to each student******************
  clone.querySelector(".cell").addEventListener("click", function () {
    const modalName =
      student.firstName + " " + student.middleName + " " + student.lastName;
    toggleModal();
    document.querySelector(".student-name").textContent = modalName.replace(
      "—",
      ""
    );
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

// **************************open modal for student******************
