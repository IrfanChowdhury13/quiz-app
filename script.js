const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSsXVxMsZkX8xzIO6FJCobw40a8nTzIMgSRDhPVpjRgIbs0n1muRnCP283eP5pCQLko_fF0KA0CX4k/pub?gid=0&single=true&output=csv";

let quizData = [];
let currentQuestion = 0;
let timer;
let timeLeft = 30; // 30 seconds
let answered = false;

// Fetch CSV and convert to JSON
async function fetchQuiz() {
    const response = await fetch(sheetUrl);
    const csvData = await response.text();

    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",");
    quizData = lines.slice(1).map(line => {
        const data = line.split(",");
        let obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = data[i].trim();
        });
        return obj;
    });

    showQuestion();
}

// Show current question
function showQuestion() {
    if (currentQuestion >= quizData.length) {
        document.getElementById("quiz-container").innerHTML = "<h2>Quiz Completed!</h2>";
        return;
    }

    const q = quizData[currentQuestion];
    document.getElementById("question").innerText = q.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    const feedback = document.getElementById("answer-feedback");
    feedback.innerText = "";
    answered = false;

    for (let i = 1; i <= 4; i++) {
        const btn = document.createElement("button");
        btn.innerText = q["option" + i];
        btn.onclick = () => checkAnswer(btn, q.answer);
        optionsDiv.appendChild(btn);
    }

    startTimer();
}

// Check answer and show feedback inline
function checkAnswer(button, correct) {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    const feedback = document.getElementById("answer-feedback");
    if (button.innerText === correct) {
        feedback.innerText = "Correct!";
        feedback.style.color = "#28a745";
    } else {
        feedback.innerText = `Wrong! Correct answer: ${correct}`;
        feedback.style.color = "#dc3545";
    }

    // Highlight answers
    Array.from(document.getElementById("options").children).forEach(b => {
        b.disabled = true;
        if (b.innerText === correct) b.style.backgroundColor = "#28a745";
        else b.style.backgroundColor = "#dc3545";
    });

    // Auto next question after 3 seconds
    setTimeout(() => {
        nextQuestion();
    }, 3000);
}

// Start timer
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!answered) {
                answered = true;
                const feedback = document.getElementById("answer-feedback");
                feedback.innerText = `Time's up! Correct answer: ${quizData[currentQuestion].answer}`;
                feedback.style.color = "#dc3545";

                // Disable all buttons
                Array.from(document.getElementById("options").children).forEach(b => {
                    b.disabled = true;
                });

                // Auto next question after 3 seconds
                setTimeout(() => {
                    nextQuestion();
                }, 3000);
            }
        }
    }, 1000);
}

// Next question
function nextQuestion() {
    clearInterval(timer);
    currentQuestion++;
    showQuestion();
}

// Start quiz
fetchQuiz();
