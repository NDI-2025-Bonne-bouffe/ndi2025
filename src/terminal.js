import './css/terminal.css';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const container = document.querySelector('.terminal-container');
    let snakeGame = null;

    // Red dot click to exit
    const redDot = document.querySelector('.terminal-dot.red');
    if (redDot) {
        redDot.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Focus input on click
    container.addEventListener('click', () => {
        if (!snakeGame) input.focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            handleCommand(command);
            input.value = '';
        }
    });

    function printOutput(text, className = '') {
        const div = document.createElement('div');
        div.className = `output-line ${className}`;
        div.textContent = text;
        output.appendChild(div);
        window.scrollTo(0, document.body.scrollHeight);
    }

    function printHTML(html) {
        const div = document.createElement('div');
        div.className = 'output-line';
        div.innerHTML = html;
        output.appendChild(div);
        window.scrollTo(0, document.body.scrollHeight);
    }

    function handleCommand(cmd) {
        // Echo command
        printHTML(`<span class="terminal-prompt">user@ndi2025:~$</span> <span class="terminal-command">${cmd}</span>`);

        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'help':
                printOutput('Available commands: help, ls, cat, echo, clear, whoami, exit');
                break;
            case 'ls':
                if (args.includes('-a')) {
                    printHTML('<span class="file">README.md</span>  <span class="file">project_notes.txt</span>  <span class="file secret">.code_secret</span>');
                } else {
                    printHTML('<span class="file">README.md</span>  <span class="file">project_notes.txt</span>');
                }
                break;
            case 'cat':
                if (args[0] === '.code_secret' || args[0] === 'code_secret') {
                    printOutput('Contenu de .code_secret :');
                    printOutput('Pour lancer le jeu caché, tapez la commande : snake_game_init');
                } else if (args[0] === 'README.md') {
                    printOutput('Bienvenue dans le terminal NDI 2025. Explorez pour trouver des secrets.');
                } else if (args[0] === 'project_notes.txt') {
                    printOutput('ls est fourbe...');
                } else if (args[0]) {
                    printOutput(`cat: ${args[0]}: No such file or directory`);
                } else {
                    printOutput('usage: cat [file]');
                }
                break;
            case 'echo':
                // Special case requested by user
                const fullArg = args.join(' ');
                if (fullArg === '"code secret"' || fullArg === "'code secret'" || fullArg === 'code secret') {
                     printOutput('Ah, vous connaissez le mot de passe ! La commande secrète est : snake_game_init');
                } else {
                    printOutput(fullArg);
                }
                break;
            case 'snake_game_init':
                startSnake();
                break;
            case 'clear':
                // Keep the welcome message or just clear? Standard clear removes everything.
                // But we need to keep the structure.
                // We can just remove all children of output except the first one if we wanted, but innerHTML='' is fine.
                // However, we need to make sure we don't remove the input line if it was inside... 
                // In my HTML structure, input-line is OUTSIDE terminal-output. So it's safe.
                output.innerHTML = '';
                break;
            case 'whoami':
                printOutput('visitor');
                break;
            case 'exit':
                window.location.href = 'index.html';
                break;
            case '':
                break;
            default:
                printOutput(`command not found: ${command}`);
        }
    }

    // Snake Game Logic
    function startSnake() {
        printOutput('Lancement du module Snake...');
        input.disabled = true;
        
        const canvas = document.createElement('canvas');
        canvas.id = 'snake-canvas';
        canvas.width = 400;
        canvas.height = 400;
        output.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const gridSize = 20;
        let snake = [{x: 10, y: 10}];
        let food = {x: 15, y: 15};
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameInterval;

        function draw() {
            // Clear
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Snake
            ctx.fillStyle = '#2ea043';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            });

            // Food
            ctx.fillStyle = '#ff5f56';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

            // Score
            ctx.fillStyle = '#fff';
            ctx.font = '20px Courier New';
            ctx.fillText(`Score: ${score}`, 10, 30);
        }

        function move() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            
            // Collision walls
            if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
                gameOver();
                return;
            }

            // Collision self
            if (snake.some(s => s.x === head.x && s.y === head.y)) {
                gameOver();
                return;
            }

            snake.unshift(head);

            // Eat food
            if (head.x === food.x && head.y === food.y) {
                score++;
                placeFood();
            } else {
                snake.pop();
            }
        }

        function placeFood() {
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
            // Ensure food is not on snake
            if (snake.some(s => s.x === food.x && s.y === food.y)) placeFood();
        }

        function gameOver() {
            clearInterval(gameInterval);
            printOutput(`Game Over! Score final: ${score}`);
            printOutput('Tapez "snake_game_init" pour rejouer.');
            canvas.remove();
            input.disabled = false;
            input.focus();
            document.removeEventListener('keydown', handleKey);
        }

        function handleKey(e) {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            switch(e.key) {
                case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
                case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
                case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
                case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
            }
        }

        document.addEventListener('keydown', handleKey);
        
        // Start game loop
        gameInterval = setInterval(() => {
            if (dx !== 0 || dy !== 0) {
                move();
            }
            draw();
        }, 150);
        
        printOutput('Utilisez les flèches directionnelles pour jouer.');
    }
});
