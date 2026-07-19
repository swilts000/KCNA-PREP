// ============================================
// DYNAMIC LEARNING APP - KCNA Exam Prep
// ============================================

let currentChapter = null;
let currentLab = null;
let chapters = [];
let currentChapterFile = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadChapterList();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.querySelector('.chapter-menu');
        if (menu && !menu.contains(e.target)) {
            closeChapterMenu();
        }
    });
});

// Toggle chapter menu
function toggleChapterMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const dropdown = document.getElementById('chapter-dropdown');
    
    hamburger.classList.toggle('active');
    dropdown.classList.toggle('active');
}

function closeChapterMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const dropdown = document.getElementById('chapter-dropdown');
    
    hamburger.classList.remove('active');
    dropdown.classList.remove('active');
}

// Load available chapters
async function loadChapterList() {
    try {
        const response = await fetch('chapters/index.json');
        chapters = await response.json();
        
        renderChapterList();

        // Load first chapter by default
        if (chapters.length > 0) {
            loadChapter(chapters[0].file);
        }
    } catch (error) {
        console.error('Error loading chapter list:', error);
        // Fallback: try to load chapter1.json directly
        loadChapter('chapter1.json');
    }
}

// Render chapter list in dropdown
function renderChapterList() {
    const list = document.getElementById('chapter-list');
    list.innerHTML = '';
    
    chapters.forEach(ch => {
        const btn = document.createElement('button');
        btn.className = 'chapter-item' + (ch.file === currentChapterFile ? ' active' : '');
        btn.textContent = ch.title;
        btn.onclick = () => {
            loadChapter(ch.file);
            closeChapterMenu();
        };
        list.appendChild(btn);
    });
}

// Load a specific chapter
async function loadChapter(filename) {
    try {
        const response = await fetch(`chapters/${filename}`);
        currentChapter = await response.json();
        currentChapterFile = filename;
        renderChapter();
        renderChapterList(); // Update active state
    } catch (error) {
        console.error('Error loading chapter:', error);
    }
}

// Render the entire chapter
function renderChapter() {
    if (!currentChapter) return;

    // Set theme colors
    const root = document.documentElement;
    root.style.setProperty('--theme-color', currentChapter.themeColor || '#326ce5');
    root.style.setProperty('--theme-color-dark', currentChapter.themeColorDark || '#2857b8');

    // Set header
    document.getElementById('chapter-title').textContent = currentChapter.title;
    document.getElementById('chapter-subtitle').textContent = currentChapter.subtitle || '';

    // Render navigation
    renderNavigation();

    // Render lessons
    renderLessons();

    // Render summary
    renderSummary();

    // Show first lesson
    showLesson(0);
}

// Render navigation buttons
function renderNavigation() {
    const nav = document.getElementById('lesson-nav');
    nav.innerHTML = '';

    currentChapter.lessons.forEach((lesson, index) => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn' + (index === 0 ? ' active' : '');
        btn.textContent = lesson.navTitle || lesson.title;
        btn.onclick = () => showLesson(index);
        nav.appendChild(btn);
    });
}

// Render all lessons
function renderLessons() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    currentChapter.lessons.forEach((lesson, index) => {
        const section = document.createElement('section');
        section.className = 'lesson' + (index !== 0 ? ' hidden' : '');
        section.id = `lesson-${index}`;
        section.innerHTML = `<h2>${lesson.title}</h2>`;

        // Render cards
        lesson.cards.forEach(card => {
            section.appendChild(renderCard(card));
        });

        // Render lab button if exists
        if (lesson.lab) {
            const labBtn = document.createElement('button');
            labBtn.className = 'lab-btn';
            labBtn.textContent = `🧪 Launch Lab: ${lesson.lab.title}`;
            labBtn.onclick = () => openLab(lesson.lab);
            section.appendChild(labBtn);
        }

        contentArea.appendChild(section);
    });
}

