// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Elementos del DOM
const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const tasksContainer = document.getElementById('tasksContainer');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');

// Estado de la aplicación
let currentTasks = [];

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadStats();
    
    // Event listeners para filtros
    searchInput.addEventListener('input', filterTasks);
    statusFilter.addEventListener('change', filterTasks);
    priorityFilter.addEventListener('change', filterTasks);
    
    // Event listeners para formularios
    addTaskForm.addEventListener('submit', handleAddTask);
    editTaskForm.addEventListener('submit', handleEditTask);
    
    // Event listener para cerrar modal
    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});

// Funciones de la API
async function fetchTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/`);
        if (!response.ok) throw new Error('Error al cargar tareas');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar las tareas', 'error');
        return [];
    }
}

async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats/`);
        if (!response.ok) throw new Error('Error al cargar estadísticas');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return {};
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Error al crear tarea');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar tarea');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar tarea');
        return true;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Funciones de la UI
async function loadTasks() {
    currentTasks = await fetchTasks();
    renderTasks(currentTasks);
}

async function loadStats() {
    const stats = await fetchStats();
    updateStats(stats);
}

function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="task-item">
                <div class="task-content">
                    <p>No hay tareas para mostrar. ¡Agrega una nueva tarea!</p>
                </div>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    // Icono según prioridad
    let priorityIcon = 'fa-flag';
    if (task.priority === 'alta') priorityIcon = 'fa-flag text-danger';
    if (task.priority === 'baja') priorityIcon = 'fa-flag text-success';
    
    // Formatear fecha
    const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha';
    
    taskElement.innerHTML = `
        <div class="task-content">
            <div class="task-title">
                <i class="fas ${priorityIcon}"></i> ${task.title}
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-meta">
                <span class="task-priority ${task.priority}">
                    <i class="fas fa-flag"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span class="task-status ${task.status}">
                    <i class="fas fa-tasks"></i> ${getStatusText(task.status)}
                </span>
                <span class="task-date">
                    <i class="fas fa-calendar"></i> ${dueDate}
                </span>
                ${task.is_overdue ? `<span class="task-overdue"><i class="fas fa-exclamation-triangle"></i> Vencida</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-success complete-btn" data-id="${task.id}">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn-warning edit-btn" data-id="${task.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-danger delete-btn" data-id="${task.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Agregar event listeners a los botones
    const completeBtn = taskElement.querySelector('.complete-btn');
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => completeTask(task.id));
    editBtn.addEventListener('click', () => openEditModal(task));
    deleteBtn.addEventListener('click', () => deleteTaskHandler(task.id));
    
    return taskElement;
}

function updateStats(stats) {
    document.querySelectorAll('.stat-number')[0].textContent = stats.total || 0;
    document.querySelectorAll('.stat-number')[1].textContent = stats.pending || 0;
    document.querySelectorAll('.stat-number')[2].textContent = stats.completed || 0;
    document.querySelectorAll('.stat-number')[3].textContent = stats.overdue || 0;
}

function filterTasks() {
    const searchText = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const priorityValue = priorityFilter.value;
    
    const filteredTasks = currentTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchText) || 
                             (task.description && task.description.toLowerCase().includes(searchText));
        const matchesStatus = statusValue ? task.status === statusValue : true;
        const matchesPriority = priorityValue ? task.priority === priorityValue : true;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    renderTasks(filteredTasks);
}

function openEditModal(task) {
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskStatus').value = task.status;
    document.getElementById('editTaskDueDate').value = task.due_date || '';
    
    editModal.style.display = 'block';
}

// Manejadores de eventos
async function handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    
    try {
        await createTask({
            title,
            description,
            priority,
            due_date: dueDate || null,
            status: 'pendiente'
        });
        
        showNotification('Tarea creada correctamente', 'success');
        addTaskForm.reset();
        loadTasks();
        loadStats();
    } catch (error) {
        showNotification('Error al crear la tarea', 'error');
    }
}

async function handleEditTask(e) {
    e.preventDefault();
    
    const id = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value;
    const description = document.getElementById('editTaskDescription').value;
    const priority = document.getElementById('editTaskPriority').value;
    const status = document.getElementById('editTaskStatus').value;
    const dueDate = document.getElementById('editTaskDueDate').value;
    
    try {
        await updateTask(id, {
            title,
            description,
            priority,
            status,
            due_date: dueDate || null
        });
        
        showNotification('Tarea actualizada correctamente', 'success');
        editModal.style.display = 'none';
        loadTasks();
        loadStats();
    } catch (error) {
        showNotification('Error al actualizar la tarea', 'error');
    }
}

async function completeTask(id) {
    try {
        const task = currentTasks.find(t => t.id === id);
        await updateTask(id, {
            ...task,
            status: 'completada'
        });
        
        showNotification('Tarea marcada como completada', 'success');
        loadTasks();
        loadStats();
    } catch (error) {
        showNotification('Error al completar la tarea', 'error');
    }
}

async function deleteTaskHandler(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    try {
        await deleteTask(id);
        showNotification('Tarea eliminada correctamente', 'success');
        loadTasks();
        loadStats();
    } catch (error) {
        showNotification('Error al eliminar la tarea', 'error');
    }
}

// Utilidades
function getStatusText(status) {
    const statusMap = {
        'pendiente': 'Pendiente',
        'en_progreso': 'En progreso',
        'completada': 'Completada'
    };
    
    return statusMap[status] || status;
}

function showNotification(message, type) {
    // Crear notificación (podrías usar una librería como Toastify para mejor UX)
    alert(`${type.toUpperCase()}: ${message}`);
}
