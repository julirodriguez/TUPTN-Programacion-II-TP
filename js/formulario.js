const form = document.getElementById("mealForm")

const inputs = form.querySelectorAll("input, select")

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
  const ingredientes = document.getElementById("ingredientes").value.split(",")
  const fecha = document.getElementById("fecha").value
  const veg = document.getElementById("veg").checked
  const dificultad = document.querySelector('input[name="dif"]:checked').value

  data.plan[dia].push({
    nombre,
    tipo,
    ingredientes,
    fecha,
    veg,
    dificultad
  })

  saveData(data)

  alert("Comida guardada ✅")
  window.location.href = "../planner1.html"
})