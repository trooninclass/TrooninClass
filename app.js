// Main App Logic - Troonin's Class
// Teacher email for student submissions
const TEACHER_EMAIL = "kevin.troonin@browardschools.com";
// Microsoft Forms submission link
const FORMS_SUBMISSION_URL = "https://forms.office.com/Pages/ResponsePage.aspx?id=y7Ws7nBTWEOpaqN4PJXUIh2wyAHSkQ5FmNrgc70_4p1UM01TNFBaWUxHUzUyWFpBRDdZN1FUQTZVMS4u";
// Excel Online submission spreadsheet
const EXCEL_SHARE_URL = "https://browardcountyschools-my.sharepoint.com/:x:/g/personal/p00089617_browardschools_com1/IQD9TSV5dNlyT6axQ4MA9rK3ATtMNGVBSpbuvGaDpq1brag?e=ooK9cW";

let currentCategory = null;
let currentAssignment = null;
let currentQuestionIndex = 0;
let studentName = "";
let answers = {};
let canvas = null;
let ctx = null;
let isDrawing = false;
let currentColor = "#000000";

// Text-to-speech support
let currentSpeech = null;
const synth = window.speechSynthesis;

function speak(text, button) {
    // Stop any current speech
    if (currentSpeech) {
        synth.cancel();
        if (button) {
            button.classList.remove('speaking');
            button.innerHTML = '🔊';
        }
        currentSpeech = null;
        return;
    }
    
    // Create new speech
    currentSpeech = new SpeechSynthesisUtterance(text);
    currentSpeech.rate = 0.9; // Slightly slower for clarity
    currentSpeech.pitch = 1;
    currentSpeech.volume = 1;
    
    // Visual feedback
    if (button) {
        button.classList.add('speaking');
        button.innerHTML = '⏸️';
    }
    
    // When speech ends
    currentSpeech.onend = function() {
        currentSpeech = null;
        if (button) {
            button.classList.remove('speaking');
            button.innerHTML = '🔊';
        }
    };
    
    synth.speak(currentSpeech);
}

function createSpeakerButton(text, size = 'normal') {
    const btn = document.createElement('button');
    btn.className = 'speaker-btn';
    btn.innerHTML = '🔊';
    btn.title = 'Click to hear this read aloud';
    if (size === 'small') {
        btn.style.width = '35px';
        btn.style.height = '35px';
        btn.style.fontSize = '1em';
    }
    btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        speak(text, btn);
    };
    return btn;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadStudentName();
    setupEventListeners();
});

function setupEventListeners() {
    const nameInput = document.getElementById('studentName');
    nameInput.addEventListener('change', saveStudentName);
    nameInput.addEventListener('input', saveStudentName);
}

function saveStudentName() {
    studentName = document.getElementById('studentName').value;
    localStorage.setItem('studentName', studentName);
}

function loadStudentName() {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
        document.getElementById('studentName').value = savedName;
        studentName = savedName;
    }
}

function showCategory(categoryKey) {
    if (!studentName) {
        alert('Please enter your name first!');
        document.getElementById('studentName').focus();
        return;
    }

    currentCategory = categoryKey;
    const category = categories[categoryKey];
    
    // Hide category selection
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('studentInfoSection').style.display = 'none';
    
    // Show assignment selection for this category
    const assignmentSelection = document.getElementById('assignmentSelection');
    assignmentSelection.classList.remove('hidden');
    assignmentSelection.innerHTML = '';
    
    // Add back button
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.innerHTML = '← Back to Categories';
    backBtn.onclick = goToCategories;
    assignmentSelection.appendChild(backBtn);
    
    // Add category title
    const title = document.createElement('h2');
    title.style.marginBottom = '20px';
    title.style.color = '#2c3e50';
    title.textContent = category.name + ' - Choose an Assignment:';
    assignmentSelection.appendChild(title);
    
    // Create assignment grid
    const grid = document.createElement('div');
    grid.className = 'assignment-grid';
    
    const assignments = category.assignments;
    const assignmentKeys = Object.keys(assignments);
    
    if (assignmentKeys.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #6c757d; font-size: 1.2em;">No assignments yet. Check back soon!</p>';
    } else {
        assignmentKeys.forEach(key => {
            const assignment = assignments[key];
            const card = document.createElement('div');
            card.className = 'assignment-card';
            
            // Assign color based on type
            if (assignment.type === 'matching') card.classList.add('vocab');
            else if (assignment.type === 'short-answer') card.classList.add('comprehension');
            else if (assignment.type === 'math') card.classList.add('math');
            else if (assignment.type === 'open-ended') card.classList.add('thinking');
            
            card.innerHTML = `
                <h3>${getIconForType(assignment.type)} ${assignment.title}</h3>
                <p>${getDescriptionForType(assignment.type)}</p>
            `;
            card.onclick = () => startAssignment(categoryKey, key);
            grid.appendChild(card);
        });
    }
    
    assignmentSelection.appendChild(grid);
}

function getIconForType(type) {
    switch(type) {
        case 'matching': return '📚';
        case 'short-answer': return '📖';
        case 'math': return '🔢';
        case 'open-ended': return '💭';
        default: return '📝';
    }
}

function getDescriptionForType(type) {
    switch(type) {
        case 'matching': return 'Match words and definitions';
        case 'short-answer': return 'Answer questions';
        case 'math': return 'Solve word problems';
        case 'open-ended': return 'Share your thoughts';
        default: return 'Complete the assignment';
    }
}

function startAssignment(categoryKey, assignmentKey) {
    currentCategory = categoryKey;
    currentAssignment = categories[categoryKey].assignments[assignmentKey];
    currentQuestionIndex = 0;
    answers = {};

    // Hide assignment selection
    document.getElementById('assignmentSelection').classList.add('hidden');

    renderAssignment();
}

