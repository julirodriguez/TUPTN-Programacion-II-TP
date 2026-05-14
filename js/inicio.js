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
    dayTitle.textContent = getTodayKey();
}

function renderMeals() {
    const data = getData();

    const today = getTodayKey();

    const meals = data.plan?.[today] || [];

    const mealsSection = document.querySelector(".meals");

    const header = mealsSection.querySelector(".section-header");

    if (!meals.length) {
        mealsSection.innerHTML += `
            <p>No hay comidas cargadas para hoy.</p>
        `;
        return;
    }

    const html = meals.map(meal => `
        <div class="meal-card">
            <img src="https://via.placeholder.com/150" alt="">
            <div class="meal-info">
                <h4>${meal.nombre}</h4>
                <p>
                    ${meal.tipo || ""} • 
                    ${meal.dificultad || ""} • 
                    ${meal.ingredientes?.length || 0} ingredientes
                </p>
            </div>
        </div>
    `).join("");

    mealsSection.innerHTML = `
        ${header.outerHTML}
        ${html}
    `;
}

renderMeals();
