# SmarterOS - Sistema Operativo con CV Operativo

## Descripción

SmarterOS es un sistema operativo que aprende de la fricción real en lugar de seguir planes predeterminados. Registra automáticamente ciclos PDCA cada vez que ocurre un error operativo, creando un currículum vitae basado en problemas reales resueltos.

## Estructura del sistema

- `cli/smarter` - Binario principal del sistema
- `specs/integrations/` - Especificaciones de integraciones
- `logs/pdca/` - Registros de ciclos PDCA automáticos
- `playbooks/` - Documentación de aprendizajes derivados de errores reales

## Evidencia de operación

- 1 binario funcional
- 1 integración real (MercadoLibre)
- 2 PDCA cerrados
- 1 playbook derivado de errores reales

## Uso

```bash
# Ejecutar autenticación para una integración
./cli/smarter auth mercadolibre
```

El sistema generará automáticamente registros PDCA para cada error operativo, permitiendo aprendizaje continuo basado en fricción real.

## Características principales

- Registro automático de ciclos PDCA para errores operativos
- Sistema de gobernanza que no permite "mentir por omisión"
- Aprendizaje continuo basado en fricción real
- Integraciones documentadas a través de especificaciones
- Playbooks generados a partir de errores reales