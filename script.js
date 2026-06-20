/* ============================================
   AI Resume Builder - JavaScript
   ============================================ */

// DOM Elements
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const locationInput = document.getElementById('location');
const headlineInput = document.getElementById('headline');
const summaryInput = document.getElementById('summary');
const skillInput = document.getElementById('skillInput');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillsList = document.getElementById('skillsList');
const themeBtn = document.getElementById('themeBtn');
const sampleDataBtn = document.getElementById('sampleDataBtn');
const downloadBtn = document.getElementById('downloadBtn');
const addExperienceBtn = document.getElementById('addExperienceBtn');
const addEducationBtn = document.getElementById('addEducationBtn');
const addProjectBtn = document.getElementById('addProjectBtn');
const toast = document.getElementById('toast');

// Data Structure
let resumeData = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: []
};

// ============================================
// Initialize App
// ============================================

function init() {
    loadFromLocalStorage();
    setupEventListeners();
    initParticles();
    updatePreview();
    applyTheme(localStorage.getItem('theme') || 'light');
}

// ============================================
// Local Storage
// ============================================

function saveToLocalStorage() {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        resumeData = JSON.parse(saved);
        populateFormFromData();
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Personal Info Inputs
    fullNameInput.addEventListener('input', (e) => {
        resumeData.fullName = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    emailInput.addEventListener('input', (e) => {
        resumeData.email = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    phoneInput.addEventListener('input', (e) => {
        resumeData.phone = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    locationInput.addEventListener('input', (e) => {
        resumeData.location = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    headlineInput.addEventListener('input', (e) => {
        resumeData.headline = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    summaryInput.addEventListener('input', (e) => {
        resumeData.summary = e.target.value;
        saveToLocalStorage();
        updatePreview();
    });

    // Skills
    addSkillBtn.addEventListener('click', addSkill);
    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });

    // Experience, Education, Projects
    addExperienceBtn.addEventListener('click', addExperience);
    addEducationBtn.addEventListener('click', addEducation);
    addProjectBtn.addEventListener('click', addProject);

    // Theme Toggle
    themeBtn.addEventListener('click', toggleTheme);

    // Sample Data
    sampleDataBtn.addEventListener('click', loadSampleData);

    // Download PDF
    downloadBtn.addEventListener('click', downloadPDF);
}

// ============================================
// Skills Management
// ============================================

function addSkill() {
    const skill = skillInput.value.trim();
    if (skill === '') {
        showToast('Please enter a skill');
        return;
    }

    if (resumeData.skills.includes(skill)) {
        showToast('Skill already added');
        return;
    }

    resumeData.skills.push(skill);
    skillInput.value = '';
    saveToLocalStorage();
    renderSkills();
    updatePreview();
}

function removeSkill(index) {
    resumeData.skills.splice(index, 1);
    saveToLocalStorage();
    renderSkills();
    updatePreview();
}

function renderSkills() {
    skillsList.innerHTML = resumeData.skills
        .map((skill, index) => `
            <div class="skill-tag">
                ${skill}
                <button type="button" onclick="removeSkill(${index})">✕</button>
            </div>
        `)
        .join('');
}

// ============================================
// Experience Management
// ============================================

function addExperience() {
    const experience = {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    };

    resumeData.experience.push(experience);
    saveToLocalStorage();
    renderExperience();
    updatePreview();
}

function removeExperience(id) {
    resumeData.experience = resumeData.experience.filter(e => e.id !== id);
    saveToLocalStorage();
    renderExperience();
    updatePreview();
}

function updateExperience(id, field, value) {
    const exp = resumeData.experience.find(e => e.id === id);
    if (exp) {
        exp[field] = value;
        saveToLocalStorage();
        updatePreview();
    }
}

function renderExperience() {
    const container = document.getElementById('experienceList');
    container.innerHTML = resumeData.experience
        .map(exp => `
            <div class="item-container">
                <div class="item-header">
                    <span style="font-weight: 600;">${exp.position || 'New Experience'}</span>
                    <button type="button" onclick="removeExperience(${exp.id})">✕</button>
                </div>
                <div class="item-grid">
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Company" 
                        value="${exp.company}"
                        onchange="updateExperience(${exp.id}, 'company', this.value)"
                    >
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Position" 
                        value="${exp.position}"
                        onchange="updateExperience(${exp.id}, 'position', this.value)"
                    >
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Start Date (e.g., Jan 2020)" 
                        value="${exp.startDate}"
                        onchange="updateExperience(${exp.id}, 'startDate', this.value)"
                    >
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="End Date (e.g., Dec 2023)" 
                        value="${exp.endDate}"
                        onchange="updateExperience(${exp.id}, 'endDate', this.value)"
                    >
                </div>
                <textarea 
                    class="form-input" 
                    placeholder="Describe your responsibilities and achievements..." 
                    style="margin-top: var(--spacing-md);"
                    onchange="updateExperience(${exp.id}, 'description', this.value)"
                >${exp.description}</textarea>
            </div>
        `)
        .join('');
}

// ============================================
// Education Management
// ============================================

function addEducation() {
    const education = {
        id: Date.now(),
        school: '',
        degree: '',
        field: '',
        graduationDate: '',
        details: ''
    };

    resumeData.education.push(education);
    saveToLocalStorage();
    renderEducation();
    updatePreview();
}

function removeEducation(id) {
    resumeData.education = resumeData.education.filter(e => e.id !== id);
    saveToLocalStorage();
    renderEducation();
    updatePreview();
}

function updateEducation(id, field, value) {
    const edu = resumeData.education.find(e => e.id === id);
    if (edu) {
        edu[field] = value;
        saveToLocalStorage();
        updatePreview();
    }
}

function renderEducation() {
    const container = document.getElementById('educationList');
    container.innerHTML = resumeData.education
        .map(edu => `
            <div class="item-container">
                <div class="item-header">
                    <span style="font-weight: 600;">${edu.degree || 'New Education'}</span>
                    <button type="button" onclick="removeEducation(${edu.id})">✕</button>
                </div>
                <div class="item-grid">
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="School" 
                        value="${edu.school}"
                        onchange="updateEducation(${edu.id}, 'school', this.value)"
                    >
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Degree" 
                        value="${edu.degree}"
                        onchange="updateEducation(${edu.id}, 'degree', this.value)"
                    >
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Field of Study" 
                        value="${edu.field}"
                        onchange="updateEducation(${edu.id}, 'field', this.value)"
                    >
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Graduation Date" 
                        value="${edu.graduationDate}"
                        onchange="updateEducation(${edu.id}, 'graduationDate', this.value)"
                    >
                </div>
                <textarea 
                    class="form-input" 
                    placeholder="Additional details..." 
                    style="margin-top: var(--spacing-md);"
                    onchange="updateEducation(${edu.id}, 'details', this.value)"
                >${edu.details}</textarea>
            </div>
        `)
        .join('');
}

// ============================================
// Projects Management
// ============================================

function addProject() {
    const project = {
        id: Date.now(),
        title: '',
        description: '',
        technologies: '',
        link: ''
    };

    resumeData.projects.push(project);
    saveToLocalStorage();
    renderProjects();
    updatePreview();
}

function removeProject(id) {
    resumeData.projects = resumeData.projects.filter(p => p.id !== id);
    saveToLocalStorage();
    renderProjects();
    updatePreview();
}

function updateProject(id, field, value) {
    const proj = resumeData.projects.find(p => p.id === id);
    if (proj) {
        proj[field] = value;
        saveToLocalStorage();
        updatePreview();
    }
}

function renderProjects() {
    const container = document.getElementById('projectList');
    container.innerHTML = resumeData.projects
        .map(proj => `
            <div class="item-container">
                <div class="item-header">
                    <span style="font-weight: 600;">${proj.title || 'New Project'}</span>
                    <button type="button" onclick="removeProject(${proj.id})">✕</button>
                </div>
                <input 
                    type="text" 
                    class="form-input" 
                    placeholder="Project Title" 
                    value="${proj.title}"
                    onchange="updateProject(${proj.id}, 'title', this.value)"
                    style="margin-bottom: var(--spacing-md);"
                >
                <textarea 
                    class="form-input" 
                    placeholder="Project Description..." 
                    onchange="updateProject(${proj.id}, 'description', this.value)"
                    style="margin-bottom: var(--spacing-md);"
                >${proj.description}</textarea>
                <div class="item-grid">
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Technologies Used" 
                        value="${proj.technologies}"
                        onchange="updateProject(${proj.id}, 'technologies', this.value)"
                    >
                    <input 
                        type="url" 
                        class="form-input" 
                        placeholder="Project Link" 
                        value="${proj.link}"
                        onchange="updateProject(${proj.id}, 'link', this.value)"
                    >
                </div>
            </div>
        `)
        .join('');
}

// ============================================
// Update Preview in Real-time
// ============================================

function updatePreview() {
    // Personal Info
    document.getElementById('previewName').textContent = resumeData.fullName || 'Your Name';
    document.getElementById('previewHeadline').textContent = resumeData.headline || 'Professional Headline';

    const contactInfo = [];
    if (resumeData.email) contactInfo.push(`📧 ${resumeData.email}`);
    if (resumeData.phone) contactInfo.push(`📱 ${resumeData.phone}`);
    if (resumeData.location) contactInfo.push(`📍 ${resumeData.location}`);

    document.getElementById('previewContact').innerHTML = contactInfo.join('<br>') || 'Contact information will appear here';

    // Summary Section
    const summarySection = document.getElementById('summarySection');
    if (resumeData.summary) {
        document.getElementById('previewSummary').textContent = resumeData.summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }

    // Skills Section
    const skillsSection = document.getElementById('skillsSection');
    if (resumeData.skills.length > 0) {
        document.getElementById('previewSkills').innerHTML = resumeData.skills
            .map(skill => `<span class="preview-skill">${skill}</span>`)
            .join('');
        skillsSection.style.display = 'block';
    } else {
        skillsSection.style.display = 'none';
    }

    // Experience Section
    const experienceSection = document.getElementById('experienceSection');
    if (resumeData.experience.length > 0) {
        document.getElementById('previewExperience').innerHTML = resumeData.experience
            .map(exp => `
                <div class="preview-experience-item">
                    <div class="preview-job-title">${exp.position}</div>
                    <div class="preview-company">${exp.company}</div>
                    <div class="preview-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}</div>
                    ${exp.description ? `<div class="preview-description">${exp.description}</div>` : ''}
                </div>
            `)
            .join('');
        experienceSection.style.display = 'block';
    } else {
        experienceSection.style.display = 'none';
    }

    // Education Section
    const educationSection = document.getElementById('educationSection');
    if (resumeData.education.length > 0) {
        document.getElementById('previewEducation').innerHTML = resumeData.education
            .map(edu => `
                <div class="preview-education-item">
                    <div class="preview-job-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                    <div class="preview-company">${edu.school}</div>
                    ${edu.graduationDate ? `<div class="preview-date">${edu.graduationDate}</div>` : ''}
                    ${edu.details ? `<div class="preview-description">${edu.details}</div>` : ''}
                </div>
            `)
            .join('');
        educationSection.style.display = 'block';
    } else {
        educationSection.style.display = 'none';
    }

    // Projects Section
    const projectsSection = document.getElementById('projectsSection');
    if (resumeData.projects.length > 0) {
        document.getElementById('previewProjects').innerHTML = resumeData.projects
            .map(proj => `
                <div class="preview-project-item">
                    <div class="preview-job-title">${proj.title}</div>
                    ${proj.technologies ? `<div class="preview-company">${proj.technologies}</div>` : ''}
                    ${proj.description ? `<div class="preview-description">${proj.description}</div>` : ''}
                    ${proj.link ? `<div><a href="${proj.link}" target="_blank" style="color: var(--primary-color); text-decoration: none;">🔗 View Project</a></div>` : ''}
                </div>
            `)
            .join('');
        projectsSection.style.display = 'block';
    } else {
        projectsSection.style.display = 'none';
    }
}

function populateFormFromData() {
    fullNameInput.value = resumeData.fullName;
    emailInput.value = resumeData.email;
    phoneInput.value = resumeData.phone;
    locationInput.value = resumeData.location;
    headlineInput.value = resumeData.headline;
    summaryInput.value = resumeData.summary;
    renderSkills();
    renderExperience();
    renderEducation();
    renderProjects();
}

// ============================================
// Theme Toggle
// ============================================

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const icon = themeBtn.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// Sample Data
// ============================================

function loadSampleData() {
    resumeData = {
        fullName: 'Shayla Mostafiz Samara',
        email: 'samara.shayla@email.com',
        phone: '01575044991',
        location: 'Dhaka, Bangladesh',
        headline: 'Front-end Developer & UI/UX Designer',
        summary: 'Passionate front-end developer with 6+ years of experience building scalable web applications. Specialized in modern frontend frameworks and cloud architecture. Proven track record of leading cross-functional teams to deliver high-impact products.',
        skills: [
            'JavaScript/TypeScript',
            'React',
            'Tailwind CSS',
            'UI/UX Design',
            'Figma',
            'Python'
        ],
        experience: [
            {
                id: 1,
                company: 'Tech Innovations Ltd',
                position: 'Senior Front-end Developer',
                startDate: 'Jan 2022',
                endDate: 'Present',
                description: 'Led development of customer-facing web application serving 500K+ users. Architected microservices infrastructure reducing latency by 40%. Mentored junior developers and conducted code reviews.'
            },
            {
                id: 2,
                company: 'Digital Solutions Innovators',
                position: 'Frontend Developer',
                startDate: 'Jun 2019',
                endDate: 'Dec 2021',
                description: 'Developed responsive UI components using React and Tailwind CSS. Improved page load time by 35% through optimization techniques. Collaborated with design team to implement modern design systems.'
            },
            {
                id: 3,
                company: 'StartupXYZ',
                position: 'Junior UI/UX Designer & Frontend Developer',
                startDate: 'Jan 2018',
                endDate: 'May 2019',
                description: 'Built and maintained web applications using vanilla JavaScript and jQuery. Fixed critical bugs and implemented new features based on user feedback.'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Military Institute of Science and Technology',
                degree: 'Bachelor of Science',
                field: 'Computer Science and Engineering',
                graduationDate: '2017',
                details: 'GPA: 3.87/4.0. Specialized in software engineering and web development. Completed senior project on scalable web applications.'
            },
            {
                id: 2,
                school: 'Online Academy',
                degree: 'Full Stack Development Bootcamp',
                field: 'Web Development',
                graduationDate: '2018',
                details: 'Intensive 12-week program focusing on MERN stack'
            }
        ],
        projects: [
            {
                id: 1,
                title: 'AI Resume Builder',
                description: 'A modern resume builder with real-time preview and PDF export. Features glassmorphism design and dark mode support.',
                technologies: 'HTML5, CSS3, JavaScript, jsPDF',
                link: 'https://github.com/example/ai-resume-builder'
            },
            {
                id: 2,
                title: 'E-Commerce Dashboard',
                description: 'Full-stack analytics dashboard for real-time sales tracking with interactive charts and export functionality.',
                technologies: 'React, Node.js, MongoDB, Chart.js',
                link: 'https://github.com/example/ecommerce-dashboard'
            },
            {
                id: 3,
                title: 'Task Management App',
                description: 'Collaborative task management application with real-time updates and team collaboration features.',
                technologies: 'Next.js, Tailwind CSS, Firebase, TypeScript',
                link: 'https://github.com/example/task-app'
            }
        ]
    };

    saveToLocalStorage();
    populateFormFromData();
    updatePreview();
    showToast('✨ Sample data loaded!');
}

// ============================================
// PDF Download
// ============================================

function downloadPDF() {
    const element = document.querySelector('.preview-card');
    const opt = {
        margin: 10,
        filename: `${resumeData.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    showToast('📥 Resume downloaded successfully!');
}

// ============================================
// Toast Notification
// ============================================

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// Particle System
// ============================================

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(canvas));
    }

    animateParticles();
}

function animateParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// Initialize App on Load
// ============================================

document.addEventListener('DOMContentLoaded', init);
