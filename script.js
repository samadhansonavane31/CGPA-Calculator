document.addEventListener('DOMContentLoaded', () => {
    const subjectsContainer = document.getElementById('subjects-container');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const calculatorForm = document.getElementById('calculator-form');
    
    const modal = document.getElementById('result-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggleBtn.innerHTML = currentTheme === 'dark' ? sunIcon : moonIcon;

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleBtn.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
    });
    
    // Using a standard 10-point scale
    const gradeScale = {
        'O': 10,  // Outstanding
        'A+': 9,  // Excellent
        'A': 8,   // Very Good
        'B+': 7,  // Good
        'B': 6,   // Above Average
        'C': 5,   // Average
        'P': 4,   // Pass
        'F': 0    // Fail
    };

    let subjectCount = 0;

    // Add initial rows
    addSubjectRow();
    addSubjectRow();

    addSubjectBtn.addEventListener('click', addSubjectRow);
    
    calculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateGPA();
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });

    function addSubjectRow() {
        subjectCount++;
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.id = `subject-${subjectCount}`;
        
        row.innerHTML = `
            <div class="input-group">
                <input type="text" class="subj-name" placeholder="Subject Name (e.g. Mathematics)" required>
            </div>
            <div class="input-group">
                <input type="number" class="subj-cred" placeholder="Credits (e.g. 3)" min="1" step="0.5" required>
            </div>
            <div class="input-group">
                <select class="subj-grade" required>
                    <option value="" disabled selected>Grade</option>
                    <option value="O">O (10)</option>
                    <option value="A+">A+ (9)</option>
                    <option value="A">A (8)</option>
                    <option value="B+">B+ (7)</option>
                    <option value="B">B (6)</option>
                    <option value="C">C (5)</option>
                    <option value="P">P (4)</option>
                    <option value="F">F (0)</option>
                </select>
            </div>
            <button type="button" class="btn-icon delete-btn" onclick="removeSubjectRow('${row.id}')">
                X
            </button>
        `;
        
        subjectsContainer.appendChild(row);
    }

    window.removeSubjectRow = function(id) {
        if (document.querySelectorAll('.subject-row').length > 1) {
            const row = document.getElementById(id);
            row.remove();
        } else {
            alert('You need at least one subject.');
        }
    };

    function calculateGPA() {
        const rows = document.querySelectorAll('.subject-row');
        let totalCredits = 0;
        let totalPoints = 0;
        let valid = true;

        rows.forEach(row => {
            const creditInput = row.querySelector('.subj-cred');
            const gradeSelect = row.querySelector('.subj-grade');
            
            const credit = parseFloat(creditInput.value);
            const grade = gradeSelect.value;
            
            if (!isNaN(credit) && gradeScale.hasOwnProperty(grade)) {
                totalCredits += credit;
                totalPoints += (credit * gradeScale[grade]);
            } else {
                valid = false;
            }
        });

        if (!valid || totalCredits === 0) {
            alert('Please fill all fields correctly.');
            return;
        }

        const gpa = totalPoints / totalCredits;
        displayResults(gpa, totalCredits, totalPoints);
    }

    function displayResults(gpa, credits, points) {
        const uni = document.getElementById('university').value;
        const year = document.getElementById('year').value;
        const course = document.getElementById('course').value;
        
        document.getElementById('result-student-info').textContent = 
            `${uni} | ${course} | ${year}`;

        document.getElementById('total-credits').textContent = credits.toString();
        document.getElementById('total-points').textContent = points.toFixed(1);
        
        const gpaFormatted = gpa.toFixed(2);
        document.getElementById('final-gpa').textContent = gpaFormatted;
        
        // Setup circle animation
        const scorePath = document.getElementById('score-path');
        const percentage = (gpa / 10) * 100;
        
        let strokeColor = '#f85149';
        if (gpa >= 8) strokeColor = '#2ea043';
        else if (gpa >= 6) strokeColor = '#58a6ff';
        else if (gpa >= 4) strokeColor = '#d29922';
        
        scorePath.style.stroke = strokeColor;
        
        modal.classList.add('visible');
        scorePath.setAttribute('stroke-dasharray', `0, 100`);
        
        setTimeout(() => {
            scorePath.setAttribute('stroke-dasharray', `${percentage}, 100`);
        }, 100);
    }
});
