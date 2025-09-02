from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('stats/', views.task_stats, name='task-stats'),
    path('bulk-update/', views.bulk_update_tasks, name='bulk-update'),
]
