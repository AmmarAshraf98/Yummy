let homeContainer = $(".row-data");
let searchContainer = $(".searchedDataContainer");
let sideWidth = $(".link-side").innerWidth();

$(document).ready(function () {
  // remove loader
  $(".loader").fadeOut(1500, function () {
    $(".loader-container").slideUp(500, function () {
      $("body").css("overflow", "auto");
    });
  });

  // hide All
  hideAll();
});

// Loading Function
function load() {
  return `<div class="loaderContainer"> 
  <span class="secLoader"></span>
  </div>`;
}

// fetch data
searchByName("");

// Toogle class wich hide  sidebar
function toggleIcon() {
  $(".bar").toggleClass("d-none");
  $(".close").toggleClass("d-none");
}

// close sideNav
function closeNav() {
  $("nav").animate({ left: -sideWidth }, 500);
  $("ul li").removeClass("link-toggle");
}

closeNav();

// open sideNav
function openNav() {
  $("nav").animate({ left: "0px" }, 500);
  $("ul li").addClass("link-toggle");
}

// Toggle SideNav
$(".bar").on("click", function () {
  toggleIcon();
  openNav();
});

$(".close").on("click", function () {
  toggleIcon();
  closeNav();
});

// get All sections
let allSections = $(".sections>div");

// Toggle sections
function hideAll() {
  for (const section of allSections) {
    $(section).addClass("d-none");
  }
}

// hide and show section
$("li").on("click", function (e) {
  closeNav();
  toggleIcon();
  hideAll();

  // empty all div wich  display data
  $(".row-data").html("");
  $(".details-container").html("");

  // show div i clicked on
  let sectionId = $(e.target).attr("id");
  for (const section of allSections) {
    if (sectionId === section.getAttribute("id")) {
      let currentSection = section;
      $(currentSection).toggleClass("d-none");
    }
  }
});

// display data
function display(data) {
  $(".row-data").html(load());
  let cartona = "";
  if (data === null || data === undefined || data.length === 0) return;
  cartona += data
    .slice(0, 20)
    .map(
      (meal) => `
      <div class="col-md-3">
      <div onclick='getDetails(this)' class="item rounded-3" id="${meal.idMeal}">
      <img src="${meal.strMealThumb}" class="w-100" alt="">
      <div class="layout">
          <p class="category">${meal.strMeal}</p>
      </div>
    </div>
    </div>
      `
    )
    .join("");
  $(".row-data").html(cartona);
}

//===================================> Details Function <===========================================//

