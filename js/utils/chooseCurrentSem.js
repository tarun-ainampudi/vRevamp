function chooseCurrentSemester() {
    const chooseSemesterSearchBox = document.getElementById("semesterSubId");
    chooseSemesterSearchBox.selectedIndex = 1; // select the recent semester
    chooseSemesterSearchBox.dispatchEvent(new Event('change'))
}