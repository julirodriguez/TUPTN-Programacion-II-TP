//const recetas = {
//  "Desayuno": ["café", "pan", "manteca"],
//  "Almuerzo": ["pollo", "arroz"],
//  "Cena": ["lechuga", "tomate"]
//};

function renderizarPlanner() {
  const data = getData()
  const plan = data.plan

  document.querySelectorAll(".day").forEach(dayElement => {
    const day = dayElement.dataset.day
    const mealsContainer = dayElement.querySelector(".meals")

    mealsContainer.innerHTML = ""

    plan[day].forEach((comida, index) => {
      const div = document.createElement("div")
      div.classList.add("meal")

      div.innerHTML = `
        <div class="meal-info">
          <strong>${comida.nombre}</strong>
          <small>${comida.tipo} • ${comida.dificultad}</small>
        </div>
        <div>
          <button class="delete">✖️</button>
          <button class="edit">✏️</button>
        </div>
      `
      // Eliminar
      div.querySelector(".delete").addEventListener("click", () => {
        if (confirm("¿Eliminar esta comida?")) {
          eliminarComida(day, index)
        }
      })

      // Editar (para dsp)
      div.querySelector(".edit").addEventListener("click", () => {
        window.location.href = `formulario.html?dia=${day}&index=${index}`;
      })

      mealsContainer.appendChild(div)
    })
  })
}

function eliminarComida(day, index) {
  const data = getData()
  data.plan[day].splice(index, 1)
  saveData(data)

  renderizarPlanner()
  if (window.mostrarCompras) mostrarCompras()
}

function initPlanner() {
if (!document.querySelector(".day")) return
  renderizarPlanner()
}

const clearButton = document.getElementById("clear-planner")

if (clearButton) {
  clearButton.addEventListener("click", () => {
    const confirmar = confirm("¿Seguro que querés borrar todas las comidas?")

    if (!confirmar) return

    const data = getData()

    data.plan = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    }

    saveData(data)

    renderizarPlanner()

    if (window.mostrarCompras) mostrarCompras()
  })
}