async function getDetails(x) {
  $(".row-data").html(load());
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${x.id}`
  );
  let mealDetails = await respone.json();
  let meal = mealDetails.meals[0];

  displayDetails(meal);
}

function displayDetails(ele) {
  hideAll();
  $(".row-data").html("");

  // ingredient
  let strContainer = "";
  for (let i = 1; i <= 20; i++) {
    if (ele[`strIngredient${i + 1}`] && ele[`strMeasure${i}`])
      strContainer += `<span class="d-inline-block alert alert-danger m-1 p-2">
      ${ele[`strMeasure${i}`]} ${ele[`strIngredient${i + 1}`]}</span> `;
  }

  // get tags to be lopped while display
  let tagsContainer = "";

  let arrTags = ele.strTags?.split(",");
  // if the strTags is empty then arrTags will be undefined so need to repaire this
  if (!arrTags) arrTags = [];

  if (arrTags.length) {
    arrTags.map(
      (tag) =>
        (tagsContainer += `<span class="d-inline-block alert alert-info m-2 p-1">${tag}</span>`)
    );
  }

  $(".details-container").html(`
    <div class="col-md-4">
    <img src="${ele.strMealThumb}" class="w-100 rounded-3 mb-3" alt="">
    <h2>${ele.strMeal}</h2>
  </div>
  <div class="col-md-8">
    <h2>description</h2>
    <p>${ele.strInstructions}</p>
    <h3>Area : <span>${ele.strArea}</span></h3>
    <h3 class="mb-3"><span class="fw-bold">Category : </span><span>${ele.strCategory}</span></h3>
    <h3 class="mb-3"><span class="fw-bold">Recipes : </span></h3>
    <div class="recipes mb-3">
       ${strContainer}
    </div>
    <h3 class="mb-1">Tags :</h3>
    <div class="mb-3">
    ${tagsContainer}
    </div>
    <div class="visit-link">
        <a class="btn btn-success p-2" href="${ele.strSource}">Source</a>
        <a class="btn btn-danger p-2 m-1" href="${ele.strYoutube}">Youtube</a>
    </div>
  </div>
    `);
}

//===================================> Search Function <===========================================//

async function searchByName(term) {
  $(".row-data").html(load());
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let data = await response.json();
  let searchedMeals = data.meals;
  display(searchedMeals);
}

async function searchByFirstLet(term) {
  $(".row-data").html(load());
  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();
  let searchedMeals = data.meals;
  display(searchedMeals);
}

$(".searchName").on("input", function (e) {
  searchByName(e.target.value);
});

$(".serachLetter").on("keyup", function (e) {
  console.log("search key", e.target.value);
  searchByFirstLet(e.target.value);
});

//===================================> Category Function <===========================================//
async function getCategories() {
  $(".row-data").html(load());
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();
  let categories = data.categories;
  displayCategory(categories);
}

function displayCategory(categories) {
  let cartona = ``;
  for (let i = 0; i < categories.length; i++) {
    cartona += `
    <div class="col-md-3">
            <div onclick="getDataByCategory('${
              categories[i].strCategory
            }')" class="category-item rounded-2 cursor-pointer">
                <img class="w-100" src="${
                  categories[i].strCategoryThumb
                }" alt="" srcset="">
                <div class="layout text-center text-black p-2">
                    <h3>${categories[i].strCategory}</h3>
                    <p>${categories[i].strCategoryDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}</p>
                </div>
            </div>
    </div>
    `;
  }
  $(".row-data").html(cartona);
}

$("#category").on("click", function () {
  getCategories();
});

async function getDataByCategory(x) {
  $(".row-data").html(load());
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${x}`
  );
  let data = await respone.json();

  display(data.meals);
}

//===================================> Area Function <===========================================//

async function getArea() {
  $(".row-data").html(load());
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  let areas = await data.meals;
  return areas;
}

function displayArea(x) {
  let cartona = ``;
  for (let i = 0; i < x.length; i++) {
    cartona += `
    <div class="col-md-3">
            <div onclick="getAreaMeals('${x[i].strArea}')" class="area-card rounded-2 text-center">
                    <i class="fa-solid fa-house-laptop fa-4x text-white"></i>
                    <h3 class="text-white">${x[i].strArea}</h3>
            </div>
    </div>
    `;
    $(".row-data").html(cartona);
  }
}

$("#area").on("click", async function () {
  let x = await getArea();
  displayArea(x);
});

async function getAreaMeals(area) {
  $(".row-data").html(load());
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();
  display(data.meals);
}

//===================================> Ingredients Function <===========================================//
async function getIngredients() {
  $(".row-data").html(load());
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  data = data.meals;
  data.length = 20;
  return data;
}

function displayIngredients(data) {
  let cartona = ``;
  for (let i = 0; i < data.length; i++) {
    cartona += `
    <div class="col-md-3">
            <div onclick="getIngredientsMeals('${
              data[i].strIngredient
            }')" class="rounded-2 text-center text-white cursore">
                    <i class="fa-solid fa-drumstick-bite text-white fa-4x"></i>
                    <h3>${data[i].strIngredient}</h3>
                    <p>${data[i].strDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}</p>
            </div>
    </div>
    `;
  }
  $(".row-data").html(cartona);
}

$("#ingredients").on("click", async function () {
  let data = await getIngredients();
  displayIngredients(data);
});

