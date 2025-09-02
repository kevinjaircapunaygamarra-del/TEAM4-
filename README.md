Sistema de Gestión de Tareas Personales
📋 Descripción
Sistema web full-stack para la gestión eficiente de tareas personales. Desarrollado con Django REST Framework en el backend y tecnologías nativas (HTML5, CSS3, JavaScript) en el frontend. Permite crear, organizar, priorizar y realizar seguimiento de tareas con una interfaz intuitiva y responsive.

- Características principales:

- Creación y gestión de tareas con prioridades y estados

- Dashboard con estadísticas en tiempo real

- Sistema avanzado de filtros y búsqueda

- Diseño responsive para cualquier dispositivo

- Operaciones por lotes (marcar múltiples tareas como completadas)

- Detección automática de tareas vencidas

ROLES:
- Kevin Capuñay(Scrum Master)
- Marco Escalante(Desarrollador backend)
- Fabian Rivas(Desarrollador Backend)
- Valentino Cuenca(Desarrollador Frontend)
- Angel Morales(Desarrollador Frontend)

Instalación y Configuración

Pasos de instalación:

1. Clonar el repositorio

git clone https://github.com/tu-usuario/task-manager.git
cd task-manager

2. Configurar entorno virtual

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Activar entorno (Mac/Linux)
source venv/bin/activate

3. Instalar dependencias

pip install -r requirements.txt

4. Configurar base de datos

python manage.py makemigrations
python manage.py migrate

5. Ejecutar servidor de desarrollo

python manage.py runserver
6. Abrir frontend

Abrir frontend/index.html en Live Server (VS Code)

Historias de Usuario Principales

ID	Historia de Usuario	Prioridad	Estado
HU-001	Como usuario, quiero crear nuevas tareas con título y descripción para registrar mis actividades	Alta	✅ Completada
HU-002	Como usuario, necesito ver una lista de todas mis tareas para tener una visión general	Alta	✅ Completada
HU-003	Como usuario, quiero poder editar y eliminar tareas para mantener mi lista actualizada
