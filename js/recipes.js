const localStorageData = getData();

let data = [];

async function getRecipes() {

    try {
        const response = await fetch("js/recetas.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        const localStorageData = getData();
        const jsonLength = jsonData.length;
        window.jsonRecipesLength = jsonLength;

        const recetasPlan =
            localStorageData?.recetasPersonalizadas || [];

        data = [...jsonData, ...recetasPlan].map(receta => ({

            id: receta.id || Date.now(),

            nombre: receta.nombre || "Sin nombre",

            ingredientes: receta.ingredientes || [],

            pasos: receta.pasos || receta.receta || [],

            caracteristicas:
                receta.caracteristicas ||
                (receta.veg ? ["Vegetariano"] : []),

            dificultad: receta.dificultad || ""

        }));

        renderRecipes(data);

    } catch (error) {
        console.log("fetch error:", error);
    }
}

const recipesContainer = document.getElementById("recipes-container");
const modal = document.getElementById("complete-recipe");

const btnClose = document.querySelectorAll(".btn-close-recipe");

// Renderizar recetas de manera dinaica
function renderRecipes(filterData) {

    recipesContainer.innerHTML = filterData.map((receta, index) => `
        <div class="unique-recipe">

            <h3 id="recipe-title">${receta.nombre}</h3>

            <p>
                ${receta.caracteristicas?.join(", ") || "<br>"}
            </p>

            <button class="btn btn-open-recipe" data-id="${index}">
                Receta
            </button>

        </div>
    `).join("");
}

getRecipes();

// Filtro segun caracteristicas 
const filtroForm = document.getElementById("filtro-caracteristicas");

if (filtroForm){
    filtroForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const opcion = document.getElementById("opciones").value;

        if (opcion === "all") {
            renderRecipes(data);
            return;
        }

        const filtradas = data.filter(receta =>
            receta.caracteristicas?.includes(opcion)
        );

        renderRecipes(filtradas);
    }
)};

// MODAL: Mostrar receta completa a través del modal
let currentRecipeIndex = null;

if (recipesContainer){
    recipesContainer.addEventListener("click", (e) => {

        const recipeTitle = document.getElementById("recipe-title");
        const recipeDesc = document.getElementById("recipe-desc");
        const recipeIng = document.getElementById("recipe-ingredientes");
        const recipeSteps = document.getElementById("recipe-steps");

        if (e.target.classList.contains("btn-open-recipe")) {

            const id = e.target.dataset.id;
            currentRecipeIndex = id;
            const receta = data[id];

            recipeTitle.textContent = receta.nombre;

            recipeDesc.textContent = receta.caracteristicas.join(", ");

            recipeIng.innerHTML = receta.ingredientes
                .map(ing => `<li>${ing}</li>`)
                .join("");

            recipeSteps.innerHTML = receta.pasos
                .map(step => `<li>${step}</li>`)
                .join("");

            modal.classList.add("show");
        }
    }
)};

// Boton para el modal pop up del formulario
const modalPopup = document.querySelector(".modal-loaded-recipes");
const btnOpenModal = document.querySelector(".btn-modal-loaded-recipes");
const btnCloseModal = document.getElementById("close-loaded-recipes");
const loadedRecipesContainer = document.getElementById("loaded-recipes-container");

function renderLoadedRecipes(recetas) {
    loadedRecipesContainer.innerHTML = recetas.map(
        (receta, index) => `

        <div class="loaded-recipe-card">

            <h3>${receta.nombre}</h3>
            
            <p>
                ${receta.caracteristicas?.join(", ") || ""}
            </p>

            <button class="btn-use-recipe" data-id="${index}">
                Usar receta
            </button>

        </div>

    `).join("");
}

if (loadedRecipesContainer){
    loadedRecipesContainer.addEventListener("click", (e) => {

        if (e.target.classList.contains("btn-use-recipe")) {

            const form = document.getElementById("mealForm");

            if (form) {
                form.dataset.precargada = "true";
            }

            const id = e.target.dataset.id;

            const receta = data[id];

            document.getElementById("nombre").value = receta.nombre;

            document.getElementById("ingredientes").value = receta.ingredientes.join(",");

            document.getElementById("recipe-steps").value = receta.pasos.join("\n");
            
            document.getElementById("vegetariano").checked = receta.caracteristicas.includes("Vegetariano");

            document.getElementById("vegano").checked = receta.caracteristicas.includes("Vegano");

            document.getElementById("sin-tacc").checked = receta.caracteristicas.includes("Sin TACC");
        }

    })
};

// Abrir modal
if (btnOpenModal) {
    btnOpenModal.addEventListener("click", () => {
        modalPopup.classList.add("show");
        renderLoadedRecipes(data);
    });
}

// Ocultar modal
if (btnCloseModal) {
    btnCloseModal.addEventListener("click", () => {
        modalPopup.classList.remove("show");
    });
}

// Ocultar modal
btnClose.forEach((element) => {
    element.addEventListener("click", (e) => {
        modal.classList.remove("show");
    });
});

// Obtener, Guardar y Borrar recetas personalizadas
const btnModifyRecipe = document.getElementById("modify-recipe-off-list")
const btnDeleteRecipe = document.getElementById("delete-recipe-off-list")

// Falta hacer esto
// function modifyPersonalizedRecipes() {}


const personalizedIndex = currentRecipeIndex - window.jsonRecipesLength;

btnDeleteRecipe.addEventListener("click", () => {

    if (currentRecipeIndex === null) return;

    // 8 recetas del JSON para calcular (de manera manual) el indice de las recetas personalizadas
    const personalizedIndex = currentRecipeIndex - 8;

    // Esto evita borrar recetas json
    if (personalizedIndex < 0) {
        alert("No podés eliminar recetas precargadas");
        return;
    }

    if (!confirm("¿Eliminar receta?")) return;

    const storageData = getData();

    const recetas = storageData.recetasPersonalizadas || [];

    recetas.splice(personalizedIndex, 1);

    storageData.recetasPersonalizadas = recetas;

    saveData(storageData);

    modal.classList.remove("show");

    getRecipes();

});