// fetch and display meals by it's ingrediant
async function getIngredientsMeals(category) {
  $(".row-data").html(load());
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${category}`
  );
  let data = await response.json();
  display(data.meals);
}

//===================================> Contact Function <===========================================//
let flag1 = false;
let flag2 = false;
let flag3 = false;
let flag4 = false;
let flag5 = false;
let flag6 = false;
$("#contact").on("click", function () {
  let cartona = `
    <div class="col-md-6">
    <input id="nameInput" onkeyup="validateName();validateButton()" type="text" class="form-control" placeholder="Enter Your Name">
    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
        Special characters and numbers not allowed
    </div>
</div>
<div class="col-md-6">
    <input id="emailInput" onkeyup="validateEmail();validateButton()" type="email" class="form-control " placeholder="Enter Your Email">
    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
        Email not valid *exemple@yyy.zzz
    </div>
</div>
<div class="col-md-6">
    <input id="phoneInput" onkeyup="validatePhone();validateButton()" type="text" class="form-control " placeholder="Enter Your Phone">
    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid Phone Number
    </div>
</div>
<div class="col-md-6">
    <input id="ageInput" onkeyup="validateAge();validateButton()" type="number" class="form-control " placeholder="Enter Your Age">
    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid age
    </div>
</div>
<div class="col-md-6">
    <input  id="passwordInput" onkeyup="validatePassword();validateButton()" type="password" class="form-control " placeholder="Enter Your Password">
    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid password *Minimum eight characters, at least one letter and one number:*
    </div>
</div>
<div class="col-md-6">
    <input  id="repasswordInput" onkeyup="repasswordValidation();validateButton()" type="password" class="form-control " placeholder="Repassword">
    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
        Enter valid repassword 
    </div>
</div>
<div class="col-md-12 text-center">
<button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
</div>
`;
  $(".row-data").html(cartona);
});

function validateButton() {
  if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
    if (
      validateName() &&
      validateEmail() &&
      validateAge() &&
      validatePhone &&
      validatePassword() &&
      repasswordValidation()
    ) {
      document.querySelector("#submitBtn").removeAttribute("disabled");
    } else {
      document.querySelector("#submitBtn").setAttribute("disabled", true);
    }
  }
}

function validateName() {
  flag1 = true;
  let value = document.querySelector("#nameInput").value;
  let regex = /^[a-zA-Z ]+$/;
  if (regex.test(value)) {
    $("#nameAlert").addClass("d-none");
    return true;
  } else {
    $("#nameAlert").removeClass("d-none");
    return false;
  }
}

function validateEmail() {
  flag2 = true;
  let value = document.querySelector("#emailInput").value;
  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(value)) {
    $("#emailAlert").addClass("d-none");
    return true;
  } else {
    $("#emailAlert").removeClass("d-none");
    return false;
  }
}

function validatePhone() {
  flag3 = true;
  let value = document.querySelector("#phoneInput").value;
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (regex.test(value)) {
    $("#phoneAlert").addClass("d-none");
    return true;
  } else {
    $("#phoneAlert").removeClass("d-none");
    return false;
  }
}

function validateAge() {
  flag4 = true;
  let value = document.querySelector("#ageInput").value;
  let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  if (regex.test(value)) {
    $("#ageAlert").addClass("d-none");
    return true;
  } else {
    $("#ageAlert").removeClass("d-none");
    return false;
  }
}
function validatePassword() {
  flag5 = true;
  let value = document.querySelector("#passwordInput").value;
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  if (regex.test(value)) {
    $("#passwordAlert").addClass("d-none");
    return true;
  } else {
    $("#passwordAlert").removeClass("d-none");
    return false;
  }
}
function repasswordValidation() {
  flag6 = true;
  let pw = document.getElementById("repasswordInput").value;
  let rePassword = document.getElementById("passwordInput").value;
  if (pw == rePassword) return true;
  else return false;
}
