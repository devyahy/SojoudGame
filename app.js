/* =============================================
   ROMANTIC MICRO-WEBSITE - JavaScript
   State machine, interactions, game logic
   ============================================= */

// ===== CONFIGURATION =====
// Edit these values to customize the experience
const CONFIG = {
    // Names
    herName: 'سجود',
    hisName: 'يحيى',

    // Memories images (replace with actual paths)
    memoriesImages: [
        'assets/memories/placeholder1.svg',
        'assets/memories/placeholder2.svg',
        'assets/memories/placeholder3.svg',
        'assets/memories/placeholder4.svg',
        'assets/memories/placeholder5.svg',
        'assets/memories/placeholder6.svg',
        'assets/memories/placeholder7.svg',
        'assets/memories/placeholder8.svg'
    ],

    // Game settings
    game: {
        duration: 15,      // seconds
        target: 15,        // hearts to collect
        spawnInterval: 600, // ms between heart spawns
        heartLifetime: 3000, // ms before heart disappears
        goldenChance: 0.1   // 10% chance for golden heart (+5 points)
    },

    // Quiz correct answer
    quizAnswer: 'الملكة'
};

// ===== STATE =====
const state = {
    currentScreen: 'screen-welcome',
    noClickedOnce: false,
    memoryPage: 1,
    gameScore: 0,
    gameTime: CONFIG.game.duration,
    gameInterval: null,
    spawnInterval: null,
    quizAttempts: 0
};

// ===== DOM ELEMENTS =====
const screens = document.querySelectorAll('.screen');
const confettiContainer = document.getElementById('confetti-container');

// ===== NAVIGATION =====
function navigateTo(screenId) {
    // Hide current screen
    const current = document.querySelector('.screen.active');
    if (current) {
        current.classList.remove('active');
    }

    // Show new screen
    const next = document.getElementById(screenId);
    if (next) {
        // Small delay for transition effect
        setTimeout(() => {
            next.classList.add('active');
        }, 50);
        state.currentScreen = screenId;
    }
}

// Setup navigation buttons
document.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-navigate');

        // Special case: restart resets the state
        if (btn.id === 'btn-restart') {
            resetState();
        }

        navigateTo(target);
    });
});

// ===== SCREEN 2: LOVE QUESTION =====
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const loveResponse = document.getElementById('love-response');
const btnLoveNext = document.getElementById('btn-love-next');
const loveButtons = document.getElementById('love-buttons');

btnYes.addEventListener('click', handleYesClick);

function handleYesClick() {
    // Show celebration
    loveResponse.innerHTML = 'يعني رسميًا… أنا أسعد واحد 💗';
    loveResponse.classList.remove('hidden', 'surprise');

    // Show next button
    btnLoveNext.classList.remove('hidden');

    // Hide the buttons
    loveButtons.classList.add('hidden');

    // Trigger confetti
    createConfetti();
}

btnNo.addEventListener('click', handleNoClick);

function handleNoClick() {
    if (state.noClickedOnce) return;
    state.noClickedOnce = true;

    // Get fresh references to current buttons
    const currentYes = document.getElementById('btn-yes');
    const currentNo = document.getElementById('btn-no');

    // Hide the original Yes button
    if (currentYes) currentYes.classList.add('hidden');

    // Show micro text
    const microText = document.createElement('p');
    microText.className = 'micro-text';
    microText.textContent = 'هممم… متأكدة؟ 😶';
    currentNo.parentNode.insertBefore(microText, currentNo.nextSibling);

    // Shake the button
    currentNo.classList.add('btn-shake');

    setTimeout(() => {
        // Add crack effect
        currentNo.classList.add('btn-crack');

        setTimeout(() => {
            // Fade out the no button
            currentNo.classList.add('btn-fade-out');

            setTimeout(() => {
                // Replace with new yes button
                const newYes = document.createElement('button');
                newYes.className = 'btn btn-primary btn-pop-in';
                newYes.textContent = 'نعم';
                newYes.addEventListener('click', handleTrickYesClick);

                currentNo.replaceWith(newYes);

                // Remove micro text
                microText.remove();
            }, 400);
        }, 300);
    }, 500);

}

function handleTrickYesClick() {
    // Show surprise message
    loveResponse.innerHTML = `
        هههههههههههه هبلة<br>
        من كل عقلك بدي اخليكي تختاري؟؟؟؟ غصبن عنك انتي حقي وبتحبيني ماشي؟؟؟.<br><br>
        وشكرًا لأنك بتحبيني كمان يا ${CONFIG.herName} 💗
    `;
    loveResponse.classList.remove('hidden');
    loveResponse.classList.add('surprise');

    // Hide the buttons
    loveButtons.classList.add('hidden');

    // Show next button
    btnLoveNext.classList.remove('hidden');

    // Subtle confetti
    createConfetti(10);
}

