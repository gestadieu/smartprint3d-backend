// let dropdowns = document.querySelectorAll(".dropdown");
// dropdowns.forEach((dropdown) => {
//   dropdown.addEventListener("click", function (event) {
//     event.stopPropagation();
//     dropdown.classList.toggle("is-active");
//   });
// });

const dropdowns = document.querySelectorAll(".dropdown:not(.is-hoverable)");

if (dropdowns.length > 0) {
  dropdowns.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      el.classList.toggle("is-active");
    });
  });

  document.addEventListener("click", function (e) {
    closeDropdowns();
  });
}

function closeDropdowns() {
  dropdowns.forEach(function (el) {
    el.classList.remove("is-active");
  });
}

document.addEventListener("keydown", function (event) {
  let e = event || window.event;
  if (e.key === "Esc" || e.key === "Escape") {
    closeDropdowns();
  }
});
