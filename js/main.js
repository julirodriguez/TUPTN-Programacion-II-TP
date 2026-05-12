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