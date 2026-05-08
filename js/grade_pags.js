const grade_to_points = {
    "S": 10,
    "A": 9,
    "B": 8,
    "C": 7,
    "D": 6,
    "E": 5,
    "F": 0,
}

function ctype_to_credits(ccode, ctype) {
    let to_4c = "CSE1008ECE2002MAT1003MAT1002"
    let etl_3c = "ENG1002ENG2001"
    switch (ctype) {
        case "Embedded Theory and Lab":
            if (etl_3c.includes(ccode)) return 3
            else return 4
        case "Theory Only":
            if (ccode.includes("FRL")) return 2
            else if (to_4c.includes(ccode)) return 4
            else return 3
        case "Embedded Theory and Project":
            return 4
        case "Project":
            return 2
        case "Non-Credit Club":
            return 2
        case "Lab Only":
            return 2
        default:
            return 2
    }
}

function calculateGPA(courses) {
    let grade_points = 0
    let total_credits = 0
    console.log(courses)
    Object.keys(courses).forEach(element => {
        let credits = courses[element]["credits"]
        let grade = courses[element]["grade"]
        total_credits += courses[element]["credits"]
        grade_points += credits * grade
    });
    console.log(grade_points, total_credits)
    return grade_points / total_credits
}

function addCreditsColumn(grades_table) {
    let trows = grades_table.querySelectorAll("tr")
    trows[0].innerHTML += '<th rowspan="2">Credits</th>'
    for (var i = 1; i < trows.length; i++) {
        let cols = trows[i].querySelectorAll("td")
        let ccode = cols[1] ? cols[1].innerText.trim().toUpperCase() : ''
        let ctype = cols[3] ? cols[3].innerText.trim() : ''
        if (!ccode.match(/[A-Z]{3}[0-9]{4}/g)) continue
        trows[i].innerHTML += '<td><input class="credit-input" type="number" min="0" max="12"></td>'
        let credits = ctype_to_credits(ccode, ctype)
        trows[i].querySelector(".credit-input").value = credits
    }
}

function updateGPA(grades_table) {
    let trows = grades_table.querySelectorAll("tr")
    let courses = {}
    for (var i = 1; i < trows.length; i++) {
        let cols = trows[i].querySelectorAll("td")
        let ccode = cols[1] ? cols[1].innerText.trim().toUpperCase() : ''
        let ctype = cols[3] ? cols[3].innerText.trim() : ''
        let grade = cols[6] ? cols[6].innerText.trim().toUpperCase() : ''
        if (!ccode.match(/[A-Z]{3}[0-9]{4}/g) || !"SABCDEF".includes(grade)) continue
        if (ccode != '' && ctype != '' && grade != '') {
            let credits = trows[i].querySelector(".credit-input").value
            courses[ccode] = {
                type: ctype,
                credits: Number(credits),
                grade: grade_to_points[grade]
            }
        } else {
            console.log(`${ccode}-${ctype}-${grade} is missing`)
        }
    }
    var gpaElement = `<td colspan="11" style="text-align:center">GPA : ${calculateGPA(courses).toFixed(2)}</td>`
    trows[trows.length - 1].innerHTML = gpaElement
}

let modify_grade_page = () => {

    var grades_table = document.querySelectorAll("table.table.table-hover.table-bordered")[0]
    grades_table.innerHTML += '<tr class="tableContent-level1" style="background: rgb(170, 255, 0,0.6);"></tr>'
    addCreditsColumn(grades_table)
    updateGPA(grades_table)
    document.querySelectorAll(".credit-input").forEach(element => {
        element.addEventListener("input", () => updateGPA(grades_table), true)
    })

}
chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "exam_grade") {
        try {
            modify_grade_page();
        } catch (error) {
            console.log(error);
        }
    }
});

