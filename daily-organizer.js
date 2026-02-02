// Daily Organizer JavaScript
import { db } from './firebase-config.js';
import { collection, doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// State management
let currentDay = 'monday';
let currentStudentId = null;
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
});

// Check if student is logged in
function checkLogin() {
    const savedStudentId = localStorage.getItem('studentId');
    
    if (savedStudentId) {
        currentStudentId = savedStudentId;
        hideWelcomeModal();
        showMainApp();
        initializeApp();
    } else {
        showWelcomeModal();
    }
}

// Show welcome choice modal
function showWelcomeModal() {
    const welcomeModal = document.getElementById('welcome-modal');
    welcomeModal.classList.remove('hidden');
    
    // Student choice
    const studentBtn = document.getElementById('student-choice-btn');
    studentBtn.onclick = () => {
        welcomeModal.classList.add('hidden');
        showLoginModal();
    };
    
    // Teacher choice
    const teacherBtn = document.getElementById('teacher-choice-btn');
    teacherBtn.onclick = () => {
        window.location.href = 'teacher.html';
    };
}

// Hide welcome modal
function hideWelcomeModal() {
    const welcomeModal = document.getElementById('welcome-modal');
    if (welcomeModal) {
        welcomeModal.classList.add('hidden');
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('hidden');
    
    const input = document.getElementById('student-id-input');
    const loginBtn = document.getElementById('login-btn');
    const backBtn = document.getElementById('back-to-choice');
    
    // Focus input
    setTimeout(() => input.focus(), 100);
    
    // Handle login
    loginBtn.onclick = handleLogin;
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };
    
    // Back to choice
    backBtn.onclick = (e) => {
        e.preventDefault();
        modal.classList.add('hidden');
        showWelcomeModal();
    };
}

// Handle student login
function handleLogin() {
    const input = document.getElementById('student-id-input');
    const studentId = input.value.trim();
    
    if (studentId.length < 2) {
        showToast('Please enter at least 2 characters');
        return;
    }
    
    // Save student ID
    currentStudentId = studentId;
    localStorage.setItem('studentId', studentId);
    
    // Hide both modals and show app
    document.getElementById('welcome-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.add('hidden');
    showMainApp();
    initializeApp();
}

// Show main app interface
function showMainApp() {
    document.getElementById('student-display').textContent = `Student: ${currentStudentId}`;
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to switch students? Make sure your work is saved!')) {
        localStorage.removeItem('studentId');
        currentStudentId = null;
        location.reload();
    }
}

// Initialize the app
function initializeApp() {
    setupEventListeners();
    loadDayData(currentDay);
    loadDailyPlan();
    
    // Auto-save every 30 seconds
    setInterval(() => {
        autoSave();
    }, 30000);
    
    // Reload daily plan every 5 minutes
    setInterval(() => {
        loadDailyPlan();
    }, 300000);
}

// Setup all event listeners
function setupEventListeners() {
    // Day selector buttons
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleDayChange(e.target.dataset.day);
        });
    });
    
    // Save button
    document.getElementById('save-btn').addEventListener('click', async () => {
        await saveCurrentDay();
        showToast('Saved to cloud! ☁️');
    });
    
    // Clear button
    document.getElementById('clear-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear all content for today?')) {
            await clearCurrentDay();
            showToast('Cleared successfully!');
        }
    });
    
    // Auto-save on content change (debounced)
    const editableElements = document.querySelectorAll('.editable-content');
    editableElements.forEach(element => {
        let timeout;
        element.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                autoSave();
            }, 3000);
        });
    });
}

// Handle day change
async function handleDayChange(day) {
    if (day === currentDay) return;
    
    // Save current day before switching
    await saveCurrentDay();
    
    // Update state
    currentDay = day;
    
    // Update UI
    updateActiveDay(day);
    await loadDayData(day);
}

// Update active day button
function updateActiveDay(day) {
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.day === day) {
            btn.classList.add('active');
        }
    });
}

// Update sync status
function updateSyncStatus(status) {
    const syncStatus = document.getElementById('sync-status');
    const statusText = syncStatus.querySelector('.status-text');
    
    syncStatus.className = 'sync-status';
    
    if (status === 'syncing') {
        syncStatus.classList.add('syncing');
        statusText.textContent = 'Syncing...';
    } else if (status === 'synced') {
        statusText.textContent = 'Synced';
    } else if (status === 'error') {
        syncStatus.classList.add('error');
        statusText.textContent = 'Sync Error';
    }
}

