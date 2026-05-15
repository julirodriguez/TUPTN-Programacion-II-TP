function getTodayKey() {
    const days = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"
    ];

    return days[new Date().getDay()];
}

const dayTitle = document.getElementById("day-title");

if (dayTitle) {
    const today = getTodayKey();

    const formattedDay = today.charAt(0).toUpperCase() + today.slice(1);

    dayTitle.textContent = formattedDay;
}

function renderNutritionStats(meals) {

    const total = meals.length;

    let vegetarianas = 0;
    let veganas = 0;
    let sinTacc = 0;

    meals.forEach(meal => {
        if (meal.caracteristicas?.includes("Vegetariano")) {vegetarianas++;}
        if (meal.caracteristicas?.includes("Vegano")) {veganas++;}
        if (meal.caracteristicas?.includes("Sin TACC")) {sinTacc++;}
    });

    const vegPercent = total ? (vegetarianas / total) * 100 : 0;

    const veganPercent = total ? (veganas / total) * 100 : 0;

    const taccPercent = total ? (sinTacc / total) * 100 : 0;

    // total comidas
    document.getElementById( "total-meals").textContent = total;

    // barras
    document.getElementById("veg-bar").style.width = `${vegPercent}%`;
    document.getElementById("vegan-bar").style.width = `${veganPercent}%`;
    document.getElementById("tacc-bar").style.width = `${taccPercent}%`;

    // textos
    const bars = document.querySelectorAll(".bar p");

    if (bars[0]) {bars[0].textContent =`Vegetarianas (${vegetarianas})`}

    if (bars[1]) {bars[1].textContent = `Veganas (${veganas})`}

    if (bars[2]) {bars[2].textContent = `Sin TACC (${sinTacc})`}
}

function renderMeals() {

    const data = getData();
    
    const today = getTodayKey();

    const meals = data.plan?.[today] || [];
    
    const mealsChar = renderNutritionStats(meals);

    const mealsSection = document.querySelector(".meals");

    // Validacion
    if (!mealsSection) return;

    // Si no hay comidas
    if (!meals.length) {
        mealsSection.innerHTML = `
            <div class="section-header">
                <br><br><h3>Comidas del día</h3>
            </div>

            <div class="empty-box">

                <p>
                     No hay comidas cargadas para hoy 🍽️
                </p>

                <a href="formulario.html" class="add-meal">
                     + Agregar comida
                </a>

            </div>
        `;

        return;
    }

    const header = mealsSection.querySelector(".section-header");

    const html = meals.map(meal => `
        <div class="meal-card">
            <img src="https://via.placeholder.com/150" alt="">
            <div class="meal-info">
                <h4>${meal.nombre}</h4>
                <p>
                    ${meal.tipo || ""} •
                    ${meal.dificultad || ""} •
                    ${meal.ingredientes?.length || 0}
                    ingredientes
                </p>
                 <small>
                    ${meal.caracteristicas?.join(" • ") || ""}
                </small>

            </div>
        </div>
    `).join("");

    mealsSection.innerHTML = `
        ${header ? header.outerHTML : ""}
        ${html}
    `;
}

const meals = getData().plan?.[getTodayKey()] || [];

renderMeals();

const welcomeText = document.getElementById("welcome-text");

if (welcomeText) {

    const hour = new Date().getHours();

    if (hour < 12) {
        welcomeText.textContent = "Buen día 👋";
    }

    else if (hour < 20) {
        welcomeText.textContent = "Buenas tardes ☀️";
    }

    else {
        welcomeText.textContent = "Buenas noches 🌙";
    }
}