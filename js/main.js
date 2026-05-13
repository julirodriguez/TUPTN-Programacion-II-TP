document.addEventListener("DOMContentLoaded", () => {
  if (window.initPlanner) initPlanner()
  if (window.mostrarCompras) mostrarCompras()
})

const menuButton = document.getElementById("menu-toggle")
const sideMenu = document.getElementById("side-menu")

if (menuButton && sideMenu) {
  menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open")
  })
}

// Cargar tema guardado
const themeToggle = document.getElementById("theme-toggle");

if(themeToggle){

    // cargar tema guardado
    if(localStorage.getItem("theme") === "dark"){
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    }

    // cambiar tema
    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        }

    });

}