// Load daily plan from teacher (read-only)
async function loadDailyPlan() {
    try {
        const docRef = doc(db, 'dailyPlan', currentDay);
        const docSnap = await getDoc(docRef);
        
        const contentDiv = document.getElementById('daily-plan-content');
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            contentDiv.textContent = data.planContent || 'No plan set for today yet.';
            contentDiv.classList.remove('no-plan-message');
        } else {
            contentDiv.innerHTML = '<div class="no-plan-message">No plan set for today yet.</div>';
        }
    } catch (error) {
        console.error('Error loading daily plan:', error);
        document.getElementById('daily-plan-content').innerHTML = 
            '<div class="no-plan-message">Unable to load today\'s plan.</div>';
    }
}

// Save current day data to Firebase
async function saveCurrentDay() {
    try {
        updateSyncStatus('syncing');
        
        const data = {
            studentId: currentStudentId,
            day: currentDay,
            classContent: document.getElementById('class-content').innerHTML,
            homeworkContent: document.getElementById('homework-content').innerHTML,
            eventsContent: document.getElementById('events-content').innerHTML,
            weekendContent: document.getElementById('weekend-content').innerHTML,
            lastModified: new Date().toISOString()
        };
        
        // Save to Firebase
        const docRef = doc(db, 'organizer', `${currentStudentId}_${currentDay}`);
        await setDoc(docRef, data);
        
        // Also save to localStorage as backup
        localStorage.setItem(`organizer_${currentStudentId}_${currentDay}`, JSON.stringify(data));
        
        updateSyncStatus('synced');
        return true;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        updateSyncStatus('error');
        
        // Still save to localStorage as fallback
        try {
            const data = {
                classContent: document.getElementById('class-content').innerHTML,
                homeworkContent: document.getElementById('homework-content').innerHTML,
                eventsContent: document.getElementById('events-content').innerHTML,
                weekendContent: document.getElementById('weekend-content').innerHTML,
                lastModified: new Date().toISOString()
            };
            localStorage.setItem(`organizer_${currentStudentId}_${currentDay}`, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
        
        return false;
    }
}

// Auto-save (silent)
async function autoSave() {
    await saveCurrentDay();
}

// Load day data from Firebase
async function loadDayData(day) {
    try {
        updateSyncStatus('syncing');
        
        // Try to load from Firebase first
        const docRef = doc(db, 'organizer', `${currentStudentId}_${day}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('class-content').innerHTML = data.classContent || '';
            document.getElementById('homework-content').innerHTML = data.homeworkContent || '';
            document.getElementById('events-content').innerHTML = data.eventsContent || '';
            document.getElementById('weekend-content').innerHTML = data.weekendContent || '';
            updateSyncStatus('synced');
            return;
        }
        
        // If not in Firebase, try localStorage
        const savedData = localStorage.getItem(`organizer_${currentStudentId}_${day}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('class-content').innerHTML = data.classContent || '';
            document.getElementById('homework-content').innerHTML = data.homeworkContent || '';
            document.getElementById('events-content').innerHTML = data.eventsContent || '';
            document.getElementById('weekend-content').innerHTML = data.weekendContent || '';
        } else {
            clearFields();
        }
        
        updateSyncStatus('synced');
    } catch (error) {
        console.error('Error loading from Firebase:', error);
        updateSyncStatus('error');
        
        // Fallback to localStorage
        const savedData = localStorage.getItem(`organizer_${currentStudentId}_${day}`);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                document.getElementById('class-content').innerHTML = data.classContent || '';
                document.getElementById('homework-content').innerHTML = data.homeworkContent || '';
                document.getElementById('events-content').innerHTML = data.eventsContent || '';
                document.getElementById('weekend-content').innerHTML = data.weekendContent || '';
            } catch (e) {
                console.error('Error loading from localStorage:', e);
                clearFields();
            }
        } else {
            clearFields();
        }
    }
}

// Clear all fields
function clearFields() {
    document.getElementById('class-content').innerHTML = '';
    document.getElementById('homework-content').innerHTML = '';
    document.getElementById('events-content').innerHTML = '';
    document.getElementById('weekend-content').innerHTML = '';
}

// Clear current day from Firebase and localStorage
async function clearCurrentDay() {
    clearFields();
    
    try {
        // Delete from Firebase
        const docRef = doc(db, 'organizer', `${currentStudentId}_${currentDay}`);
        await deleteDoc(docRef);
        
        // Delete from localStorage
        localStorage.removeItem(`organizer_${currentStudentId}_${currentDay}`);
        
        updateSyncStatus('synced');
    } catch (error) {
        console.error('Error clearing data:', error);
        updateSyncStatus('error');
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentDay();
        showToast('Saved! ✓');
    }
});

// Warn before closing
window.addEventListener('beforeunload', async (e) => {
    await saveCurrentDay();
});