function renderAssignment() {
    const content = document.getElementById('assignmentContent');
    content.innerHTML = '';

    const assignmentDiv = document.createElement('div');
    assignmentDiv.className = 'assignment-view active';

    // Header
    const header = `
        <h2 style="color: #2c3e50; margin-bottom: 10px;">${currentAssignment.title}</h2>
        <p style="font-size: 1.1em; color: #6c757d; margin-bottom: 20px;">${currentAssignment.instructions}</p>
    `;
    assignmentDiv.innerHTML = header;

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `<div class="progress-fill" style="width: 0%">0%</div>`;
    assignmentDiv.appendChild(progressBar);

    // Render based on type
    if (currentAssignment.type === 'matching') {
        renderMatchingAssignment(assignmentDiv);
    } else if (currentAssignment.type === 'short-answer') {
        renderShortAnswerAssignment(assignmentDiv);
    } else if (currentAssignment.type === 'math') {
        renderMathAssignment(assignmentDiv);
    } else if (currentAssignment.type === 'open-ended') {
        renderOpenEndedAssignment(assignmentDiv);
    } else if (currentAssignment.type === 'story-sequence') {
        renderStorySequenceAssignment(assignmentDiv);
    } else if (currentAssignment.type === 'coordinate-plane') {
        renderCoordinatePlaneAssignment(assignmentDiv);
    } else if (currentAssignment.type === 'money-interactive') {
        renderMoneyInteractiveAssignment(assignmentDiv);
    }

    content.appendChild(assignmentDiv);
    updateProgress();
}

function renderMatchingAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Word ${currentQuestionIndex + 1} of ${currentAssignment.questions.length}`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.innerHTML = `Match the word: <strong>${question.word}</strong>`;
    questionTextDiv.appendChild(createSpeakerButton(`Match the word: ${question.word}`));
    questionDiv.appendChild(questionTextDiv);
    
    const optionsDiv = document.createElement('div');
    optionsDiv.style.marginTop = '15px';
    
    question.options.forEach(opt => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.padding = '12px';
        label.style.margin = '8px 0';
        label.style.background = 'white';
        label.style.border = '2px solid #dee2e6';
        label.style.borderRadius = '8px';
        label.style.cursor = 'pointer';
        label.style.transition = 'all 0.3s';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = opt.letter;
        radio.style.marginRight = '10px';
        
        const textSpan = document.createElement('span');
        textSpan.innerHTML = `<strong>${opt.letter}.</strong> ${opt.text}`;
        
        label.appendChild(radio);
        label.appendChild(textSpan);
        label.appendChild(createSpeakerButton(`${opt.letter}. ${opt.text}`, 'small'));
        
        radio.addEventListener('change', function() {
            answers[currentQuestionIndex] = this.value;
            // Highlight selected option
            optionsDiv.querySelectorAll('label').forEach(l => l.style.borderColor = '#dee2e6');
            label.style.borderColor = '#667eea';
            label.style.background = '#f0f4ff';
        });
        
        optionsDiv.appendChild(label);
    });
    
    questionDiv.appendChild(optionsDiv);
    container.appendChild(questionDiv);
    
    addNavigationButtons(container);
}

function renderShortAnswerAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Question ${question.number}`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.textContent = question.text;
    questionTextDiv.appendChild(createSpeakerButton(question.text));
    questionDiv.appendChild(questionTextDiv);
    
    if (question.hint) {
        const hintDiv = document.createElement('p');
        hintDiv.style.color = '#6c757d';
        hintDiv.style.fontStyle = 'italic';
        hintDiv.style.marginBottom = '10px';
        hintDiv.textContent = question.hint;
        questionDiv.appendChild(hintDiv);
    }
    
    if (question.type === 'drawing') {
        const label = document.createElement('label');
        label.className = 'work-area-label';
        label.textContent = 'Draw your answer:';
        questionDiv.appendChild(label);
        
        const canvas = document.createElement('canvas');
        canvas.className = 'drawing-canvas';
        canvas.width = 700;
        canvas.height = 400;
        canvas.id = 'drawingCanvas';
        questionDiv.appendChild(canvas);
        
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'canvas-controls';
        controlsDiv.innerHTML = `
            <button class="color-btn active" style="background: #000000;" onclick="changeColor('#000000')"></button>
            <button class="color-btn" style="background: #FF0000;" onclick="changeColor('#FF0000')"></button>
            <button class="color-btn" style="background: #0000FF;" onclick="changeColor('#0000FF')"></button>
            <button class="color-btn" style="background: #00FF00;" onclick="changeColor('#00FF00')"></button>
            <button class="color-btn" style="background: #FFA500;" onclick="changeColor('#FFA500')"></button>
            <button class="canvas-btn clear" onclick="clearCanvas()">Clear Drawing</button>
        `;
        questionDiv.appendChild(controlsDiv);
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'answer-input';
        input.placeholder = 'Type your answer here...';
        input.id = 'answerInput';
        questionDiv.appendChild(input);
        
        // Load saved answer if exists
        setTimeout(() => {
            if (answers[currentQuestionIndex]) {
                input.value = answers[currentQuestionIndex];
            }
            input.addEventListener('input', function() {
                answers[currentQuestionIndex] = this.value;
            });
        }, 0);
    }
    
    container.appendChild(questionDiv);
    
    if (question.type === 'drawing') {
        setupCanvas();
    }
    
    addNavigationButtons(container);
}

function renderMathAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Problem ${question.number}`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.textContent = question.text;
    questionTextDiv.appendChild(createSpeakerButton(question.text));
    questionDiv.appendChild(questionTextDiv);
    
    const workLabel = document.createElement('label');
    workLabel.className = 'work-area-label';
    workLabel.textContent = 'Show Your Work:';
    questionDiv.appendChild(workLabel);
    
    const canvas = document.createElement('canvas');
    canvas.className = 'drawing-canvas';
    canvas.width = 700;
    canvas.height = 300;
    canvas.id = 'drawingCanvas';
    questionDiv.appendChild(canvas);
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'canvas-controls';
    controlsDiv.innerHTML = `
        <button class="color-btn active" style="background: #000000;" onclick="changeColor('#000000')"></button>
        <button class="color-btn" style="background: #FF0000;" onclick="changeColor('#FF0000')"></button>
        <button class="color-btn" style="background: #0000FF;" onclick="changeColor('#0000FF')"></button>
        <button class="canvas-btn clear" onclick="clearCanvas()">Clear Work</button>
    `;
    questionDiv.appendChild(controlsDiv);
    
    const answerDiv = document.createElement('div');
    answerDiv.style.marginTop = '20px';
    
    const answerLabel = document.createElement('label');
    answerLabel.className = 'work-area-label';
    answerLabel.textContent = 'Answer:';
    answerDiv.appendChild(answerLabel);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'answer-input';
    input.placeholder = 'Type your answer here...';
    input.id = 'answerInput';
    answerDiv.appendChild(input);
    
    const answerFormat = document.createElement('p');
    answerFormat.style.marginTop = '10px';
    answerFormat.style.color = '#6c757d';
    answerFormat.textContent = question.answer;
    answerDiv.appendChild(answerFormat);
    
    questionDiv.appendChild(answerDiv);
    container.appendChild(questionDiv);
    
    setupCanvas();
    
    // Load saved answer if exists
    setTimeout(() => {
        if (answers[currentQuestionIndex]) {
            input.value = answers[currentQuestionIndex].text || '';
        }
        input.addEventListener('input', function() {
            if (!answers[currentQuestionIndex]) {
                answers[currentQuestionIndex] = {};
            }
            answers[currentQuestionIndex].text = this.value;
        });
    }, 0);
    
    addNavigationButtons(container);
}

function renderOpenEndedAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Question ${question.number}`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.textContent = question.text;
    questionTextDiv.appendChild(createSpeakerButton(question.text));
    questionDiv.appendChild(questionTextDiv);
    
    if (question.hint) {
        const hintDiv = document.createElement('p');
        hintDiv.style.color = '#6c757d';
        hintDiv.style.fontStyle = 'italic';
        hintDiv.style.marginBottom = '10px';
        hintDiv.textContent = question.hint;
        questionDiv.appendChild(hintDiv);
    }
    
    if (question.options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.style.margin = '15px 0';
        
        question.options.forEach(opt => {
            const label = document.createElement('label');
            label.style.display = 'inline-block';
            label.style.padding = '10px 20px';
            label.style.margin = '5px';
            label.style.background = 'white';
            label.style.border = '2px solid #dee2e6';
            label.style.borderRadius = '8px';
            label.style.cursor = 'pointer';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'yesno';
            radio.value = opt;
            radio.style.marginRight = '8px';
            
            label.appendChild(radio);
            label.appendChild(document.createTextNode(opt));
            
            radio.addEventListener('change', function() {
                if (!answers[currentQuestionIndex]) {
                    answers[currentQuestionIndex] = {};
                }
                answers[currentQuestionIndex].choice = this.value;
            });
            
            if (answers[currentQuestionIndex] && answers[currentQuestionIndex].choice === opt) {
                radio.checked = true;
            }
            
            optionsDiv.appendChild(label);
        });
        
        questionDiv.appendChild(optionsDiv);
    }
    
    if (question.type === 'drawing') {
        const label = document.createElement('label');
        label.className = 'work-area-label';
        label.textContent = 'Draw your answer:';
        questionDiv.appendChild(label);
        
        const canvas = document.createElement('canvas');
        canvas.className = 'drawing-canvas';
        canvas.width = 700;
        canvas.height = 400;
        canvas.id = 'drawingCanvas';
        questionDiv.appendChild(canvas);
        
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'canvas-controls';
        controlsDiv.innerHTML = `
            <button class="color-btn active" style="background: #000000;" onclick="changeColor('#000000')"></button>
            <button class="color-btn" style="background: #FF0000;" onclick="changeColor('#FF0000')"></button>
            <button class="color-btn" style="background: #0000FF;" onclick="changeColor('#0000FF')"></button>
            <button class="color-btn" style="background: #00FF00;" onclick="changeColor('#00FF00')"></button>
            <button class="color-btn" style="background: #FFA500;" onclick="changeColor('#FFA500')"></button>
            <button class="canvas-btn clear" onclick="clearCanvas()">Clear Drawing</button>
        `;
        questionDiv.appendChild(controlsDiv);
    }
    
    const answerDiv = document.createElement('div');
    answerDiv.style.marginTop = '15px';
    
    const promptLabel = document.createElement('label');
    promptLabel.className = 'work-area-label';
    promptLabel.textContent = question.prompt;
    answerDiv.appendChild(promptLabel);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'answer-input';
    input.placeholder = 'Type your answer here...';
    input.id = 'answerInput';
    answerDiv.appendChild(input);
    
    questionDiv.appendChild(answerDiv);
    container.appendChild(questionDiv);
    
    if (question.type === 'drawing') {
        setupCanvas();
    }
    
    // Load saved answer
    setTimeout(() => {
        if (answers[currentQuestionIndex]) {
            input.value = answers[currentQuestionIndex].text || '';
        }
        input.addEventListener('input', function() {
            if (!answers[currentQuestionIndex]) {
                answers[currentQuestionIndex] = {};
            }
            answers[currentQuestionIndex].text = this.value;
        });
    }, 0);
    
    addNavigationButtons(container);
}

function setupCanvas() {
    setTimeout(() => {
        canvas = document.getElementById('drawingCanvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        
        // Load saved drawing if exists
        if (answers[currentQuestionIndex] && answers[currentQuestionIndex].drawing) {
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
            };
            img.src = answers[currentQuestionIndex].drawing;
        }
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch support
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', stopDrawing);
    }, 100);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveCanvas();
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function changeColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;
    
    // Update active button
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.style.background === color) {
            btn.classList.add('active');
        }
    });
}

function clearCanvas() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvas();
}

function saveCanvas() {
    if (!canvas) return;
    if (!answers[currentQuestionIndex]) {
        answers[currentQuestionIndex] = {};
    }
    answers[currentQuestionIndex].drawing = canvas.toDataURL();
}

function addNavigationButtons(container) {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    
    const totalQuestions = currentAssignment.questions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    
    if (currentQuestionIndex > 0) {
        buttonGroup.innerHTML += `
            <button class="btn btn-secondary" onclick="previousQuestion()">← Previous</button>
        `;
    }
    
    buttonGroup.innerHTML += `
        <button class="btn btn-secondary" onclick="backToAssignments()">Back to Assignments</button>
    `;
    
    if (!isLastQuestion) {
        buttonGroup.innerHTML += `
            <button class="btn btn-primary" onclick="nextQuestion()">Next →</button>
        `;
    } else {
        buttonGroup.innerHTML += `
            <button class="btn btn-success" onclick="finishAssignment()">Finish! ✓</button>
        `;
    }
    
    container.appendChild(buttonGroup);
}

function nextQuestion() {
    if (currentQuestionIndex < currentAssignment.questions.length - 1) {
        currentQuestionIndex++;
        renderAssignment();
        window.scrollTo(0, 0);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderAssignment();
        window.scrollTo(0, 0);
    }
}

function updateProgress() {
    const totalQuestions = currentAssignment.questions.length;
    const answered = Object.keys(answers).length;
    const percentage = Math.round((currentQuestionIndex / totalQuestions) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    }
}

