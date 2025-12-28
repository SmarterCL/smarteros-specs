# MCP Specifications

Este directorio contiene las especificaciones del MCP (Micro Control Plane) que cumplen con el contrato MCP.

## Estructura obligatoria

Cada archivo YAML/YML en este directorio debe contener los siguientes campos obligatorios:

```yaml
id: identificador.unico.de.la.spec
version: "versión de la especificación"
inputs:
  - name: nombre_del_input
    type: tipo_de_dato
    required: true/false
outputs:
  - name: nombre_del_output
    type: tipo_de_dato
```

## Ejemplo de especificación válida

Ver `invoice-validator.yaml` como ejemplo de especificación que cumple con el contrato MCP.

## Validación

Todas las especificaciones se validan automáticamente usando el comando:

```bash
./mcp-runner validate
```

Las especificaciones que no cumplan con el contrato MCP (faltan campos obligatorios) serán rechazadas durante la validación.