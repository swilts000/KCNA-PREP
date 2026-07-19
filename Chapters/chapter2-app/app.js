// Lesson Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show corresponding lesson
        const lessonNum = btn.dataset.lesson;
        document.querySelectorAll('.lesson').forEach(lesson => {
            lesson.classList.add('hidden');
        });
        document.getElementById(`lesson-${lessonNum}`).classList.remove('hidden');

        // Scroll to top of content
        window.scrollTo({ top: 200, behavior: 'smooth' });
    });
});

// Toggle Section (Hide/Reveal)
function toggleSection(header) {
    const content = header.nextElementSibling;
    if (content && content.classList.contains('card-content')) {
        content.classList.toggle('hidden');
        header.classList.toggle('collapsed');
    }
}

// Lab Functions
let currentLab = null;

function openLab(labId) {
    currentLab = labId;
    document.getElementById('lab-overlay').classList.remove('hidden');
    document.getElementById(labId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Reset lab state
    resetLab(labId);
}

function closeLab() {
    document.getElementById('lab-overlay').classList.add('hidden');
    if (currentLab) {
        document.getElementById(currentLab).classList.add('hidden');
    }
    document.body.style.overflow = '';
    currentLab = null;
}

function resetLab(labId) {
    // Reset all inputs
    const inputs = document.querySelectorAll(`#${labId} input`);
    inputs.forEach(input => input.checked = false);

    // Reset result
    const result = document.getElementById(`${labId}-result`);
    if (result) {
        result.textContent = '';
        result.className = 'lab-result';
    }
}

// Lab 1: OSS & OCI Quiz
function checkLab1() {
    let correct = 0;
    let total = 4;

    // Q1: What does OSS stand for?
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1 && q1.value === 'b') correct++;

    // Q2: When was OCI founded?
    const q2 = document.querySelector('input[name="q2"]:checked');
    if (q2 && q2.value === 'b') correct++;

    // Q3: OCI specifications (multi-select)
    const q3Correct = ['image', 'runtime', 'distribution'];
    const q3Selected = Array.from(document.querySelectorAll('input[name="q3"]:checked')).map(i => i.value);
    if (arraysEqual(q3Selected.sort(), q3Correct.sort())) correct++;

    // Q4: Benefit of open standards
    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4 && q4.value === 'b') correct++;

    showResult('lab1-result', correct, total);
}

// Lab 2: CNCF History Quiz
function checkLab2() {
    let correct = 0;
    let total = 4;

    // Q1: Linux Foundation founded
    const lf1 = document.querySelector('input[name="lf1"]:checked');
    if (lf1 && lf1.value === 'b') correct++;

    // Q2: CNCF founded
    const lf2 = document.querySelector('input[name="lf2"]:checked');
    if (lf2 && lf2.value === 'b') correct++;

    // Q3: First CNCF project
    const lf3 = document.querySelector('input[name="lf3"]:checked');
    if (lf3 && lf3.value === 'b') correct++;

    // Q4: What CNCF supports (multi-select)
    const lf4Correct = ['containers', 'microservices', 'meshes', 'declarative'];
    const lf4Selected = Array.from(document.querySelectorAll('input[name="lf4"]:checked')).map(i => i.value);
    if (arraysEqual(lf4Selected.sort(), lf4Correct.sort())) correct++;

    showResult('lab2-result', correct, total);
}

// Lab 3: Maturity & Governance Quiz
function checkLab3() {
    let correct = 0;
    let total = 4;

    // Q1: Maturity levels (multi-select)
    const m1Correct = ['sandbox', 'incubating', 'graduated'];
    const m1Selected = Array.from(document.querySelectorAll('input[name="m1"]:checked')).map(i => i.value);
    if (arraysEqual(m1Selected.sort(), m1Correct.sort())) correct++;

    // Q2: Who decides maturity
    const m2 = document.querySelector('input[name="m2"]:checked');
    if (m2 && m2.value === 'b') correct++;

    // Q3: Graduation requirements (multi-select)
    const m3Correct = ['multiorg', 'audit', 'cii'];
    const m3Selected = Array.from(document.querySelectorAll('input[name="m3"]:checked')).map(i => i.value);
    if (arraysEqual(m3Selected.sort(), m3Correct.sort())) correct++;

    // Q4: When did K8s graduate
    const m4 = document.querySelector('input[name="m4"]:checked');
    if (m4 && m4.value === 'b') correct++;

    showResult('lab3-result', correct, total);
}

// Lab 4: Match the Role
function checkLab4() {
    let correct = 0;
    let total = 5;

    // Q1: Cloud Architect
    const r1 = document.querySelector('input[name="r1"]:checked');
    if (r1 && r1.value === 'b') correct++;

    // Q2: SRE
    const r2 = document.querySelector('input[name="r2"]:checked');
    if (r2 && r2.value === 'c') correct++;

    // Q3: DevOps vs DevSecOps
    const r3 = document.querySelector('input[name="r3"]:checked');
    if (r3 && r3.value === 'a') correct++;

    // Q4: FinOps
    const r4 = document.querySelector('input[name="r4"]:checked');
    if (r4 && r4.value === 'b') correct++;

    // Q5: DevOps culture (multi-select)
    const r5Correct = ['shared', 'learning', 'collab'];
    const r5Selected = Array.from(document.querySelectorAll('input[name="r5"]:checked')).map(i => i.value);
    if (arraysEqual(r5Selected.sort(), r5Correct.sort())) correct++;

    showResult('lab4-result', correct, total);
}

// Lab 5: Certification Path Quiz
function checkLab5() {
    let correct = 0;
    let total = 5;

    // Q1: Entry-level cert
    const c1 = document.querySelector('input[name="c1"]:checked');
    if (c1 && c1.value === 'b') correct++;

    // Q2: Requires CKA
    const c2 = document.querySelector('input[name="c2"]:checked');
    if (c2 && c2.value === 'c') correct++;

    // Q3: Passing score
    const c3 = document.querySelector('input[name="c3"]:checked');
    if (c3 && c3.value === 'b') correct++;

    // Q4: Number of questions
    const c4 = document.querySelector('input[name="c4"]:checked');
    if (c4 && c4.value === 'b') correct++;

    // Q5: Largest domain
    const c5 = document.querySelector('input[name="c5"]:checked');
    if (c5 && c5.value === 'b') correct++;

    showResult('lab5-result', correct, total);
}

// Helper: Compare arrays
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// Show Result
function showResult(elementId, correct, total) {
    const result = document.getElementById(elementId);
    const percentage = (correct / total) * 100;

    if (percentage === 100) {
        result.textContent = `🎉 Perfect! ${correct}/${total} correct!`;
        result.className = 'lab-result success';
    } else if (percentage >= 50) {
        result.textContent = `👍 Good job! ${correct}/${total} correct. Keep practicing!`;
        result.className = 'lab-result partial';
    } else {
        result.textContent = `📚 ${correct}/${total} correct. Review the lesson and try again!`;
        result.className = 'lab-result error';
    }
}

// Close lab on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentLab) {
        closeLab();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Chapter 2 Learning App loaded!');
});