// ===== CONFETTI =====
function createConfetti(count = 20) {
    const hearts = ['💗', '💕', '💖', '💝', '❤️'];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.className = 'confetti-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${1.5 + Math.random()}s`;
            confettiContainer.appendChild(heart);

            // Remove after animation
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// ===== SCREEN 3: MEMORIES =====
const memoryPages = document.querySelectorAll('.memory-page');
const memoryDots = document.querySelectorAll('.dot');
const btnMemoryPrev = document.getElementById('btn-memory-prev');
const btnMemoryNext = document.getElementById('btn-memory-next');

function updateMemoryPage() {
    // Update pages
    memoryPages.forEach((page, i) => {
        page.classList.toggle('active', i + 1 === state.memoryPage);
    });

    // Update dots
    memoryDots.forEach((dot, i) => {
        dot.classList.toggle('active', i + 1 === state.memoryPage);
    });

    // Update buttons
    btnMemoryPrev.disabled = state.memoryPage === 1;

    // Change next button text on last page
    if (state.memoryPage === 4) {
        btnMemoryNext.textContent = 'التالي: لعبة نار شرار ';
        btnMemoryNext.setAttribute('data-navigate', 'screen-game');
    } else {
        btnMemoryNext.textContent = 'التالي';
        btnMemoryNext.removeAttribute('data-navigate');
    }
}

btnMemoryPrev.addEventListener('click', () => {
    if (state.memoryPage > 1) {
        state.memoryPage--;
        updateMemoryPage();
    }
});

btnMemoryNext.addEventListener('click', () => {
    if (state.memoryPage < 4) {
        state.memoryPage++;
        updateMemoryPage();
    } else {
        // Navigate to game
        navigateTo('screen-game');
    }
});

// Dot navigation
memoryDots.forEach(dot => {
    dot.addEventListener('click', () => {
        state.memoryPage = parseInt(dot.dataset.dot);
        updateMemoryPage();
    });
});

// ===== SCREEN 4: GAME =====
const gameIntro = document.getElementById('game-intro');
const gameArea = document.getElementById('game-area');
const gameResult = document.getElementById('game-result');
const gameField = document.getElementById('game-field');
const gameTimeEl = document.getElementById('game-time');
const gameScoreEl = document.getElementById('game-score');
const gameMessage = document.getElementById('game-message');
const btnStartGame = document.getElementById('btn-start-game');
const btnGameNext = document.getElementById('btn-game-next');
const btnRetry = document.getElementById('btn-retry');
const btnSkip = document.getElementById('btn-skip');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');

btnStartGame.addEventListener('click', startGame);
btnRetry.addEventListener('click', startGame);

function startGame() {
    // Reset game state
    state.gameScore = 0;
    state.gameTime = CONFIG.game.duration;

    // Update UI
    gameTimeEl.textContent = state.gameTime;
    gameScoreEl.textContent = state.gameScore;

    // Show game area
    gameIntro.classList.add('hidden');
    gameResult.classList.add('hidden');
    gameArea.classList.remove('hidden');
    gameMessage.classList.add('hidden');

    // Clear previous hearts
    gameField.innerHTML = '';

    // Start spawning hearts
    spawnHeart();
    state.spawnInterval = setInterval(spawnHeart, CONFIG.game.spawnInterval);

    // Start countdown
    state.gameInterval = setInterval(updateGameTimer, 1000);
}

function updateGameTimer() {
    state.gameTime--;
    gameTimeEl.textContent = state.gameTime;

    // Show message near end
    if (state.gameTime === 3 && state.gameScore < CONFIG.game.target) {
        showGameMessage('يلااا قربتي! 😄');
    }

    // Check win condition
    if (state.gameScore >= CONFIG.game.target) {
        endGame(true);
        return;
    }

    // Time's up
    if (state.gameTime <= 0) {
        endGame(false);
    }
}

function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'game-heart';

    // Golden heart chance
    const isGolden = Math.random() < CONFIG.game.goldenChance;
    heart.textContent = isGolden ? '💛' : '💗';
    if (isGolden) heart.classList.add('golden');
    heart.dataset.points = isGolden ? 5 : 1;

    // Random position
    const x = 10 + Math.random() * 70; // 10% to 80% from left
    const y = 15 + Math.random() * 60; // 15% to 75% from top
    heart.style.left = `${x}%`;
    heart.style.top = `${y}%`;

    // Click handler
    heart.addEventListener('click', () => catchHeart(heart));
    heart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        catchHeart(heart);
    }, { passive: false });

    gameField.appendChild(heart);

    // Remove after lifetime
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, CONFIG.game.heartLifetime);
}

function catchHeart(heart) {
    if (heart.classList.contains('caught')) return;

    const points = parseInt(heart.dataset.points);
    state.gameScore += points;
    gameScoreEl.textContent = state.gameScore;

    // Show bonus for golden heart
    if (points > 1) {
        showBonusText(heart, `+${points}! 🌟`);
    }

    // Animate and remove
    heart.classList.add('caught');
    setTimeout(() => heart.remove(), 300);

    // Check win
    if (state.gameScore >= CONFIG.game.target) {
        endGame(true);
    }
}