function finishAssignment() {
    const content = document.getElementById('assignmentContent');
    
    content.innerHTML = `
        <div class="completion-message">
            <h2>🎉 Great Job, ${studentName}! 🎉</h2>
            <p style="font-size: 1.3em; margin: 20px 0;">You completed ${currentAssignment.title}!</p>
            <p style="font-size: 1.1em;">Now submit your work to Mr. Troonin!</p>
            <div class="button-group" style="justify-content: center; margin-top: 30px;">
                <button class="btn btn-success" onclick="submitToForm()" style="font-size: 1.2em; padding: 20px 40px;">📝 Submit to Mr. Troonin</button>
            </div>
            <div class="button-group" style="justify-content: center; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="downloadDrawings()" style="font-size: 1em; padding: 15px 30px;">💾 Download My Drawings First</button>
            </div>
            <div class="button-group" style="justify-content: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="backToAssignments()">Choose Another Assignment</button>
            </div>
        </div>
    `;
}

function finishAssignment() {
    const content = document.getElementById('assignmentContent');
    
    content.innerHTML = `
        <div class="completion-message">
            <h2>🎉 Great Job, ${studentName}! 🎉</h2>
            <p style="font-size: 1.3em; margin: 20px 0;">You completed ${currentAssignment.title}!</p>
            <p style="font-size: 1.1em;">Now email your work to Mr. Troonin!</p>
            <div class="button-group" style="justify-content: center; margin-top: 30px;">
                <button class="btn btn-success" onclick="emailToTeacher()" style="font-size: 1.2em; padding: 20px 40px;">📧 Email My Work to Mr. Troonin</button>
            </div>
            <div class="button-group" style="justify-content: center; margin-top: 20px;">
                <button class="btn btn-primary" onclick="backToAssignments()">Choose Another Assignment</button>
            </div>
        </div>
    `;
}

