document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const digitalClock = document.getElementById('digital-clock');
    const pomodoroTime = document.getElementById('pomodoro-time');
    const pomodoroToggleButton = document.getElementById('pomodoro-toggle');
    const pomodoroResetButton = document.getElementById('pomodoro-reset');

    let pomodoroTimer;
    let pomodoroMinutes = 25;
    let pomodoroSeconds = 0;
    let isPomodoroRunning = false;
    let isPomodoroPaused = false;

    // Update digital clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Add task functionality
    window.addTask = function() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const li = document.createElement('li');
        li.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
        });

        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        
        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.textContent = taskText;
        
        const taskTime = document.createElement('span');
        taskTime.className = 'task-time';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            li.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => li.remove(), 300);
        };

        contentDiv.appendChild(taskName);
        contentDiv.appendChild(taskTime);
        
        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        
        document.getElementById('task-list').appendChild(li);
        taskInput.value = '';

        // Update time ago
        const startTime = new Date();
        function updateTime() {
            const elapsed = new Date() - startTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            let timeString = '';
            if (hours > 0) timeString = `${hours}h ago`;
            else if (minutes > 0) timeString = `${minutes}m ago`;
            else timeString = `${seconds}s ago`;
            
            taskTime.textContent = timeString;
        }
        setInterval(updateTime, 1000);
        updateTime();
    };

    // Pomodoro timer functionality
    window.togglePomodoro = function() {
        if (!isPomodoroRunning) {
            isPomodoroRunning = true;
            isPomodoroPaused = false;
            pomodoroTimer = setInterval(updatePomodoro, 1000);
            pomodoroToggleButton.textContent = 'Pause';
        } else {
            isPomodoroRunning = false;
            clearInterval(pomodoroTimer);
            pomodoroToggleButton.textContent = 'Start';
        }
    };

    window.resetPomodoro = function() {
        clearInterval(pomodoroTimer);
        isPomodoroRunning = false;
        isPomodoroPaused = false;
        pomodoroMinutes = 25;
        pomodoroSeconds = 0;
        updatePomodoroDisplay();
        pomodoroToggleButton.textContent = 'Start';
    };

    function updatePomodoro() {
        if (pomodoroSeconds === 0) {
            if (pomodoroMinutes === 0) {
                clearInterval(pomodoroTimer);
                isPomodoroRunning = false;
                pomodoroToggleButton.textContent = 'Start';
                alert('Time\'s up! Take a break!');
                return;
            }
            pomodoroMinutes--;
            pomodoroSeconds = 59;
        } else {
            pomodoroSeconds--;
        }
        updatePomodoroDisplay();
    }

    function updatePomodoroDisplay() {
        const minutes = String(pomodoroMinutes).padStart(2, '0');
        const seconds = String(pomodoroSeconds).padStart(2, '0');
        pomodoroTime.textContent = `${minutes}:${seconds}`;
    }

    // Keyboard shortcuts
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' && document.activeElement === document.body) {
            event.preventDefault();
            togglePomodoro();
        }
    });
});