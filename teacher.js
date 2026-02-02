// Teacher Admin JavaScript
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const TEACHER_PASSWORD = "teacher2026"; // Change this to your desired password
let currentDay = 'monday';

document.addEventListener('DOMContentLoaded', () => {
    checkTeacherAuth();
    setupEventListeners();
});

function checkTeacherAuth() {
    const isTeacher = localStorage.getItem('isTeacher');
    
    if (isTeacher === 'true') {
        showTeacherPanel();
        loadPlanForDay(currentDay);
    } else {
        // Check if accessed from student account
        const studentId = localStorage.getItem('studentId');
        if (studentId) {
            showStudentWhoops();
        }
    }
}

function setupEventListeners() {
    // Login button
    document.getElementById('teacher-login-btn').addEventListener('click', handleTeacherLogin);
    document.getElementById('teacher-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleTeacherLogin();
        }
    });
    
    // Day tabs
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            handleDayChange(e.target.dataset.day);
        });
    });
    
    // Save plan button
    document.getElementById('save-plan-btn').addEventListener('click', savePlan);
    
    // Clear plan button
    document.getElementById('clear-plan-btn').addEventListener('click', clearPlan);
}

function handleTeacherLogin() {
    const password = document.getElementById('teacher-password').value;
    
    if (password === TEACHER_PASSWORD) {
        localStorage.setItem('isTeacher', 'true');
        showTeacherPanel();
        loadPlanForDay(currentDay);
        showToast('Welcome, Teacher! ✓');
    } else {
        showToast('Incorrect password!');
        document.getElementById('teacher-password').value = '';
    }
}

function showStudentWhoops() {
    document.getElementById('teacher-login').style.display = 'none';
    document.getElementById('teacher-panel').classList.remove('active');
    document.getElementById('student-whoops').classList.add('active');
}

function showTeacherPanel() {
    document.getElementById('teacher-login').style.display = 'none';
    document.getElementById('student-whoops').classList.remove('active');
    document.getElementById('teacher-panel').classList.add('active');
}

function handleDayChange(day) {
    if (day === currentDay) return;
    
    currentDay = day;
    updateActiveDayTab(day);
    loadPlanForDay(day);
}

function updateActiveDayTab(day) {
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.day === day) {
            tab.classList.add('active');
        }
    });
}

async function loadPlanForDay(day) {
    try {
        updateStatus('syncing');
        
        const docRef = doc(db, 'dailyPlan', day);
        const docSnap = await getDoc(docRef);
        
        const textarea = document.getElementById('plan-textarea');
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            textarea.value = data.planContent || '';
        } else {
            textarea.value = '';
        }
        
        updateStatus('synced');
    } catch (error) {
        console.error('Error loading plan:', error);
        updateStatus('error');
        showToast('Error loading plan');
    }
}

async function savePlan() {
    try {
        updateStatus('syncing');
        
        const planContent = document.getElementById('plan-textarea').value;
        
        const data = {
            day: currentDay,
            planContent: planContent,
            lastModified: new Date().toISOString()
        };
        
        const docRef = doc(db, 'dailyPlan', currentDay);
        await setDoc(docRef, data);
        
        updateStatus('synced');
        showToast('Plan published! Students can now see it. ✓');
    } catch (error) {
        console.error('Error saving plan:', error);
        updateStatus('error');
        showToast('Error saving plan');
    }
}

async function clearPlan() {
    if (!confirm('Are you sure you want to clear this day\'s plan?')) {
        return;
    }
    
    try {
        updateStatus('syncing');
        
        const docRef = doc(db, 'dailyPlan', currentDay);
        await deleteDoc(docRef);
        
        document.getElementById('plan-textarea').value = '';
        
        updateStatus('synced');
        showToast('Plan cleared!');
    } catch (error) {
        console.error('Error clearing plan:', error);
        updateStatus('error');
        showToast('Error clearing plan');
    }
}

function updateStatus(status) {
    const syncStatus = document.getElementById('sync-status');
    const statusText = syncStatus.querySelector('.status-text');
    
    syncStatus.className = 'sync-status';
    
    if (status === 'syncing') {
        syncStatus.classList.add('syncing');
        statusText.textContent = 'Saving...';
    } else if (status === 'synced') {
        statusText.textContent = 'Saved';
    } else if (status === 'error') {
        syncStatus.classList.add('error');
        statusText.textContent = 'Error';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