// Render a single card
function renderCard(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'lesson-card';

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `<h3>${card.title}</h3><span class="toggle-icon">▼</span>`;
    header.onclick = () => toggleSection(header);

    const content = document.createElement('div');
    content.className = 'card-content';
    content.innerHTML = renderContent(card.content);

    cardEl.appendChild(header);
    cardEl.appendChild(content);

    return cardEl;
}

// Render content blocks
function renderContent(contentArray) {
    if (!contentArray) return '';
    
    return contentArray.map(block => {
        switch (block.type) {
            case 'text':
                return `<p>${block.value}</p>`;
            
            case 'highlight':
                return `<p class="highlight-text">${block.value}</p>`;
            
            case 'quote':
                return `<blockquote>${block.value}</blockquote>`;
            
            case 'list':
                return `<ul>${block.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
            
            case 'keypoint':
                return `<div class="key-point"><span class="badge">${block.badge || 'Key Point'}</span><p>${block.value}</p></div>`;
            
            case 'concept':
                return `<div class="concept-box"><h4>${block.title}</h4><p>${block.value}</p></div>`;
            
            case 'example':
                return `<div class="example-box"><h4>${block.title || 'Example'}</h4><p>${block.value}</p></div>`;
            
            case 'grid':
                const gridClass = `grid-${block.columns || 2}`;
                return `<div class="${gridClass}">${block.items.map(item => `
                    <div class="grid-item">
                        ${item.icon ? `<div class="icon">${item.icon}</div>` : ''}
                        ${item.title ? `<h5>${item.title}</h5>` : ''}
                        ${item.text ? `<p>${item.text}</p>` : ''}
                    </div>
                `).join('')}</div>`;
            
            case 'tags':
                return `<div class="tags">${block.items.map(tag => 
                    `<span class="tag${tag.primary ? ' primary' : ''}">${tag.text || tag}</span>`
                ).join('')}</div>`;
            
            case 'stats':
                return `<div class="stats-row">${block.items.map(stat => `
                    <div class="stat">
                        <span class="stat-number">${stat.value}</span>
                        <span class="stat-label">${stat.label}</span>
                    </div>
                `).join('')}</div>`;
            
            case 'comparison':
                return `<div class="comparison">
                    <div class="comparison-side pros">
                        <h5>${block.leftTitle || 'Pros'}</h5>
                        <ul>${block.left.map(item => `<li>✅ ${item}</li>`).join('')}</ul>
                    </div>
                    <div class="comparison-side cons">
                        <h5>${block.rightTitle || 'Cons'}</h5>
                        <ul>${block.right.map(item => `<li>❌ ${item}</li>`).join('')}</ul>
                    </div>
                </div>`;
            
            case 'nested':
                return `
                    <div class="card-header nested" onclick="toggleSection(this)">
                        <h4>${block.title}</h4>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="card-content nested">${renderContent(block.content)}</div>
                `;
            
            default:
                return '';
        }
    }).join('');
}

// Render summary section
function renderSummary() {
    const grid = document.getElementById('summary-grid');
    if (!currentChapter.summary) {
        document.getElementById('summary-section').style.display = 'none';
        return;
    }

    document.getElementById('summary-section').style.display = 'block';
    grid.innerHTML = currentChapter.summary.map(item => `
        <div class="summary-item">
            <span class="summary-icon">${item.icon}</span>
            <strong>${item.title}</strong>
            <p>${item.text}</p>
        </div>
    `).join('');
}

// Show specific lesson
function showLesson(index) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Show/hide lessons
    document.querySelectorAll('.lesson').forEach((lesson, i) => {
        lesson.classList.toggle('hidden', i !== index);
    });

    // Scroll to top
    window.scrollTo({ top: 200, behavior: 'smooth' });
}

// Toggle section visibility
function toggleSection(header) {
    const content = header.nextElementSibling;
    if (content && content.classList.contains('card-content')) {
        content.classList.toggle('hidden');
        header.classList.toggle('collapsed');
    }
}

// ============================================
// LAB FUNCTIONS
// ============================================

function openLab(lab) {
    currentLab = lab;
    document.getElementById('lab-overlay').classList.remove('hidden');
    document.getElementById('lab-panel').classList.remove('hidden');
    document.getElementById('lab-title').textContent = `🧪 Lab: ${lab.title}`;
    document.body.style.overflow = 'hidden';

    renderLab(lab);
}

function closeLab() {
    document.getElementById('lab-overlay').classList.add('hidden');
    document.getElementById('lab-panel').classList.add('hidden');
    document.body.style.overflow = '';
    currentLab = null;
}

function renderLab(lab) {
    const content = document.getElementById('lab-content');
    
    if (lab.type === 'quiz') {
        content.innerHTML = renderQuizLab(lab);
    } else if (lab.type === 'dragdrop') {
        content.innerHTML = renderDragDropLab(lab);
    }

    content.innerHTML += `
        <button class="check-btn" onclick="checkLab()">Check Answers</button>
        <div class="lab-result" id="lab-result"></div>
    `;
}

function renderQuizLab(lab) {
    return `<div class="quiz-lab">${lab.questions.map((q, i) => `
        <div class="quiz-question" data-answer="${q.answer}">
            <p>${i + 1}. ${q.question}</p>
            <div class="quiz-options${q.multi ? ' multi' : ''}">
                ${q.options.map((opt, j) => `
                    <label>
                        <input type="${q.multi ? 'checkbox' : 'radio'}" name="q${i}" value="${opt.value || j}">
                        ${opt.text || opt}
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('')}</div>`;
}

function renderDragDropLab(lab) {
    return `
        <p>${lab.instructions}</p>
        <div class="drag-drop-area">
            <div class="drop-zones">
                ${lab.zones.map(zone => `
                    <div class="drop-zone" id="zone-${zone.id}" data-zone="${zone.id}" 
                         ondrop="drop(event)" ondragover="allowDrop(event)">
                        <h4>${zone.title}</h4>
                    </div>
                `).join('')}
            </div>
            <div class="drag-items" id="drag-items">
                ${lab.items.map((item, i) => `
                    <div class="drag-item" draggable="true" ondragstart="drag(event)" 
                         id="item-${i}" data-answer="${item.zone}">${item.text}</div>
                `).join('')}
            </div>
        </div>
    `;
}

// Drag and drop handlers
function allowDrop(ev) {
    ev.preventDefault();
    ev.target.closest('.drop-zone').style.borderColor = 'var(--theme-color, #326ce5)';
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const dropZone = ev.target.closest('.drop-zone');
    dropZone.style.borderColor = '';
    
    const itemId = ev.dataTransfer.getData("text");
    const item = document.getElementById(itemId);
    if (item) {
        dropZone.appendChild(item);
    }
}

// Check lab answers
function checkLab() {
    if (!currentLab) return;

    let correct = 0;
    let total = 0;

    if (currentLab.type === 'quiz') {
        currentLab.questions.forEach((q, i) => {
            total++;
            if (q.multi) {
                const selected = Array.from(document.querySelectorAll(`input[name="q${i}"]:checked`))
                    .map(input => input.value).sort();
                const answer = (Array.isArray(q.answer) ? q.answer : [q.answer]).sort();
                if (arraysEqual(selected, answer)) correct++;
            } else {
                const selected = document.querySelector(`input[name="q${i}"]:checked`);
                if (selected && selected.value == q.answer) correct++;
            }
        });
    } else if (currentLab.type === 'dragdrop') {
        currentLab.items.forEach((item, i) => {
            total++;
            const el = document.getElementById(`item-${i}`);
            const zone = el.closest('.drop-zone');
            if (zone && zone.dataset.zone === item.zone) {
                el.classList.add('correct');
                el.classList.remove('incorrect');
                correct++;
            } else if (zone) {
                el.classList.add('incorrect');
                el.classList.remove('correct');
            }
        });
    }

    showResult(correct, total);
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function showResult(correct, total) {
    const result = document.getElementById('lab-result');
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

// Close lab on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentLab) {
        closeLab();
    }
});
