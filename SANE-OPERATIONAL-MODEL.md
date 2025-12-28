# Modelo Operativo Sano - MCP sin GitHub Actions

## Principio fundamental

GitHub Actions no es infraestructura del MCP.
Es un comodín de CI, no un runtime confiable para un MCP distribuido.

## Quién ejecuta el MCP

El MCP lo ejecuta quien lo adopta, no el repositorio:

- Una empresa
- Un partner
- Un agente autónomo
- Un integrador
- Un VPS propio
- Un laptop
- Un runner interno

GitHub solo entrega:
- specs
- contratos
- versiones

## Modelo operativo correcto

### 1. GitHub = repositorio pasivo

Sirve para:
- Versionar `/specs/v3`
- Auditar decisiones
- Leer contratos MCP

**NO sirve para:**
- Ejecutar
- Validar en runtime
- Depender de billing

### 2. Ejecución local / remota controlada

#### Opción A — Runner MCP local (recomendada)

Comando estándar:
```bash
mcp run specs/v3
```

Funcionalidades:
- Corre validaciones
- Simula integraciones
- Ejecuta tests contractuales
- Genera reportes

Funciona:
- Sin GitHub
- Sin pagos
- Sin vendor lock-in

#### Opción B — VPS runner (SmarterOS style)

Un VPS (como el tuyo):
- cron
- systemd
- docker compose
- n8n
- runner MCP

Flujo:
- GitHub → pull
- Runner → ejecuta
- Resultados → logs / artifacts

#### Opción C — CI externo neutral

Para terceros:
- GitLab CI
- Woodpecker
- Drone
- Jenkins
- Buildkite
- Cualquier runner on-prem

**Importante:** Tu MCP no asume ninguno.

## Regla MCP

> Una spec no puede requerir GitHub Actions para ser válida.

Si requiere Actions:
- No es MCP
- Es un repo interno disfrazado

## Declaración oficial

**"GitHub Actions es opcional y no requerido"**

El sistema MCP es completamente funcional sin GitHub Actions:
- El CLI `mcp-runner` proporciona todas las funcionalidades
- La validación se realiza localmente
- Los resultados se generan sin dependencias externas

## Beneficios del modelo sano

### Portabilidad
- El MCP funciona en cualquier entorno
- No depende de servicios específicos
- Se puede ejecutar offline

### Institutionalidad
- No hay vendor lock-in
- No hay dependencia de billing
- Se puede auditar completamente

### Vendibilidad
- El sistema se puede licenciar independientemente
- No requiere infraestructura específica
- Se puede integrar en cualquier entorno

### Seriedad
- El sistema es profesional y confiable
- No hay dependencias frágiles
- Se puede mantener a largo plazo

## Implementación actual

### Componentes disponibles

1. **`mcp-runner`** - CLI para ejecución local
   - Ejecuta especificaciones MCP
   - Valida contratos
   - Verifica cumplimiento
   - Genera logs y reportes

2. **Contrato MCP Run** - Especificación formal
   - Define inputs/outputs
   - Especifica códigos de error
   - Documenta comportamiento esperado

3. **Sistema de logs** - Auditoría completa
   - Registros detallados
   - Resultados estructurados
   - Seguimiento de ejecuciones

## Transición desde GitHub Actions

### Antes
- Dependencia de GitHub Actions
- Requisito de servicios externos
- Posible vendor lock-in

### Ahora
- Ejecución local independiente
- Sin dependencias externas
- Total control del usuario

## Conclusión

El MCP trabaja contra:
- Contratos + entorno del ejecutor

No contra:
- Servicios específicos
- Cuentas de terceros
- Facturación externa

Esto lo hace:
- Portable
- Institutional
- Vendible
- Serio

## Próximos pasos

1. Documentar el runner para terceros
2. Crear paquetes de distribución
3. Definir estándares de integración
4. Establecer proceso de certificación