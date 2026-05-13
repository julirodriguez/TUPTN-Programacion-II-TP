const form = document.getElementById("mealForm")

if (!form) {
  console.log("Formulario no encontrado")
}
else {
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
    document.getElementById("recipe-steps").value = comida.receta.join("\n") // Joaquin: Agregue esto para los pasos de las recetas

    document.getElementById("vegetariano").checked = // Joaquin: Agrego/Cambio esto para las caracteristicas de las recetas
      comida.caracteristicas.includes("Vegetariano");

    document.getElementById("vegano").checked =
      comida.caracteristicas.includes("Vegano");

    document.getElementById("sin-tacc").checked =
      comida.caracteristicas.includes("Sin TACC");

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

    const recetaTexto = document.getElementById("recipe-steps").value // Joaquin: Pasos de la receta para guardarlo en localStorage

    // Joaquin: Modificacion Grande
    // Cambie la clase "veg" por "caracteristicas" para que luego funcione para los filtros
    // y tener la posibilidad de crear mas opciones segun las caracteristicas que querramos
    const caracteristicas = [];

    if (document.getElementById("vegetariano").checked) {
        caracteristicas.push("Vegetariano");
    }

    if (document.getElementById("vegano").checked) {
        caracteristicas.push("Vegano");
    }

    if (document.getElementById("sin-tacc").checked) {
        caracteristicas.push("Sin TACC");
    }

    // Joaquin: funciona igual que ingredientes pero con un salto de linea
    const receta = recetaTexto
        .split("\n")
        .map(step => step.trim())
        .filter(step => step !== "");

    const dificultadSeleccionada =
    document.querySelector('input[name="dif"]:checked')

    const dificultad = dificultadSeleccionada
      ? dificultadSeleccionada.value
      : ""

    const nuevaComida = {
      nombre,
      tipo,
      ingredientes,
      receta,
      caracteristicas,
      dificultad
  }

    // editar
    if (modoEdicion) {
      data.plan[diaEditar][indexEditar] = nuevaComida
    }

    // crear
    else {
      if (data.plan[dia].length >= 5) {
        alert("Máximo 5 comidas por día")
        return
    }

    data.plan[dia].push(nuevaComida)
  }

    saveData(data)

    alert("Comida guardada ✅")
    window.location.href = "../planner1.html"
  })
}