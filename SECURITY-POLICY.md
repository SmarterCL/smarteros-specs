# Política de Acceso - SmarterOS

## Servicios Públicos (Exposición Directa)
Los siguientes servicios están expuestos públicamente a través de Caddy:

| Servicio | Dominio | Acceso | Uso |
|----------|---------|--------|-----|
| MCP | mcp.smarterbot.cl | Público | API Central |
| Odoo | odoo.smarterbot.cl | Público | Operaciones |
| Chatwoot | chatwoot.smarterbot.cl | Público | Soporte |
| n8n | n8n.smarterbot.cl | Autenticado | Automatización |

## Servicios Internos (Sin Acceso Público)
Los siguientes servicios NO están expuestos públicamente:

| Servicio | Acceso | Uso | Notas |
|----------|--------|-----|-------|
| Grafana | localhost:3001 | Monitoreo | Solo acceso local |
| Prometheus | Interno | Métricas | Solo red interna |
| PostgreSQL | Interno | Base de datos | Solo red core_net |
| Redis | Interno | Caché/sesiones | Solo red core_net |

## Seguridad Implementada
- Caddy actúa como proxy inverso para todos los servicios públicos
- n8n requiere autenticación básica (ajustar credenciales según sea necesario)
- Todos los servicios internos están aislados en redes Docker privadas
- No hay puertos innecesarios expuestos al exterior

## Configuración de Autenticación para n8n
Para activar autenticación en n8n, agregar credenciales en el Caddyfile:

```
n8n.smarterbot.cl {
    basicauth * {
        usuario HASH_CONTRASEÑA_CIFRADA
    }
    reverse_proxy smarteros-n8n:5678
}
```

Para generar el hash de contraseña: `caddy hash-password`