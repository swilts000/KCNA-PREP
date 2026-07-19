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
    // Reset drag items
    const itemsContainer = document.getElementById(`${labId}-items`);
    if (itemsContainer) {
        const items = document.querySelectorAll(`#${labId} .drag-item`);
        items.forEach(item => {
            item.classList.remove('correct', 'incorrect');
            itemsContainer.appendChild(item);
        });
    }

    // Reset quiz options
    const radios = document.querySelectorAll(`#${labId} input[type="radio"]`);
    radios.forEach(radio => radio.checked = false);

    // Reset result
    const result = document.getElementById(`${labId}-result`);
    if (result) {
        result.textContent = '';
        result.className = 'lab-result';
    }
}

// Drag and Drop Functions
function allowDrop(ev) {
    ev.preventDefault();
    ev.target.closest('.drop-zone').style.borderColor = '#326ce5';
    ev.target.closest('.drop-zone').style.background = 'rgba(50, 108, 229, 0.1)';
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id || ev.target.textContent);
    ev.dataTransfer.setData("element", ev.target.outerHTML);
    ev.target.dataset.dragging = 'true';
}

function drop(ev) {
    ev.preventDefault();
    const dropZone = ev.target.closest('.drop-zone');
    dropZone.style.borderColor = '';
    dropZone.style.background = '';

    const draggedText = ev.dataTransfer.getData("text");
    const draggedElement = document.querySelector(`[data-dragging="true"]`);

    if (draggedElement) {
        draggedElement.removeAttribute('data-dragging');
        dropZone.appendChild(draggedElement);
    }
}

// Lab 1: Physical vs Virtual
function checkLab1() {
    const physicalZone = document.getElementById('physical-zone');
    const virtualZone = document.getElementById('virtual-zone');
    let correct = 0;
    let total = 6;

    // Check physical zone items
    physicalZone.querySelectorAll('.drag-item').forEach(item => {
        if (item.dataset.answer === 'physical') {
            item.classList.add('correct');
            item.classList.remove('incorrect');
            correct++;
        } else {
            item.classList.add('incorrect');
            item.classList.remove('correct');
        }
    });

    // Check virtual zone items
    virtualZone.querySelectorAll('.drag-item').forEach(item => {
        if (item.dataset.answer === 'virtual') {
            item.classList.add('correct');
            item.classList.remove('incorrect');
            correct++;
        } else {
            item.classList.add('incorrect');
            item.classList.remove('correct');
        }
    });

    showResult('lab1-result', correct, total);
}

// Lab 2: Service Model Quiz
function checkLab2() {
    const answers = {
        q1: 'iaas',
        q2: 'paas',
        q3: 'saas',
        q4: 'faas'
    };

    let correct = 0;
    let total = 4;

    for (let q in answers) {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === answers[q]) {
            correct++;
        }
    }

    showResult('lab2-result', correct, total);
}

// Lab 3: VM vs Container
function checkLab3() {
    const vmZone = document.getElementById('vm-zone');
    const containerZone = document.getElementById('container-zone');
    let correct = 0;
    let total = 6;

    // Check VM zone items
    vmZone.querySelectorAll('.drag-item').forEach(item => {
        if (item.dataset.answer === 'vm') {
            item.classList.add('correct');
            item.classList.remove('incorrect');
            correct++;
        } else {
            item.classList.add('incorrect');
            item.classList.remove('correct');
        }
    });

    // Check container zone items
    containerZone.querySelectorAll('.drag-item').forEach(item => {
        if (item.dataset.answer === 'container') {
            item.classList.add('correct');
            item.classList.remove('incorrect');
            correct++;
        } else {
            item.classList.add('incorrect');
            item.classList.remove('correct');
        }
    });

    showResult('lab3-result', correct, total);
}

// Lab 4: Architecture Quiz
function checkLab4() {
    const answers = {
        arch1: 'monolith',
        arch2: 'micro',
        arch3: 'micro',
        arch4: 'micro'
    };

    let correct = 0;
    let total = 4;

    for (let q in answers) {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === answers[q]) {
            correct++;
        }
    }

    showResult('lab4-result', correct, total);
}

// Lab 5: Kubernetes Features Quiz
function checkLab5() {
    const answers = {
        k8s1: 'healing',
        k8s2: 'scaling',
        k8s3: 'rolling',
        k8s4: 'state'
    };

    let correct = 0;
    let total = 4;

    for (let q in answers) {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === answers[q]) {
            correct++;
        }
    }

    showResult('lab5-result', correct, total);
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

// Initialize - expand first card in each lesson
document.addEventListener('DOMContentLoaded', () => {
    // All cards start expanded by default
    console.log('Chapter 1 Learning App loaded!');
});
