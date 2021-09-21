"use strict";

window.addEventListener("DOMContentLoaded", init);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";
// const urlImage = "../filenames.json";
const urlImage =
  "https://kea21s-667e.restdb.io/rest/filenames?fetchchildren=true";

let allStudent = [];
let studentImage = [];
let studentBlood = [];
let jsonData = [];
let filteredData = [];
let modalFlag = true;
let numberOfGryffindor = 0;
let numberOfHufflepuff = 0;
let numberOfSlytherin = 0;
let numberOfRavenclaw = 0;
let inquisitorFlag = true;

const studentPrototype = {
  lastName: "—",
  firstName: "—",
  middleName: "—",
  nickName: "—",
  gender: "—",
  bloodStatus: "—",
  house: "—",
  prefect: false,
  inquisitorial: false,
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

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((option) => option.addEventListener("click", selectSort));

  document
    .querySelector(".inquisitor")
    .addEventListener("click", addInquisitor);
}

// ***************initialization**************
function init() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareDatas(jsonData);
      // injectMyself();
    });

  // ******fetch image json*******
  fetch(urlImage, {
    method: "GET",
    headers: {
      "x-apikey": "602e289c5ad3610fb5bb6289",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((jsonImage) => {
      prepareImageDatas(jsonImage);
    });

  function prepareImageDatas(jsonImages) {
    studentImage = jsonImages;
  }

  // ***********fetch family blood************
  fetch(urlFamilies)
    .then((response) => response.json())
    .then((jsonBlood) => {
      prepareBloodDatas(jsonBlood);
    });

  function prepareBloodDatas(jsonBloods) {
    studentBlood = jsonBloods;
    let i = 0;
    // console.log(allStudent[0].lastName);
    for (i = 0; i < allStudent.length; i++) {
      const halfBlood = studentBlood.half;
      const pureBlood = studentBlood.pure;

      console.log(allStudent[i].lastName);

      if (halfBlood.includes(allStudent[i].lastName)) {
        console.log("half");
        allStudent[i].bloodStatus = "Half";
      } else if (pureBlood.includes(allStudent[i].lastName)) {
        console.log("pure");
        allStudent[i].bloodStatus = "Pure";
      } else {
        allStudent[i].bloodStatus = "Muggle";
        console.log("Muggle");
      }
    }
  }

  //   *******************clean and load student data***************
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
    } else if (newMiddleName !== " ") {
      student.middleName = newMiddleName;
    }

    // **********algorith for blood-status*******************
    // const bloodFam = studentBlood.half.toString().includes("Corner");
    // if (bloodFam.includes(student.lastName)) {
    //   student.bloodStatus = "half";
    //   console.log("half");
    // }

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

// ********* setFilter for selectFilter function
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

// ******2nd filter***********
function selectFilter2() {
  const filter = document.getElementById("dropDown2").value;
  setFilter(filter);
}

// ********setting for selectSort
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
  } else if (settings.filterBy === "Pure") {
    filteredList = allStudent.filter(isPure);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "Half") {
    filteredList = allStudent.filter(isHalf);
    console.log("Number of " + settings.filterBy + " " + filteredList.length);
  } else if (settings.filterBy === "Muggle") {
    filteredList = allStudent.filter(isMuggle);
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

function isPure(student) {
  return student.bloodStatus === "Pure";
}

function isHalf(student) {
  return student.bloodStatus === "Half";
}

function isMuggle(student) {
  return student.bloodStatus === "Muggle";
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
    enrolledStatus + " " + prefectStatus + " " + insiquisitorStatus;

  // *********set addEventListener to each student with modal data insertion******************
  clone.querySelector(".cell").addEventListener("click", function () {
    toggleModal(student);

    // // ********check if student is already inquisitorial**********
    // if (student.inquisitorial === true) {
    //   document.querySelector(".inquisitor").style.background = "orange";
    //   document.querySelector(".inquisitor").innerHTML = "REMOVE INQUISITOR";
    // }
    // **********************************************************

    document.querySelector(".student-name").textContent =
      student.firstName.replace("—", " ");
    document.querySelector(".student-midName").textContent =
      student.middleName.replace("—", " ");
    document.querySelector(".student-lastName").textContent =
      student.lastName.replace("—", " ");

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

    // **************check student for image***************
    let i = 0;

    for (i = 0; i < studentImage.length; i++) {
      // const studentImageCheckLastName = student.lastName.toLowerCase();
      // const studentImageCheckFirstName = student.firstName.toLowerCase();
      const cleanStudentImage = studentImage[i].image.substring(
        0,
        studentImage[i].image.indexOf(".")
      );

      if (
        cleanStudentImage.includes(
          document.querySelector(".student-name").textContent.toLowerCase()
        )
      ) {
        const imageName = studentImage[i].image;
        document.querySelector(
          ".modal-content-photo"
        ).src = `assets/pics/${imageName}`;
        // i = 40;
        console.log(
          document.querySelector(".student-name").textContent.toLowerCase()
        );
        break;
      }

      if (
        cleanStudentImage.includes(
          document.querySelector(".student-lastName").textContent.toLowerCase()
        )
      ) {
        const imageName = studentImage[i].image;
        document.querySelector(
          ".modal-content-photo"
        ).src = `assets/pics/${imageName}`;
        // i = 40;
        console.log(
          document.querySelector(".student-lastName").textContent.toLowerCase()
        );
        break;
      }
    }

    // ***********add to inquisitorial squad**************
    // document
    //   .querySelector(".inquisitor")
    //   .addEventListener("click", function () {
    //     const search = (student) =>
    //       student.firstName ===
    //       document.querySelector(".student-name").textContent;

    //     const index = allStudent.findIndex(search);
    //     if (allStudent[index].inquisitorial === true) {
    //       console.log(allStudent[index].inquisitorial);
    //       // *******************
    //       if (allStudent[index].bloodStatus === "Pure") {
    //         console.log(student.inquisitorial);
    //         document.querySelector(".inquisitor").style.background =
    //           "rgb(247, 188, 137)";
    //         document.querySelector(".student-inquisitor span").textContent = "";
    //         allStudent[index].inquisitorial = false;
    //         document.querySelector(".inquisitor").innerHTML =
    //           "ADD TO INQUISITOR";
    //       } else if (allStudent[index].house === "Slytherin") {
    //         console.log("inquisitorial");
    //         document.querySelector(".inquisitor").style.background =
    //           "rgb(247, 188, 137)";
    //         document.querySelector(".student-inquisitor span").textContent = "";
    //         allStudent[index].inquisitorial = false;
    //         document.querySelector(".inquisitor").innerHTML =
    //           "ADD TO INQUISITOR";
    //       }
    //       // ************************
    //     } else if (allStudent[index].inquisitorial === false) {
    //       console.log(allStudent[index].inquisitorial);
    //       // ***********************
    //       if (allStudent[index].bloodStatus === "Pure") {
    //         console.log("inquisitorial");
    //         document.querySelector(".inquisitor").style.background = "orange";
    //         document.querySelector(".student-inquisitor span").textContent =
    //           "Inquisitorial";
    //         allStudent[index].inquisitorial = true;
    //         document.querySelector(".inquisitor").innerHTML =
    //           "REMOVE INQUISITOR";
    //       } else if (allStudent[index].house === "Slytherin") {
    //         console.log("inquisitorial");
    //         document.querySelector(".inquisitor").style.background = "orange";
    //         document.querySelector(".student-inquisitor span").textContent =
    //           "Inquisitorial";
    //         allStudent[index].inquisitorial = true;
    //         document.querySelector(".inquisitor").innerHTML =
    //           "REMOVE INQUISITOR";
    //       }
    //       // ************************
    //     }
    //   });
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function addInquisitor() {
  const findName = document.querySelector(".student-name").textContent;

  for (let i = 0; i < allStudent.length; i++) {
    if (allStudent[i].firstName === findName) {
      if (
        allStudent[i].house === "Slytherin" &&
        allStudent[i].bloodStatus === "Pure"
      ) {
        if (allStudent[i].inquisitorial !== true) {
          allStudent[i].inquisitorial = true;
          document.querySelector(".student-inquisitor span").innerHTML =
            "Inquisitorial";
          console.log(allStudent[i].inquisitorial);
          document.querySelector(".inquisitor").innerHTML =
            "REMOVED TO INQUISITOR";
          document.querySelector(".inquisitor").style.background = "orange";
        } else if (allStudent[i].inquisitorial === true) {
          allStudent[i].inquisitorial = false;
          document.querySelector(".student-inquisitor span").innerHTML = "";
          console.log(allStudent[i].inquisitorial);
          document.querySelector(".inquisitor").innerHTML = "ADD TO INQUISITOR";
          document.querySelector(".inquisitor").style.background =
            "rgb(247, 188, 137)";
        }
      }

      if (allStudent[i].bloodStatus === "Pure") {
        if (allStudent[i].inquisitorial !== true) {
          allStudent[i].inquisitorial = true;
          document.querySelector(".student-inquisitor span").innerHTML =
            "Inquisitorial";
          console.log(allStudent[i].inquisitorial);
          document.querySelector(".inquisitor").innerHTML =
            "REMOVED TO INQUISITOR";
          document.querySelector(".inquisitor").style.background = "orange";
        } else if (allStudent[i].inquisitorial === true) {
          allStudent[i].inquisitorial = false;
          document.querySelector(".student-inquisitor span").innerHTML = "";
          console.log(allStudent[i].inquisitorial);
          document.querySelector(".inquisitor").innerHTML = "ADD TO INQUISITOR";
          document.querySelector(".inquisitor").style.background =
            "rgb(247, 188, 137)";
        }
      }

      if (allStudent[i].house === "Slytherin") {
        if (allStudent[i].inquisitorial !== true) {
          allStudent[i].inquisitorial = true;
          document.querySelector(".student-inquisitor span").innerHTML =
            "Inquisitorial";
          console.log(allStudent[i].inquisitorial);
          document.querySelector(".inquisitor").innerHTML =
            "REMOVED TO INQUISITOR";
          document.querySelector(".inquisitor").style.background = "orange";
        } else if (allStudent[i].inquisitorial === true) {
          allStudent[i].inquisitorial = false;
          document.querySelector(".student-inquisitor span").innerHTML = "";
          console.log(allStudent[i].inquisitorial);
          document.querySelector(".inquisitor").innerHTML = "ADD TO INQUISITOR";
          document.querySelector(".inquisitor").style.background =
            "rgb(247, 188, 137)";
        }
      }
    }
  }
}

// ************************** open modal ******************
function toggleModal(student) {
  if (student.inquisitorial === false && student.bloodStatus === "Pure") {
    document.querySelector(".inquisitor").innerHTML = "ADD TO INQUISITOR";
    document.querySelector(".inquisitor").style.background =
      "rgb(247, 188, 137)";
    document.querySelector(".inquisitor").disabled = false;
  } else if (student.inquisitorial === false && student.house === "Slytherin") {
    document.querySelector(".inquisitor").innerHTML = "ADD TO INQUISITOR";
    document.querySelector(".inquisitor").style.background =
      "rgb(247, 188, 137)";
    document.querySelector(".inquisitor").disabled = false;
  } else {
    document.querySelector(".inquisitor").innerHTML = "INQUISITOR ILLEGIBLE";
    document.querySelector(".inquisitor").style.background = "red";
    document.querySelector(".inquisitor").disabled = true;
  }

  if (student.inquisitorial === true) {
    console.log("true");
    document.querySelector(".inquisitor").innerHTML = "REMOVE INQUISITOR";
    document.querySelector(".inquisitor").style.background = "orange";
    document.querySelector(".inquisitor").disabled = false;
    document.querySelector(".student-inquisitor span").innerHTML =
      "Inquisitorial";
  }

  if (modalFlag) {
    modalFlag = false;
    document.querySelector(".modal-container").classList.remove("hide");
    document.querySelector(".main-container").classList.add("disable");
  } else {
    modalFlag = true;
    document.querySelector(".modal-container").classList.add("hide");
    document.querySelector(".modal-content-photo").src =
      "assets/pics/noImage.png";
    document.querySelector(".main-container").classList.remove("disable");
  }
}
