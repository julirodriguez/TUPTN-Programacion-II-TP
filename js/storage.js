const STORAGE_KEY = "appData"

function getData(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        plan: {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: [],
            sabado: [],
            domingo: []
        }
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}