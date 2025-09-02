from django.db import models
from django.utils import timezone

class Task(models.Model):
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
    ]
    
    PRIORITY_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, verbose_name="Descripción")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pendiente',
        verbose_name="Estado"
    )
    priority = models.CharField(
        max_length=10, 
        choices=PRIORITY_CHOICES, 
        default='media',
        verbose_name="Prioridad"
    )
    due_date = models.DateField(null=True, blank=True, verbose_name="Fecha límite")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")
    
    def __str__(self):
        return self.title
    
    def is_overdue(self):
        if self.due_date and self.status != 'completada':
            return self.due_date < timezone.now().date()
        return False
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Tarea"
        verbose_name_plural = "Tareas"
