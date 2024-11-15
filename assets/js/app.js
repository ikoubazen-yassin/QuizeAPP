// Importing Elements By Theire Classies
const CountSpan = document.querySelector(".quiz-app .count span");
const bulletsContainer = document.querySelector(".bullets .spans");
const quizeArea = document.querySelector(".quiz-app .quiz-area");
const answersArea = document.querySelector(".quiz-app .answers-area");
const submitButton = document.querySelector(".quiz-app .submit-button");

// Set Options / Settings
let currentIndex = 0;
let correct_Answers = 0;

// Create AJAX Request
const GetQuestions = () => {
  let req = new XMLHttpRequest();
  /* 
0 - Not Initilaze
1 - Server Connction Stablish
2 - Request Receved
3 - Processing Request
4 - Req Finished and Ready
*/
  // Whene Ready Stat Change do check if  readystat ==== 4 && status == 200 ok
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      const QuestionsObject = JSON.parse(req.responseText);
      let questionCount = QuestionsObject.length;

      // Create Bullerts + Set Question Count
      createBullets(questionCount);
      // Add Data
      addData(QuestionsObject[currentIndex], questionCount);

      submitButton.onclick = () => {
        // Go To next Q and Decraesing 1 from q count
        if (CountSpan.innerHTML > 0) {
          CountSpan.innerHTML--;
        }
        if (currentIndex < questionCount) {
          // Get Rigth Answer
          const rAnsr = QuestionsObject[currentIndex].right_answer;
          currentIndex++;
          // Check Answer Function
          checkAnswer(rAnsr, questionCount);
          // Clear Quiz : answers
          quizeArea.innerHTML = "";
          answersArea.innerHTML = "";
          // Next Question
          addData(QuestionsObject[currentIndex], questionCount);
          // Handl Bullets Class
          handelBullets();
          // Show Results Functions
          showResult(questionCount, correct_Answers);
        }
      };
    }
  };
  // Give Method + Url Or Path and async must be true
  req.open("GET", "./assets/js/html-Ques.json", true);
  req.send();
};
GetQuestions();
// Create Bullets And Set Count Of Questions
const createBullets = (n) => {
  // Add Questions Count To Page
  CountSpan.innerHTML = n;

  // LOOP DEPANDING ON N WE GOT
  for (let i = 0; i < n; i++) {
    let TheBullet = document.createElement("span");
    if (i === 0) {
      // Add Class On AT First Item
      TheBullet.className = "on";
    }
    // Append To Their parent
    bulletsContainer.appendChild(TheBullet);
  }
};
// Add data Function
const addData = (qObj, qcount) => {
  if (currentIndex < qcount) {
    // Create Question
    quizeArea.innerHTML = `<h2 class="fw-bold">${qObj.title}</h2>`;
    // Create Answers
    let anData = "";
    for (let i = 1; i <= 4; i++) {
      // make it checked by default
      const DefultChecked = i === 1 ? "checked" : "";
      anData += `
 <div class="answer py-3 px-2 border-bottom">
  <input ${DefultChecked} type="radio" name="questions" data-answer = '${
        qObj[`answer_${i}`]
      }' id="answer_${i}" />
  <label for="answer_${i}" class="fw-bold">${qObj[`answer_${i}`]}</label>
</div>
`;
    }
    // Put Into Answers Area
    answersArea.innerHTML = anData;
  }
};

// Check Answers Function
const checkAnswer = (r, c) => {
  const answer_items = document.getElementsByName("questions");
  let choosenAnswer;
  // Loop on every child
  answer_items.forEach((answer) => {
    // Check if it checked input than set their value in new var
    if (answer.checked) {
      choosenAnswer = answer.dataset.answer;
    }
  });
  // Comparing Between Both
  if (r === choosenAnswer) {
    correct_Answers++;
  }
};

const handelBullets = () => {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((s, i) => {
    if (currentIndex === i) {
      s.className = "on";
    }
  });
};
// Show Results
const showResult = (qc, rightsAnswers) => {
  let theResult = "";
  if (currentIndex === qc) {
    answersArea.remove();
    quizeArea.remove();
    submitButton.remove();
    document.querySelector(".bullets").remove();
  }
  if (rightsAnswers === qc) {
    theResult = `
          <div class="results alert alert-primary mt-3 fs-5">
        <span><b>Awesome!</b> Answers <b>${rightsAnswers}</b> From <b>${qc}</b> Been Correct.</span>
      </div>
        `;
  } else if (rightsAnswers >= qc / 2) {
    theResult = `
        <div class="results alert alert-warning mt-3 fs-5">
      <span ><b>Good</b> Answers <b>${rightsAnswers}</b> From <b>${qc}</b> Correct.</span>
       <button onclick = 'reset();' class = ' btn btn-primary'>Play again.</button>
    </div>
      `;
  } else if (rightsAnswers < qc / 2) {
    theResult = `
        <div class="results alert alert-danger mt-3 fs-5">
      <span ><b>Very Weak</b> Answers <b>${rightsAnswers}</b> From <b>${qc}</b> Correct.</span>
       <button onclick = 'reset();' class = 'btn btn-primary'>Play again.</button>
    </div>
      `;
  } else {
    theResult = `
        <div class="results alert alert-dark mt-3 fs-5">
      <span  ><b>Try agin</b> Don't Giv up.</span>
      <button onclick = 'reset();' class = ' btn btn-primary'>Play again.</button>
    </div>
      `;
  }
  if (currentIndex == qc) {
    // append To Result Final
    document.querySelector(".results-final").innerHTML = theResult;
  }
};

function showPopup() {
  const overlay = document.querySelector(".quiz-app .overlay");
  overlay.style.display = "flex";
  const resetBtn = document.querySelector(".quiz-app .overlay .popup a");
  resetBtn.addEventListener("click", () => {
    overlay.remove();
    reset();
  });
}

// Reset Function
function reset() {
  location.reload();
}
// Count Down Function
const startCountdown = (duration) => {
  let timeLeft = duration;
  const countdownDisplay = document.querySelector(".countdown .seconds");

  const timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      showPopup();
    } else {
      timeLeft--;
    }
    countdownDisplay.innerHTML = timeLeft.toString().padStart(2, "0");
  }, 1000);
};
startCountdown(60);
