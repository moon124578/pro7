// CACOMIX Premium Dice Game Engine

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const rollBtn = document.getElementById('roll-btn');
    const resultText = document.getElementById('result-text');
    const totalScoreElem = document.getElementById('total-score');
    const historyElem = document.getElementById('roll-history');
    const messageElem = document.getElementById('message');

    let totalScore = 0;
    let isRolling = false;

    // Dice Rotation Mapping
    const rotations = {
        1: { x: 0, y: 0 },
        2: { x: -90, y: 0 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: 90, y: 0 },
        6: { x: 180, y: 0 }
    };

    const rollDice = () => {
        if (isRolling) return;
        isRolling = true;

        // Visual Feedback
        resultText.style.opacity = '0';
        rollBtn.disabled = true;

        const diceResults = [];
        const diceElems = [
            document.getElementById('dice-1'),
            document.getElementById('dice-2'),
            document.getElementById('dice-3')
        ];

        // Animate each die
        diceElems.forEach((dice, index) => {
            const result = Math.floor(Math.random() * 6) + 1;
            diceResults.push(result);

            // Calculate random extra rotations for "tumbling" effect
            const extraX = (Math.floor(Math.random() * 5) + 5) * 360;
            const extraY = (Math.floor(Math.random() * 5) + 5) * 360;

            const targetX = rotations[result].x + extraX;
            const targetY = rotations[result].y + extraY;

            // GSAP for smooth high-speed rotation
            gsap.to(dice, {
                rotateX: targetX,
                rotateY: targetY,
                duration: 1.5 + (Math.random() * 0.5),
                ease: "back.out(1.2)",
                onComplete: () => {
                    if (index === 2) finalizeRoll(diceResults);
                }
            });
        });
    };

    const finalizeRoll = (results) => {
        const sum = results.reduce((a, b) => a + b, 0);
        totalScore += sum;

        // Update UI
        resultText.innerText = `Result: ${sum}`;
        gsap.to(resultText, { opacity: 1, y: 0, duration: 0.5 });
        
        totalScoreElem.innerText = totalScore.toLocaleString();
        historyElem.innerText = results.join(' • ');

        // Check for Jackpot (All same)
        if (results[0] === results[1] && results[1] === results[2]) {
            showMessage(`JACKPOT! TRIPLE ${results[0]}`);
            confettiEffect();
        } else if (sum >= 15) {
            showMessage('HIGH ROLL!');
        }

        isRolling = false;
        rollBtn.disabled = false;
    };

    const showMessage = (msg) => {
        messageElem.innerText = msg;
        gsap.to(messageElem, {
            opacity: 1,
            y: -20,
            duration: 0.5,
            onComplete: () => {
                gsap.to(messageElem, {
                    opacity: 0,
                    y: 0,
                    delay: 1.5,
                    duration: 0.5
                });
            }
        });
    };

    const confettiEffect = () => {
        // Simple scale up effect for the container on jackpot
        gsap.to('#dice-container', {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 3
        });
    };

    // Event Listeners
    rollBtn.addEventListener('click', rollDice);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            rollDice();
        }
    });
});