function showBonusText(heart, text) {
    const bonus = document.createElement('div');
    bonus.className = 'bonus-text';
    bonus.textContent = text;
    bonus.style.left = heart.style.left;
    bonus.style.top = heart.style.top;
    document.body.appendChild(bonus);

    setTimeout(() => bonus.remove(), 1000);
}

function showGameMessage(text) {
    gameMessage.textContent = text;
    gameMessage.classList.remove('hidden');

    setTimeout(() => {
        gameMessage.classList.add('hidden');
    }, 1500);
}

function endGame(won) {
    // Stop intervals
    clearInterval(state.gameInterval);
    clearInterval(state.spawnInterval);

    // Clear remaining hearts
    gameField.innerHTML = '';

    // Hide game area
    gameArea.classList.add('hidden');
    gameResult.classList.remove('hidden');

    if (won) {
        resultTitle.textContent = 'فزتي! 💗';
        resultText.textContent = 'زي ما دايمًا بتفوزي بقلبي 😎😎';
        btnGameNext.classList.remove('hidden');
        btnRetry.classList.add('hidden');
        btnSkip.classList.add('hidden');

        // Celebration
        createConfetti(15);
    } else {
        resultTitle.textContent = 'قريبة جدًا 😄';
        resultText.textContent = 'جربي كمان مرة… أنا واثق فيكي سوسو!';
        btnGameNext.classList.add('hidden');
        btnRetry.classList.remove('hidden');
        btnSkip.classList.remove('hidden');
    }
}

// ===== SCREEN 5: QUIZ =====
const quizOptions = document.querySelectorAll('.quiz-option');
const quizFeedback = document.getElementById('quiz-feedback');
const btnQuizNext = document.getElementById('btn-quiz-next');

quizOptions.forEach(option => {
    option.addEventListener('click', () => handleQuizAnswer(option));
});

function handleQuizAnswer(option) {
    const answer = option.dataset.answer;
    const isCorrect = answer === CONFIG.quizAnswer;

    // Remove previous states
    quizOptions.forEach(opt => {
        opt.classList.remove('correct', 'wrong');
        opt.disabled = false;
    });

    if (isCorrect) {
        option.classList.add('correct');
        quizFeedback.innerHTML = `صح! 💗<br>طبعًا… سوسو هي الملكة 👑`;
        quizFeedback.className = 'quiz-feedback correct';
        quizFeedback.classList.remove('hidden');
        btnQuizNext.classList.remove('hidden');

        // Disable all options
        quizOptions.forEach(opt => opt.disabled = true);
    } else {
        state.quizAttempts++;
        option.classList.add('wrong');
        quizFeedback.innerHTML = 'اكيد لا! 😄<br>جربي مرة ثانية.';
        quizFeedback.className = 'quiz-feedback wrong';
        quizFeedback.classList.remove('hidden');
    }
}

// ===== SCREEN 6: FINAL =====
const btnDownload = document.getElementById('btn-download');

btnDownload.addEventListener('click', () => {
    // Create a simple text to copy
    const message = `
💗 رسالة من ${CONFIG.hisName} إلى ${CONFIG.herName} 💗

ذكرى شو اللي بدك تحمليها عزيزتي بس ضفت ها الزر لانو حلو يكون زرين مش واحد
    `.trim();

    // Try to copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
        btnDownload.textContent = 'تم النسخ! 💕';
        setTimeout(() => {
            btnDownload.textContent = 'تحميل ذكرى 💕';
        }, 2000);
    }).catch(() => {
        // Fallback: show alert with text
        alert(message);
    });
});

// ===== RESET STATE =====
function resetState() {
    state.noClickedOnce = false;
    state.memoryPage = 1;
    state.gameScore = 0;
    state.gameTime = CONFIG.game.duration;
    state.quizAttempts = 0;

    // Reset love screen
    loveResponse.classList.add('hidden');
    btnLoveNext.classList.add('hidden');
    loveButtons.classList.remove('hidden');

    // Recreate original buttons if needed
    const loveButtonsContainer = document.getElementById('love-buttons');
    loveButtonsContainer.innerHTML = `
        <button class="btn btn-primary" id="btn-yes">نعم</button>
        <button class="btn btn-secondary" id="btn-no">لا</button>
    `;

    // Re-attach event listeners
    document.getElementById('btn-yes').addEventListener('click', handleYesClick);
    document.getElementById('btn-no').addEventListener('click', handleNoClick);

    // Reset memories
    updateMemoryPage();

    // Reset game
    gameIntro.classList.remove('hidden');
    gameArea.classList.add('hidden');
    gameResult.classList.add('hidden');

    // Reset quiz
    quizOptions.forEach(opt => {
        opt.classList.remove('correct', 'wrong');
        opt.disabled = false;
    });
    quizFeedback.classList.add('hidden');
    btnQuizNext.classList.add('hidden');
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Ensure first screen is active
    navigateTo('screen-welcome');

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('Reduced motion enabled - animations simplified');
    }
});

// ===== DEBUG (remove in production) =====
// window.DEBUG = { state, navigateTo, CONFIG };

