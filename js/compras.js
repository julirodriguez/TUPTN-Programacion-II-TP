function generarListaCompras() {
  const data = getData();
  let lista = [];

  Object.values(data.plan).forEach(dia => {
    dia.forEach(comida => {
      lista = lista.concat(comida.ingredientes);
    });
  });

  return lista;
}

function agruparIngredientes(lista) {
  let resultado = {};

  lista.forEach(item => {
    resultado[item] = (resultado[item] || 0) + 1;
  });

  return resultado;
}

function mostrarCompras() {
  const contenedor = document.getElementById("lista-compras");
  if (!contenedor) return;

  const lista = generarListaCompras();
  const agrupada = agruparIngredientes(lista);

  contenedor.innerHTML = "";

  const section = document.createElement("section");
  section.classList.add("category");

  section.innerHTML = `
    <div class="category-header">
      <h3>Compras</h3>
      <span class="badge">${Object.keys(agrupada).length}</span>
    </div>
    <div class="list"></div>
  `;

  const list = section.querySelector(".list");

  Object.entries(agrupada).forEach(([ingrediente, cantidad]) => {
    const label = document.createElement("label");
    label.classList.add("item");

    label.innerHTML = `
      <input type="checkbox">
      <div class="item-info">
        <span>${ingrediente}</span>
      </div>
      <span class="qty">${cantidad}</span>
    `;

    const checkbox = label.querySelector("input");

    const data = getData()

    if (!data.comprasCheck) {
      data.comprasCheck = {}
    }

    // restaurar estado guardado
    checkbox.checked = data.comprasCheck[ingrediente] || false

    if (checkbox.checked) {
      label.classList.add("done")
    }

    checkbox.addEventListener("change", () => {
      label.classList.toggle("done", checkbox.checked)

      // guardar estado
      data.comprasCheck[ingrediente] = checkbox.checked

      saveData(data)
    })

    list.appendChild(label);
  });

  contenedor.appendChild(section);
}