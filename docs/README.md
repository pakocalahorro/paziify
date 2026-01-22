# 📚 Documentación del Proyecto Paziify

Esta carpeta contiene toda la documentación del proyecto organizada de forma estructurada.

## 📁 Estructura

```
docs/
├── plans/              # Planes de implementación
│   └── implementation_plan.md
└── sessions/           # Notas de cada sesión de trabajo
    └── 2026-01-21_react_native_migration.md
```

---

## 📋 Plans (Planes)

Contiene los planes de implementación del proyecto:

- **implementation_plan.md**: Plan maestro con todas las fases, milestones, tareas y presupuestos

**Cuándo actualizar:**
- Al completar un milestone
- Al cambiar prioridades
- Al ajustar estimaciones

---

## 📝 Sessions (Sesiones)

Contiene las notas de cada sesión de trabajo:

**Formato de nombre:** `YYYY-MM-DD_descripcion.md`

**Contenido de cada sesión:**
- Resumen de lo realizado
- Logros principales
- Problemas encontrados
- Próximos pasos
- Progreso del milestone

**Cuándo crear:**
- Al finalizar cada sesión de trabajo
- Usar workflow `/session-end`

---

## 🔄 Workflows

Los workflows del agente están en `.agent/workflows/`:

### `/catch-up`
**Descripción:** Ponerse al día con el estado del proyecto

**Cuándo usar:**
- Al iniciar una nueva sesión
- Después de varios días sin trabajar
- Para recordar dónde quedamos

**Qué hace:**
1. Lee la última sesión
2. Revisa el plan de implementación
3. Verifica estado del código
4. Resume todo al usuario

### `/session-end`
**Descripción:** Guardar el progreso de la sesión actual

**Cuándo usar:**
- Al terminar una sesión de trabajo
- Antes de hacer un commit importante
- Al completar un milestone

**Qué hace:**
1. Revisa el trabajo realizado
2. Crea nota de sesión
3. Actualiza plan de implementación
4. Opcionalmente hace commit

---

## 📖 Cómo Usar

### Al Iniciar Sesión:
```
/catch-up
```

### Al Terminar Sesión:
```
/session-end
```

### Para Ver el Plan:
Abrir `docs/plans/implementation_plan.md`

### Para Ver Sesiones Anteriores:
Navegar a `docs/sessions/` y abrir la fecha deseada

---

## 🎯 Beneficios

✅ **Continuidad:** Siempre sabes dónde quedaste  
✅ **Historial:** Registro completo de decisiones y cambios  
✅ **Planificación:** Plan maestro siempre actualizado  
✅ **Aprendizaje:** Documentación de problemas y soluciones  

---

**Última actualización:** 21 de Enero de 2026
