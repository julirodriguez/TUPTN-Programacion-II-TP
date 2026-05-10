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
        <span><strong>${comida.nombre}</strong></span>
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