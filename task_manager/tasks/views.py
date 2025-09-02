from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        queryset = Task.objects.all()
        
        # Filtros
        status = self.request.query_params.get('status', None)
        priority = self.request.query_params.get('priority', None)
        search = self.request.query_params.get('search', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
            
        return queryset

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@api_view(['GET'])
def task_stats(request):
    total = Task.objects.count()
    completed = Task.objects.filter(status='completada').count()
    in_progress = Task.objects.filter(status='en_progreso').count()
    pending = Task.objects.filter(status='pendiente').count()
    overdue = Task.objects.filter(due_date__lt=timezone.now().date()).exclude(status='completada').count()
    
    return Response({
        'total': total,
        'completed': completed,
        'in_progress': in_progress,
        'pending': pending,
        'overdue': overdue
    })

@api_view(['POST'])
def bulk_update_tasks(request):
    # Para actualizar múltiples tareas a la vez
    task_ids = request.data.get('task_ids', [])
    action = request.data.get('action', None)
    
    if not task_ids or not action:
        return Response({'error': 'Se requieren task_ids y action'}, status=status.HTTP_400_BAD_REQUEST)
    
    tasks = Task.objects.filter(id__in=task_ids)
    
    if action == 'delete':
        tasks.delete()
        return Response({'message': 'Tareas eliminadas correctamente'})
    
    elif action == 'complete':
        tasks.update(status='completada')
        return Response({'message': 'Tareas marcadas como completadas'})
    
    elif action == 'pending':
        tasks.update(status='pendiente')
        return Response({'message': 'Tareas marcadas como pendientes'})
    
    return Response({'error': 'Acción no válida'}, status=status.HTTP_400_BAD_REQUEST)
