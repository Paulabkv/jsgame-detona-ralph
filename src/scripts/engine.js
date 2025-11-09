const state = { 
  view: { 
    squares: document.querySelectorAll(".square"), 
    enemy: document.querySelector(".enemy"), 
    timeLeft: document.querySelector("#time-left"), 
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"), // novo elemento no HTML
  }, 
  
  values: { 
    gameVelocity: 1000, 
    hitPosition: 0, 
    result: 0, 
    currentTime: 60,
    targetScore: 60, // pontuação para ganhar
    lives: 3, // total de vidas
  }, 
  
  actions: { 
    timeId: null, 
    countDownTimeId: null,
  }, 
}; 

function playSound(audioName) { 
  let audio = new Audio(`./src/audios/${audioName}.m4a`); 
  audio.volume = 0.2; 
  audio.play(); 
} 

function randomSquare() { 
  state.view.squares.forEach((square) => { 
    square.classList.remove("enemy"); 
  }); 

  let randomNumber = Math.floor(Math.random() * 9); 
  let randomSquare = state.view.squares[randomNumber]; 
  randomSquare.classList.add("enemy"); 
  state.values.hitPosition = randomSquare.id; 
}

function updateLives() {
  if (state.view.lives) {
    state.view.lives.textContent = state.values.lives;
  }
}

function resetGameRound() {
  clearInterval(state.actions.timeId);
  clearInterval(state.actions.countDownTimeId);
  state.values.currentTime = 60;
  state.values.result = 0;
  state.view.score.textContent = state.values.result;
  state.view.timeLeft.textContent = state.values.currentTime;
  init();
}

function countDown() { 
  state.values.currentTime--; 
  state.view.timeLeft.textContent = state.values.currentTime; 

  if (state.values.currentTime <= 0) { 
    clearInterval(state.actions.countDownTimeId); 
    clearInterval(state.actions.timeId); 

    if (state.values.result >= state.values.targetScore) {
      alert("You Win! 🎉");
    } else {
      state.values.lives--;
      updateLives();

      if (state.values.lives > 0) {
        alert("Você não alcançou 60 pontos. Você perdeu 1 vida!");
        resetGameRound();
      } else {
        playSound("gameover");
        alert("Game Over! Você perdeu todas as suas vidas! Pontuação final: " + state.values.result);
      }
    }
  } 
} 

function addListenerHitBox() { 
  state.view.squares.forEach((square) => { 
    square.addEventListener("mousedown", () => { 
      if (square.id === state.values.hitPosition) { 
        state.values.result++; 
        state.view.score.textContent = state.values.result; 
        state.values.hitPosition = null; 
        playSound("hit"); 
      } 
    }); 
  }); 
} 

function init() { 
  addListenerHitBox(); 
  updateLives();
  state.actions.timeId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimeId = setInterval(countDown, 1000);
}

init();