function emailToTeacher() {
    // Save submission to localStorage for teacher dashboard
    const submissionData = {
        studentName: studentName,
        assignmentTitle: currentAssignment.title,
        category: categories[currentCategory].name,
        timestamp: new Date().toISOString(),
        questions: currentAssignment.questions,
        answers: answers
    };
    
    const submissionKey = `submission_${Date.now()}_${studentName.replace(/\s/g, '_')}`;
    localStorage.setItem(submissionKey, JSON.stringify(submissionData));
    
    // Create formatted text version of answers
    let emailBody = `Student: ${studentName}\n`;
    emailBody += `Assignment: ${currentAssignment.title}\n`;
    emailBody += `Category: ${categories[currentCategory].name}\n`;
    emailBody += `Date: ${new Date().toLocaleDateString()}\n`;
    emailBody += `Time: ${new Date().toLocaleTimeString()}\n`;
    emailBody += `\n${'='.repeat(50)}\n\n`;
    
    // Format answers based on assignment type
    currentAssignment.questions.forEach((question, index) => {
        const answer = answers[index];
        
        if (currentAssignment.type === 'matching') {
            emailBody += `${index + 1}. ${question.word}\n`;
            emailBody += `   Answer: ${answer || 'Not answered'}\n\n`;
        } else if (currentAssignment.type === 'short-answer') {
            emailBody += `Question ${question.number}: ${question.text}\n`;
            if (question.type === 'drawing') {
                emailBody += `   Answer: [I drew a picture - I will show you!]\n\n`;
            } else {
                emailBody += `   Answer: ${answer || 'Not answered'}\n\n`;
            }
        } else if (currentAssignment.type === 'math') {
            emailBody += `Problem ${question.number}:\n`;
            emailBody += `${question.text}\n`;
            emailBody += `   Answer: ${answer?.text || 'Not answered'}\n`;
            emailBody += `   [I showed my work on paper - I will show you!]\n\n`;
        } else if (currentAssignment.type === 'open-ended') {
            emailBody += `Question ${question.number}: ${question.text}\n`;
            if (question.options && answer?.choice) {
                emailBody += `   Selected: ${answer.choice}\n`;
            }
            if (question.type === 'drawing') {
                emailBody += `   [I drew a picture - I will show you!]\n`;
            }
            emailBody += `   ${question.prompt} ${answer?.text || 'Not answered'}\n\n`;
        } else if (currentAssignment.type === 'story-sequence') {
            emailBody += `${question.prompt} ${answer || 'Not answered'}\n\n`;
        } else if (currentAssignment.type === 'coordinate-plane') {
            if (answer && answer.correct) {
                emailBody += `Question ${question.number}: Correctly plotted ${question.medalType} medal at (${question.correctX}, ${question.correctY}) ✓\n\n`;
            } else if (answer) {
                emailBody += `Question ${question.number}: Plotted at (${answer.x}, ${answer.y}) - Correct answer: (${question.correctX}, ${question.correctY})\n\n`;
            } else {
                emailBody += `Question ${question.number}: Not answered\n\n`;
            }
        } else if (currentAssignment.type === 'money-interactive') {
            if (answer && answer.correct) {
                emailBody += `Question ${question.number}: Correctly made $${question.targetAmount.toFixed(2)} ✓\n\n`;
            } else if (answer) {
                emailBody += `Question ${question.number}: Made $${answer.amount.toFixed(2)} - Target was $${question.targetAmount.toFixed(2)}\n\n`;
            } else {
                emailBody += `Question ${question.number}: Not answered\n\n`;
            }
        }
    });
    
    emailBody += `\n${'='.repeat(50)}\n`;
    emailBody += `End of Assignment\n`;
    
    // Add note about drawings if applicable
    if (hasDrawings()) {
        emailBody += `\nNote: This assignment included drawings. I will show them to you in class or can email them separately if needed.`;
    }
    
    // Create subject line
    const subject = `${studentName} - ${currentAssignment.title}`;
    
    // Encode for mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(emailBody);
    
    // Create mailto link
    const mailtoLink = `mailto:${TEACHER_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show confirmation message
    setTimeout(() => {
        alert('✅ Your email program should open now!\n\nIf it doesn\'t open:\n1. Make sure you have an email program set up\n2. Ask Mr. Troonin for help\n\nJust click SEND in the email!');
    }, 500);
}

function hasDrawings() {
    return currentAssignment.questions.some((q, i) => 
        (q.type === 'drawing' || currentAssignment.type === 'math') && answers[i]
    );
}

function copySubmissionText() {
    const textarea = document.getElementById('answersToCopy');
    textarea.select();
    document.execCommand('copy');
    alert('✅ Answers copied! Now:\n1. Open the submission sheet\n2. Find the next empty row\n3. Fill in your information\n4. Paste your answers in Column E');
}

function openExcelSheet() {
    window.open(EXCEL_SHARE_URL, '_blank');
    alert('📊 Submission sheet opened!\n\nRemember:\n1. Sign in if needed\n2. Go to the next empty row\n3. Fill in your name, assignment, category, date\n4. Paste your answers in Column E\n5. It saves automatically!');
}

function hasDrawings() {
    return currentAssignment.questions.some((q, i) => 
        answers[i] && answers[i].drawing
    );
}

function copyFormattedAnswers() {
    const formattedHTML = localStorage.getItem('tempFormattedAnswers');
    
    // Create a temporary textarea to copy the HTML
    const textarea = document.createElement('textarea');
    textarea.value = formattedHTML;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        alert('✅ Formatted answers copied! Now:\n1. Open the form\n2. Paste into Question 2\n3. Upload drawings if you drew anything\n4. Submit!');
    } catch (err) {
        alert('❌ Copy failed. Please manually select and copy the text above.');
    }
    
    document.body.removeChild(textarea);
}

function copyAnswers() {
    const textarea = document.getElementById('answersToCopy');
    textarea.select();
    document.execCommand('copy');
    alert('✅ Answers copied! Now open the form and paste them in Question 2.');
}

function openMicrosoftForm() {
    window.open(FORMS_SUBMISSION_URL, '_blank');
    alert('Form opened in new tab! Remember to:\n1. Paste your answers in Question 2\n2. Upload drawings in Question 3 (if you drew anything)\n3. Click Submit!');
}

function downloadDrawings() {
    // Collect all drawings from the assignment
    const drawings = [];
    currentAssignment.questions.forEach((question, index) => {
        if (answers[index] && answers[index].drawing) {
            drawings.push({
                questionNumber: question.number || (index + 1),
                data: answers[index].drawing
            });
        }
    });
    
    if (drawings.length === 0) {
        alert('No drawings found in this assignment!');
        return;
    }
    
    // Download each drawing
    drawings.forEach((drawing, idx) => {
        const link = document.createElement('a');
        link.href = drawing.data;
        link.download = `${studentName}_${currentAssignment.title}_Question${drawing.questionNumber}.png`;
        link.click();
    });
    
    alert(`Downloaded ${drawings.length} drawing(s)! Upload these files in Question 3 of the form.`);
}

function emailToTeacher() {
    // Create formatted text version of answers
    let emailBody = `Student: ${studentName}\n`;
    emailBody += `Assignment: ${currentAssignment.title}\n`;
    emailBody += `Category: ${categories[currentCategory].name}\n`;
    emailBody += `Date: ${new Date().toLocaleDateString()}\n`;
    emailBody += `Time: ${new Date().toLocaleTimeString()}\n`;
    emailBody += `\n${'='.repeat(50)}\n\n`;
    
    // Format answers based on assignment type
    currentAssignment.questions.forEach((question, index) => {
        const answer = answers[index];
        
        if (currentAssignment.type === 'matching') {
            emailBody += `${index + 1}. ${question.word}\n`;
            emailBody += `   Answer: ${answer || 'Not answered'}\n\n`;
        } else if (currentAssignment.type === 'short-answer') {
            emailBody += `Question ${question.number}: ${question.text}\n`;
            if (question.type === 'drawing') {
                emailBody += `   Answer: [Drawing - see attachment if available]\n\n`;
            } else {
                emailBody += `   Answer: ${answer || 'Not answered'}\n\n`;
            }
        } else if (currentAssignment.type === 'math') {
            emailBody += `Problem ${question.number}:\n`;
            emailBody += `${question.text}\n`;
            emailBody += `   Answer: ${answer?.text || 'Not answered'}\n`;
            emailBody += `   [Work shown in drawing]\n\n`;
        } else if (currentAssignment.type === 'open-ended') {
            emailBody += `Question ${question.number}: ${question.text}\n`;
            if (question.options && answer?.choice) {
                emailBody += `   Selected: ${answer.choice}\n`;
            }
            if (question.type === 'drawing') {
                emailBody += `   Answer: [Drawing - see attachment if available]\n`;
            }
            emailBody += `   ${question.prompt} ${answer?.text || 'Not answered'}\n\n`;
        }
    });
    
    emailBody += `\n${'='.repeat(50)}\n`;
    emailBody += `End of Assignment\n`;
    
    // Create subject line
    const subject = `${studentName} - ${currentAssignment.title}`;
    
    // Encode for mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(emailBody);
    
    // Create mailto link
    const mailtoLink = `mailto:${TEACHER_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show confirmation message
    setTimeout(() => {
        alert('Your email program should open now!\n\nIf it doesn\'t open:\n1. Make sure you have an email program installed\n2. Try the "Back" button and click Email again\n3. Or ask Mr. Troonin for help!');
    }, 500);
}

function downloadAnswers() {
    const data = {
        studentName: studentName,
        category: categories[currentCategory].name,
        assignment: currentAssignment.title,
        date: new Date().toLocaleDateString(),
        answers: answers
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentName}_${currentAssignment.title}_${Date.now()}.json`;
    link.click();
}

function backToAssignments() {
    document.getElementById('assignmentContent').innerHTML = '';
    showCategory(currentCategory);
}

function renderStorySequenceAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Part ${question.number} of 3`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.textContent = question.text;
    questionTextDiv.appendChild(createSpeakerButton(question.text));
    questionDiv.appendChild(questionTextDiv);
    
    const promptLabel = document.createElement('label');
    promptLabel.className = 'work-area-label';
    promptLabel.textContent = question.prompt;
    promptLabel.style.marginTop = '15px';
    questionDiv.appendChild(promptLabel);
    
    const textarea = document.createElement('textarea');
    textarea.className = 'answer-input';
    textarea.placeholder = 'Type your answer here...';
    textarea.id = 'answerInput';
    textarea.style.height = '150px';
    textarea.style.resize = 'vertical';
    questionDiv.appendChild(textarea);
    
    container.appendChild(questionDiv);
    
    // Load saved answer
    setTimeout(() => {
        if (answers[currentQuestionIndex]) {
            textarea.value = answers[currentQuestionIndex];
        }
        textarea.addEventListener('input', function() {
            answers[currentQuestionIndex] = this.value;
        });
    }, 0);
    
    addNavigationButtons(container);
}

function renderCoordinatePlaneAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Question ${question.number} of ${currentAssignment.questions.length}`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.textContent = question.text;
    questionTextDiv.appendChild(createSpeakerButton(question.text));
    questionDiv.appendChild(questionTextDiv);
    
    // Create coordinate plane canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    canvas.id = 'coordinatePlaneCanvas';
    canvas.style.border = '3px solid #667eea';
    canvas.style.borderRadius = '10px';
    canvas.style.cursor = 'crosshair';
    canvas.style.background = 'white';
    canvas.style.display = 'block';
    canvas.style.margin = '20px auto';
    questionDiv.appendChild(canvas);
    
    // Feedback div
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'coordinateFeedback';
    feedbackDiv.style.textAlign = 'center';
    feedbackDiv.style.fontSize = '1.3em';
    feedbackDiv.style.fontWeight = 'bold';
    feedbackDiv.style.marginTop = '20px';
    feedbackDiv.style.padding = '15px';
    feedbackDiv.style.borderRadius = '10px';
    questionDiv.appendChild(feedbackDiv);
    
    container.appendChild(questionDiv);
    
    // Draw coordinate plane
    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        drawCoordinatePlane(ctx, canvas.width, canvas.height);
        
        // Check if already answered
        if (answers[currentQuestionIndex]) {
            const answer = answers[currentQuestionIndex];
            if (answer.correct) {
                drawMedal(ctx, answer.x, answer.y, question.medalType, canvas.width, canvas.height);
                feedbackDiv.textContent = '✅ Correct!';
                feedbackDiv.style.background = '#d4edda';
                feedbackDiv.style.color = '#155724';
            }
        }
        
        // Handle clicks
        canvas.addEventListener('click', function(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find nearest grid intersection
            const gridSize = canvas.width / 6;
            const gridX = Math.round(x / gridSize); // Round to nearest line
            const gridY = Math.round((canvas.height - y) / gridSize); // Round and flip Y
            
            // Make sure we're within bounds
            if (gridX < 0 || gridX > 5 || gridY < 0 || gridY > 5) {
                return;
            }
            
            // Check if correct
            const isCorrect = (gridX === question.correctX && gridY === question.correctY);
            
            // Clear and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCoordinatePlane(ctx, canvas.width, canvas.height);
            drawMedal(ctx, gridX, gridY, question.medalType, canvas.width, canvas.height);
            
            // Show feedback
            if (isCorrect) {
                feedbackDiv.textContent = '✅ Correct! Great job!';
                feedbackDiv.style.background = '#d4edda';
                feedbackDiv.style.color = '#155724';
                answers[currentQuestionIndex] = {
                    x: gridX,
                    y: gridY,
                    correct: true
                };
            } else {
                feedbackDiv.textContent = `❌ Not quite. You clicked (${gridX}, ${gridY}). Try again!`;
                feedbackDiv.style.background = '#f8d7da';
                feedbackDiv.style.color = '#721c24';
                answers[currentQuestionIndex] = {
                    x: gridX,
                    y: gridY,
                    correct: false
                };
            }
        });
    }, 100);
    
    addNavigationButtons(container);
}

function drawCoordinatePlane(ctx, width, height) {
    const gridSize = width / 6;
    
    // Draw grid lines (lighter gray)
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw axes - thicker lines for X and Y axis
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    // X-axis (bottom)
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.stroke();
    // Y-axis (left)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
    
    // X-axis labels - ON THE LINES (at the bottom)
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i <= 5; i++) {
        // Draw background circle for better visibility
        ctx.beginPath();
        ctx.arc(i * gridSize, height - 15, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw number
        ctx.fillStyle = '#000';
        ctx.fillText(i.toString(), i * gridSize, height - 21);
    }
    
    // Y-axis labels - ON THE LINES (on the left)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 1; i <= 5; i++) {
        // Draw background circle for better visibility
        ctx.beginPath();
        ctx.arc(15, height - i * gridSize, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw number
        ctx.fillStyle = '#000';
        ctx.fillText(i.toString(), 15, height - i * gridSize);
    }
}

function drawMedal(ctx, gridX, gridY, type, width, height) {
    const gridSize = width / 6;
    // Place medal at the intersection point (on the line)
    const centerX = gridX * gridSize;
    const centerY = height - (gridY * gridSize);
    
    // Draw medal circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    
    if (type === 'gold') {
        ctx.fillStyle = '#FFD700';
    } else if (type === 'silver') {
        ctx.fillStyle = '#C0C0C0';
    } else if (type === 'bronze') {
        ctx.fillStyle = '#CD7F32';
    }
    
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw star or number
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', centerX, centerY);
}

function renderMoneyInteractiveAssignment(container) {
    const question = currentAssignment.questions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    
    const questionNumberDiv = document.createElement('div');
    questionNumberDiv.className = 'question-number';
    questionNumberDiv.textContent = `Question ${question.number} of ${currentAssignment.questions.length}`;
    questionDiv.appendChild(questionNumberDiv);
    
    const questionTextDiv = document.createElement('div');
    questionTextDiv.className = 'question-text';
    questionTextDiv.innerHTML = `${question.text}<br><strong style="color: #28a745;">Target: $${question.targetAmount.toFixed(2)}</strong>`;
    questionTextDiv.appendChild(createSpeakerButton(question.text));
    questionDiv.appendChild(questionTextDiv);
    
    // Container for side-by-side layout
    const layoutContainer = document.createElement('div');
    layoutContainer.style.display = 'grid';
    layoutContainer.style.gridTemplateColumns = '1fr 1fr';
    layoutContainer.style.gap = '20px';
    layoutContainer.style.marginTop = '20px';
    
    // Money bank section (LEFT SIDE)
    const bankSection = document.createElement('div');
    bankSection.style.background = '#f8f9fa';
    bankSection.style.padding = '20px';
    bankSection.style.borderRadius = '10px';
    bankSection.style.border = '2px solid #dee2e6';
    
    const bankTitle = document.createElement('h3');
    bankTitle.textContent = '💰 Money Bank';
    bankTitle.style.color = '#667eea';
    bankTitle.style.marginBottom = '15px';
    bankTitle.style.fontSize = '1.2em';
    bankSection.appendChild(bankTitle);
    
    const bankInstructions = document.createElement('p');
    bankInstructions.textContent = 'Drag money from here →';
    bankInstructions.style.color = '#6c757d';
    bankInstructions.style.marginBottom = '10px';
    bankInstructions.style.fontWeight = 'bold';
    bankSection.appendChild(bankInstructions);
    
    const moneyContainer = document.createElement('div');
    moneyContainer.id = 'moneyBank';
    moneyContainer.style.display = 'flex';
    moneyContainer.style.flexWrap = 'wrap';
    moneyContainer.style.gap = '8px';
    moneyContainer.style.justifyContent = 'center';
    moneyContainer.style.maxHeight = '400px';
    moneyContainer.style.overflowY = 'auto';
    bankSection.appendChild(moneyContainer);
    
    // Add money items to bank
    const moneyTypes = [
        { value: 20, label: '$20', isBill: true, color: '#85bb65', image: 'twenty' },
        { value: 10, label: '$10', isBill: true, color: '#85bb65', image: 'ten' },
        { value: 5, label: '$5', isBill: true, color: '#85bb65', image: 'five' },
        { value: 1, label: '$1', isBill: true, color: '#85bb65', image: 'one' },
        { value: 0.25, label: '25¢', isBill: false, color: '#C0C0C0', image: 'quarter' },
        { value: 0.10, label: '10¢', isBill: false, color: '#C0C0C0', image: 'dime' },
        { value: 0.05, label: '5¢', isBill: false, color: '#CD7F32', image: 'nickel' },
        { value: 0.01, label: '1¢', isBill: false, color: '#CD7F32', image: 'penny' }
    ];
    
    moneyTypes.forEach(money => {
        for (let i = 0; i < 5; i++) {
            const moneyItem = document.createElement('div');
            moneyItem.className = 'money-item';
            moneyItem.draggable = true;
            moneyItem.dataset.value = money.value;
            
            if (money.isBill) {
                // Bill styling - smaller
                moneyItem.style.cssText = `
                    background: linear-gradient(135deg, #c7d9b7 0%, #85bb65 50%, #7ab05c 100%);
                    border: 2px solid #2d5016;
                    border-radius: 3px;
                    padding: 12px 18px;
                    font-weight: bold;
                    font-size: 1em;
                    cursor: grab;
                    user-select: none;
                    transition: transform 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    position: relative;
                    color: #2d5016;
                    text-align: center;
                    font-family: 'Times New Roman', serif;
                    min-width: 80px;
                `;
                moneyItem.innerHTML = `
                    <div style="font-size: 0.5em; margin-bottom: 1px;">USA</div>
                    <div style="font-size: 1.2em; font-weight: 900;">${money.label}</div>
                `;
            } else {
                // Coin styling - smaller
                const coinSize = money.value >= 0.25 ? '50px' : (money.value >= 0.05 ? '42px' : '36px');
                moneyItem.style.cssText = `
                    background: radial-gradient(circle at 30% 30%, ${money.color === '#C0C0C0' ? '#f0f0f0' : '#e8a87c'}, ${money.color});
                    border: 3px solid ${money.color === '#C0C0C0' ? '#999' : '#8B4513'};
                    border-radius: 50%;
                    width: ${coinSize};
                    height: ${coinSize};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${money.value >= 0.25 ? '0.9em' : '0.75em'};
                    cursor: grab;
                    user-select: none;
                    transition: transform 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3);
                    color: ${money.color === '#C0C0C0' ? '#333' : '#654321'};
                    font-family: Arial, sans-serif;
                    text-shadow: 0 1px 1px rgba(255,255,255,0.3);
                `;
                moneyItem.textContent = money.label;
            }
            
            moneyItem.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('value', money.value);
                e.dataTransfer.setData('isBill', money.isBill);
                e.dataTransfer.setData('label', money.label);
                e.dataTransfer.effectAllowed = 'copy';
                this.style.opacity = '0.5';
            });
            
            moneyItem.addEventListener('dragend', function() {
                this.style.opacity = '1';
            });
            
            moneyContainer.appendChild(moneyItem);
        }
    });
    
    layoutContainer.appendChild(bankSection);
    
    // Drop zone section (RIGHT SIDE)
    const dropSection = document.createElement('div');
    dropSection.style.background = 'white';
    dropSection.style.padding = '20px';
    dropSection.style.borderRadius = '10px';
    dropSection.style.border = '3px dashed #667eea';
    dropSection.style.display = 'flex';
    dropSection.style.flexDirection = 'column';
    
    const dropTitle = document.createElement('h3');
    dropTitle.textContent = '🎯 Drop Here';
    dropTitle.style.color = '#667eea';
    dropTitle.style.marginBottom = '10px';
    dropTitle.style.fontSize = '1.2em';
    dropSection.appendChild(dropTitle);
    
    const dropZone = document.createElement('div');
    dropZone.id = 'moneyDropZone';
    dropZone.style.display = 'flex';
    dropZone.style.flexWrap = 'wrap';
    dropZone.style.gap = '8px';
    dropZone.style.minHeight = '200px';
    dropZone.style.padding = '15px';
    dropZone.style.background = '#f0f4ff';
    dropZone.style.borderRadius = '8px';
    dropZone.style.flex = '1';
    dropSection.appendChild(dropZone);
    
    // Current total display
    const totalDisplay = document.createElement('div');
    totalDisplay.id = 'moneyTotal';
    totalDisplay.style.cssText = `
        font-size: 1.3em;
        font-weight: bold;
        color: #667eea;
        margin-top: 12px;
        padding: 12px;
        background: #e7f3ff;
        border-radius: 8px;
        text-align: center;
    `;
    totalDisplay.textContent = 'Your Total: $0.00';
    dropSection.appendChild(totalDisplay);
    
    // Check button
    const checkButton = document.createElement('button');
    checkButton.textContent = '✓ Check Answer';
    checkButton.className = 'btn btn-primary';
    checkButton.style.width = '100%';
    checkButton.style.marginTop = '12px';
    checkButton.style.fontSize = '1.1em';
    checkButton.style.padding = '12px';
    dropSection.appendChild(checkButton);
    
    // Feedback div
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'moneyFeedback';
    feedbackDiv.style.marginTop = '12px';
    feedbackDiv.style.padding = '12px';
    feedbackDiv.style.borderRadius = '8px';
    feedbackDiv.style.fontSize = '1.1em';
    feedbackDiv.style.fontWeight = 'bold';
    feedbackDiv.style.textAlign = 'center';
    feedbackDiv.style.display = 'none';
    dropSection.appendChild(feedbackDiv);
    
    layoutContainer.appendChild(dropSection);
    questionDiv.appendChild(layoutContainer);
    container.appendChild(questionDiv);
    
    // Set up drop zone
    let currentTotal = 0;
    const droppedMoney = [];
    
    function updateTotal() {
        currentTotal = droppedMoney.reduce((sum, val) => sum + val, 0);
        totalDisplay.textContent = `Your Total: $${currentTotal.toFixed(2)}`;
    }
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.style.background = '#d4e9ff';
    });
    
    dropZone.addEventListener('dragleave', function() {
        this.style.background = '#f0f4ff';
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = '#f0f4ff';
        
        const value = parseFloat(e.dataTransfer.getData('value'));
        const isBill = e.dataTransfer.getData('isBill') === 'true';
        const label = e.dataTransfer.getData('label');
        droppedMoney.push(value);
        
        // Create dropped money visual
        const droppedItem = document.createElement('div');
        
        if (isBill) {
            // Bill styling - smaller
            droppedItem.style.cssText = `
                background: linear-gradient(135deg, #c7d9b7 0%, #85bb65 50%, #7ab05c 100%);
                border: 2px solid #2d5016;
                border-radius: 3px;
                padding: 10px 16px;
                font-weight: bold;
                font-size: 1em;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                color: #2d5016;
                text-align: center;
                font-family: 'Times New Roman', serif;
                min-width: 70px;
                transition: transform 0.2s;
            `;
            droppedItem.innerHTML = `
                <div style="font-size: 0.5em;">USA</div>
                <div style="font-size: 1.1em; font-weight: 900;">${label}</div>
            `;
        } else {
            // Coin styling - smaller
            const color = value >= 0.10 ? '#C0C0C0' : '#CD7F32';
            const coinSize = value >= 0.25 ? '45px' : (value >= 0.05 ? '38px' : '32px');
            droppedItem.style.cssText = `
                background: radial-gradient(circle at 30% 30%, ${color === '#C0C0C0' ? '#f0f0f0' : '#e8a87c'}, ${color});
                border: 2px solid ${color === '#C0C0C0' ? '#999' : '#8B4513'};
                border-radius: 50%;
                width: ${coinSize};
                height: ${coinSize};
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: ${value >= 0.25 ? '0.85em' : '0.7em'};
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3);
                color: ${color === '#C0C0C0' ? '#333' : '#654321'};
                transition: transform 0.2s;
            `;
            droppedItem.textContent = label;
        }
        
        droppedItem.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        droppedItem.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Click to remove
        droppedItem.addEventListener('click', function() {
            const index = droppedMoney.indexOf(value);
            if (index > -1) {
                droppedMoney.splice(index, 1);
            }
            this.remove();
            updateTotal();
            feedbackDiv.style.display = 'none';
        });
        
        dropZone.appendChild(droppedItem);
        updateTotal();
    });
    
    // Check answer
    checkButton.addEventListener('click', function() {
        const isCorrect = Math.abs(currentTotal - question.targetAmount) < 0.01;
        
        feedbackDiv.style.display = 'block';
        
        if (isCorrect) {
            feedbackDiv.textContent = '✅ Correct! You made exactly the right amount!';
            feedbackDiv.style.background = '#d4edda';
            feedbackDiv.style.color = '#155724';
            answers[currentQuestionIndex] = {
                amount: currentTotal,
                correct: true,
                money: droppedMoney
            };
        } else {
            const difference = Math.abs(currentTotal - question.targetAmount);
            if (currentTotal < question.targetAmount) {
                feedbackDiv.textContent = `❌ Not quite. You need $${difference.toFixed(2)} more!`;
            } else {
                feedbackDiv.textContent = `❌ Not quite. You have $${difference.toFixed(2)} too much!`;
            }
            feedbackDiv.style.background = '#fff3cd';
            feedbackDiv.style.color = '#856404';
            answers[currentQuestionIndex] = {
                amount: currentTotal,
                correct: false,
                money: droppedMoney
            };
        }
    });
    
    // Load saved answer if exists
    if (answers[currentQuestionIndex] && answers[currentQuestionIndex].money) {
        const saved = answers[currentQuestionIndex];
        saved.money.forEach(value => {
            droppedMoney.push(value);
            const droppedItem = document.createElement('div');
            const isBill = value >= 1;
            const label = value >= 1 ? `$${value}` : `${(value * 100).toFixed(0)}¢`;
            
            if (isBill) {
                droppedItem.style.cssText = `
                    background: linear-gradient(135deg, #c7d9b7 0%, #85bb65 50%, #7ab05c 100%);
                    border: 2px solid #2d5016;
                    border-radius: 3px;
                    padding: 10px 16px;
                    font-weight: bold;
                    font-size: 1em;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    color: #2d5016;
                    text-align: center;
                    font-family: 'Times New Roman', serif;
                    min-width: 70px;
                `;
                droppedItem.innerHTML = `
                    <div style="font-size: 0.5em;">USA</div>
                    <div style="font-size: 1.1em; font-weight: 900;">${label}</div>
                `;
            } else {
                const color = value >= 0.10 ? '#C0C0C0' : '#CD7F32';
                const coinSize = value >= 0.25 ? '45px' : (value >= 0.05 ? '38px' : '32px');
                droppedItem.style.cssText = `
                    background: radial-gradient(circle at 30% 30%, ${color === '#C0C0C0' ? '#f0f0f0' : '#e8a87c'}, ${color});
                    border: 2px solid ${color === '#C0C0C0' ? '#999' : '#8B4513'};
                    border-radius: 50%;
                    width: ${coinSize};
                    height: ${coinSize};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${value >= 0.25 ? '0.85em' : '0.7em'};
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3);
                    color: ${color === '#C0C0C0' ? '#333' : '#654321'};
                `;
                droppedItem.textContent = label;
            }
            
            droppedItem.addEventListener('click', function() {
                const index = droppedMoney.indexOf(value);
                if (index > -1) {
                    droppedMoney.splice(index, 1);
                }
                this.remove();
                updateTotal();
                feedbackDiv.style.display = 'none';
            });
            dropZone.appendChild(droppedItem);
        });
        updateTotal();
    }
    
    addNavigationButtons(container);
}

function goToCategories() {
    document.getElementById('categorySelection').style.display = 'block';
    document.getElementById('studentInfoSection').style.display = 'block';
    document.getElementById('assignmentSelection').classList.add('hidden');
    document.getElementById('assignmentContent').innerHTML = '';
    currentCategory = null;
    currentAssignment = null;
    currentQuestionIndex = 0;
    answers = {};
    window.scrollTo(0, 0);
}
