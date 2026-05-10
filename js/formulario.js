const form = document.getElementById("mealForm")

const inputs = form.querySelectorAll("input, select")

const params = new URLSearchParams(window.location.search)

const diaEditar = params.get("dia")
const indexEditar = params.get("index")

const modoEdicion = diaEditar !== null && indexEditar !== null

if (modoEdicion) {
  const data = getData()

  document.getElementById("form-title").textContent = "Editar comida"

  document.getElementById("dia").disabled = true

  const comida = data.plan[diaEditar][indexEditar]

  document.getElementById("nombre").value = comida.nombre
  document.getElementById("dia").value = diaEditar
  document.getElementById("tipo").value = comida.tipo
  document.getElementById("ingredientes").value = comida.ingredientes.join(", ")
  document.getElementById("fecha").value = comida.fecha
  document.getElementById("veg").checked = comida.veg

  const radio = document.querySelector(
     `input[name="dif"][value="${comida.dificultad}"]`
  )

  if (radio) radio.checked = true
}

inputs.forEach(input => {
  input.addEventListener("input", () => validarCampo(input))
})

function validarCampo(input) {
  const error = input.parentElement.querySelector(".error")

  if (input.type === "checkbox") return true

  if (input.name === "dif") {
    const checked = document.querySelector('input[name="dif"]:checked')

    if (!checked) {
      if (error) error.style.display = "block"
      return false
    } else {
      if (error) error.style.display = "none"
      return true
    }
  }

  if (!input.value) {
    input.classList.add("error-input")
    input.classList.remove("success")

    if (error) error.style.display = "block"

    return false
  }

  input.classList.remove("error-input")
  input.classList.add("success")

  if (error) error.style.display = "none"

  return true
}

form.addEventListener("submit", (e) => {
  e.preventDefault()

  let valido = true

  inputs.forEach(input => {
    if (!validarCampo(input)) valido = false
  })

  if (!valido) return

  const data = getData()

  const nombre = document.getElementById("nombre").value

  const dia = document.getElementById("dia").value

  const tipo = document.getElementById("tipo").value

  const ingredientes = document
  .getElementById("ingredientes")
  .value
  .split(",")
  .map(i => i.trim())

  const fecha = document.getElementById("fecha").value

  const veg = document.getElementById("veg").checked

  const dificultad = document.querySelector('input[name="dif"]:checked').value

  const nuevaComida = {
    nombre,
    tipo,
    ingredientes,
    fecha,
    veg,
    dificultad
}

  // editar
  if (modoEdicion) {
    data.plan[diaEditar][indexEditar] = nuevaComida
  }

  // crear
  else {
    data.plan[dia].push(nuevaComida)
  }

  saveData(data)

  alert("Comida guardada ✅")
  window.location.href = "../planner1.html"
})