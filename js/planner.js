const recetas = {
  "Desayuno": ["café", "pan", "manteca"],
  "Almuerzo": ["pollo", "arroz"],
  "Cena": ["lechuga", "tomate"]
};

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
        window.location.href = `pages/formulario.html?dia=${day}&index=${index}`;
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
  // Solo corre si esta en el planner
  // if (!document.querySelector(".day")) return

  // const data = getData()

  // document.querySelectorAll(".add-meal").forEach(button => {
  //   button.addEventListener("click", function () {
  //     const day = this.closest(".day").dataset.day
  //     let comidasDelDia = data.plan[day]

  //     if (comidasDelDia.length >= 5) {
  //       alert("Máximo 5 comidas por día.")
  //       return
  //     }

  //     let option = prompt("1.Desayuno 2.Almuerzo 3.Cena 4.Personalizada")

  //     let tipo = ["", "Desayuno", "Almuerzo", "Cena", "Personalizada"][option]

  //     if (!tipo) return alert("Opción inválida")

  //     if (tipo === "Personalizada") {
  //       let nombre = prompt("Ingrese la comida:")
  //       if (!nombre) return
  //       tipo = "Personalizada: " + nombre
  //     }

  //     comidasDelDia.push({
  //       nombre: tipo,
  //       ingredientes: recetas[tipo] || []
  //     })

  //     saveData(data)

  //     renderizarPlanner()
  //     mostrarCompras()
  //   })
  // })

  if (!document.querySelector(".day")) return

  renderizarPlanner()
}