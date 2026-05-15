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
    // texto, textarea, etc
    input.addEventListener("input", () => {
        validarCampo(input);
    });

    // radios y checkboxes
    input.addEventListener("change", () => {
        validarCampo(input);
    });
  });

  function validarCampo(input) {

    // VALIDAR RADIOS
    if (input.name === "dif") {

      const checked = document.querySelector(
        'input[name="dif"]:checked'
      );

      // contenedor del grupo radio
      const formGroup = input.closest(".form-group");

      const error =
        formGroup.querySelector(".error");

      if (!checked) {

        if (error)
          error.style.display = "block";

        return false;
      }

      if (error)
        error.style.display = "none";

      return true;
    }

    // CHECKBOXES
    if (input.type === "checkbox") {
      return true;
    }

    // errores normales
    const error =
      input.parentElement.querySelector(".error");

    // VALIDACION TEXTO
    if (!input.value.trim()) {

      input.classList.add("error-input");

      input.classList.remove("success");

      if (error)
        error.style.display = "block";

      return false;
    }

    input.classList.remove("error-input");

    input.classList.add("success");

    if (error)
      error.style.display = "none";

    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    let valido = true

    inputs.forEach(input => {
      if (!validarCampo(input)) valido = false
    })

    if (!valido) return

    const data = getData()

    if (!data.recetasPersonalizadas) {
      data.recetasPersonalizadas = [];
    }

    const nombre = document.getElementById("nombre").value

    const dia = document.getElementById("dia").value

    const tipo = document.getElementById("tipo").value

    const ingredientes = document
      .getElementById("ingredientes")
      .value
      .split(",")
      .map(i => i.trim())

    const recetaTexto = document.getElementById("recipe-steps").value // Joaquin: Pasos de la receta para guardarlo en localStorage

    // Caracteristicas de las comidas
      const caracteristicas = [];

      const veganoInput = document.getElementById("vegano");
      const vegetarianoInput = document.getElementById("vegetariano");
      const sinTaccInput = document.getElementById("sin-tacc");

      // Si es vegano → automáticamente vegetariano
      if (veganoInput.checked) {
          caracteristicas.push("Vegano");
          caracteristicas.push("Vegetariano");
      }
      else if (vegetarianoInput.checked) {
          caracteristicas.push("Vegetariano");
      }

      if (sinTaccInput.checked) {
          caracteristicas.push("Sin TACC");
      }
      

    // Joaquin: funciona igual que ingredientes pero con un salto de linea
    const receta = recetaTexto
        .split("\n")
        .map(step => step.trim())
        .filter(step => step !== "");

    const dificultadSeleccionada = document.querySelector('input[name="dif"]:checked')

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
      // Joaquin: Agrego esto para que se me modifique tambien ne recetas cargadas
       if (data.recetasPersonalizadas) {
        const comidaVieja = data.plan[diaEditar][indexEditar];

        data.plan[diaEditar][indexEditar] = nuevaComida;

        const recetaIndex = data.recetasPersonalizadas.findIndex(receta => receta.nombre === comidaVieja.nombre)
        }
      }
    

    // crear
    else {
      if (data.plan[dia].length >= 5) {
        alert("Máximo 5 comidas por día")
        return
    }

    data.plan[dia].push(nuevaComida);

    const recetaPrecargada = form.dataset.precargada === "true";
    
    if (!recetaPrecargada) {
        data.recetasPersonalizadas.push(nuevaComida);
    }
    
    form.dataset.precargada = "false";
  }

    saveData(data)

    alert("Comida guardada ✅")
    window.location.href = "../planner1.html"
  })
}