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

    if (plan[day].length === 0) {
      mealsContainer.innerHTML = `
        <div class="empty-box">
          <img src="assets/images/sin-comidas.png" alt="Sin comidas">

          <p>No hay comidas todavía</p>
        </div>
      `
    } 
    
    else {
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

        // Editar
        div.querySelector(".edit").addEventListener("click", () => {
          window.location.href = `formulario.html?dia=${day}&index=${index}`;
        })

        mealsContainer.appendChild(div)
      })
    }
  })
}

function actualizarStats() {
  const data = getData()

  let total = 0
  let vegetarianas = 0
  let veganas = 0
  let sinTacc = 0
  let ingredientes = 0
  let faciles = 0

  Object.values(data.plan).forEach(dia => {
    dia.forEach(comida => {
      total++

      if (comida.caracteristicas?.includes("Vegetariano")) {
          vegetarianas++;
      }

      if (comida.caracteristicas?.includes("Vegano")) {
          veganas++;
      }

      if (comida.caracteristicas?.includes("Sin TACC")) {
          sinTacc++;
      }

      ingredientes += comida.ingredientes.length

      if (comida.dificultad === "facil") faciles++
    })
  })

  document.getElementById("stat-total").textContent = total
  document.getElementById("stat-vegetariana").textContent = vegetarianas
  document.getElementById("stat-veganas").textContent = veganas
  document.getElementById("stat-sin-tacc").textContent = sinTacc
  document.getElementById("stat-ing").textContent = ingredientes
  document.getElementById("stat-facil").textContent = faciles
}

function eliminarComida(day, index) {
  const data = getData()

  data.plan[day].splice(index, 1)
  saveData(data)

  renderizarPlanner()
  actualizarStats()

  if (window.mostrarCompras) mostrarCompras()
}

function initPlanner() {
  if (!document.querySelector(".day")) return

  renderizarPlanner()
  actualizarStats()
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
    actualizarStats()

    if (window.mostrarCompras) mostrarCompras()
  })
}