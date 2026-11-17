
// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const form = document.getElementById("gradeForm");

const themeButton = document.getElementById("themeToggle");

const resetButton = document.getElementById("resetBtn");

const errorMessage = document.getElementById("errorMessage");

let performanceChart = null;


// =====================================
// 2. DARK MODE
// =====================================

// Load saved theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️ Light Mode";

}


// Switch theme

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeButton.textContent = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");

    }

    // Update chart colours

    if (performanceChart) {
        updateChartTheme();
    }

});


// =====================================
// 3. STUDENT PROFILE
// =====================================

const nameInput = document.getElementById("studentName");

const rollInput = document.getElementById("rollNumber");


// Load saved profile

const savedName = localStorage.getItem("studentName");

const savedRoll = localStorage.getItem("rollNumber");

if (savedName) {

    document.getElementById("displayName").textContent = savedName;

    nameInput.value = savedName;

}

if (savedRoll) {

    document.getElementById("displayRoll").textContent =
        "Roll Number: " + savedRoll;

    rollInput.value = savedRoll;

}


// Save student profile

document.getElementById("saveProfile").addEventListener("click", function() {

    const name = nameInput.value.trim();

    const roll = rollInput.value.trim();

    if (name === "" || roll === "") {

        alert("Please enter both name and roll number.");

        return;

    }

    localStorage.setItem("studentName", name);

    localStorage.setItem("rollNumber", roll);

    document.getElementById("displayName").textContent = name;

    document.getElementById("displayRoll").textContent =
        "Roll Number: " + roll;

    alert("Student profile saved successfully!");

});


// =====================================
// 4. GRADE CALCULATION
// =====================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const inputs = document.querySelectorAll(".marks");

    let marks = [];

    let total = 0;

    let valid = true;


    // Read marks from all subjects

    inputs.forEach(function(input) {

        const mark = Number(input.value);

        if (
            input.value.trim() === "" ||
            !Number.isInteger(mark) ||
            mark < 0 ||
            mark > 100
        ) {

            valid = false;

        }

        marks.push(mark);

        total += mark;

    });


    // Validate marks

    if (!valid || marks.length !== 5) {

        errorMessage.textContent =
            "Please enter whole-number marks between 0 and 100.";

        return;

    }

    errorMessage.textContent = "";


    // Check individual subject pass marks

    const isPassed = marks.every(function(mark) {

        return mark >= 35;

    });


    // Calculate percentage

    const percentage = total / 5;


    // Calculate grade

    let grade;

    if (!isPassed) {

        grade = "F";

    } else if (percentage >= 90) {

        grade = "A+";

    } else if (percentage >= 80) {

        grade = "A";

    } else if (percentage >= 70) {

        grade = "B";

    } else if (percentage >= 60) {

        grade = "C";

    } else if (percentage >= 50) {

        grade = "D";

    } else {

        grade = "E";

    }


    const status = isPassed ? "PASS" : "FAIL";


    // =====================================
    // 5. UPDATE DASHBOARD CARDS
    // =====================================

    document.getElementById("totalMarks").textContent =
        total + " / 500";

    document.getElementById("percentage").textContent =
        percentage.toFixed(2) + "%";

    document.getElementById("grade").textContent = grade;

    document.getElementById("status").textContent = status;


    // =====================================
    // 6. UPDATE FINAL RESULT
    // =====================================

    document.getElementById("finalPercentage").textContent =
        percentage.toFixed(2) + "%";

    document.getElementById("finalGrade").textContent = grade;

    document.getElementById("finalMessage").textContent =

        isPassed
        ? "Congratulations! You have passed all subjects."
        : "You need to improve your marks in one or more subjects.";

    document.getElementById("resultCard").style.display = "block";


    // =====================================
    // 7. UPDATE PERFORMANCE CHART
    // =====================================

    createChart(marks);

});


// =====================================
// 8. CREATE PERFORMANCE CHART
// =====================================

function createChart(marks) {

    const ctx = document.getElementById("performanceChart");

    const darkMode = document.body.classList.contains("dark");

    const textColor = darkMode ? "#e2e8f0" : "#475569";

    const gridColor = darkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.08)";


    // Destroy previous chart

    if (performanceChart) {

        performanceChart.destroy();

    }


    // Create new chart

    performanceChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Mathematics",
                "Physics",
                "Chemistry",
                "Computer Science",
                "English"
            ],

            datasets: [{

                label: "Marks",

                data: marks,

                backgroundColor: [
                    "#818cf8",
                    "#60a5fa",
                    "#c084fc",
                    "#34d399",
                    "#fbbf24"
                ],

                borderRadius: 8,

                borderSkipped: false

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {
                        color: textColor
                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100,

                    ticks: {
                        color: textColor
                    },

                    grid: {
                        color: gridColor
                    }

                },

                x: {

                    ticks: {
                        color: textColor
                    },

                    grid: {
                        display: false
                    }

                }

            }

        }

    });

}


// =====================================
// 9. UPDATE CHART THEME
// =====================================

function updateChartTheme() {

    const darkMode = document.body.classList.contains("dark");

    const textColor = darkMode ? "#e2e8f0" : "#475569";

    const gridColor = darkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.08)";


    performanceChart.options.plugins.legend.labels.color = textColor;

    performanceChart.options.scales.x.ticks.color = textColor;

    performanceChart.options.scales.y.ticks.color = textColor;

    performanceChart.options.scales.y.grid.color = gridColor;

    performanceChart.update();

}


// =====================================
// 10. RESET CALCULATOR
// =====================================

resetButton.addEventListener("click", function() {

    // Clear marks

    form.reset();


    // Reset dashboard

    document.getElementById("totalMarks").textContent = "0 / 500";

    document.getElementById("percentage").textContent = "0%";

    document.getElementById("grade").textContent = "--";

    document.getElementById("status").textContent = "Pending";


    // Reset final result

    document.getElementById("finalPercentage").textContent = "0%";

    document.getElementById("finalGrade").textContent = "--";

    document.getElementById("finalMessage").textContent =
        "Calculate your marks to see your result.";

    document.getElementById("resultCard").style.display = "none";


    // Clear error

    errorMessage.textContent = "";


    // Remove previous chart

    if (performanceChart) {

        performanceChart.destroy();

        performanceChart = null;

    }

});
