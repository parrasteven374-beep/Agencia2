# Imágenes pendientes y datos provisionales

Los visuales actuales (`assets/*.svg`) son ilustraciones propias, sin personas. Para reemplazarlos por fotos reales del espacio, **sin personas**, usar estas fichas.

Las fotos actuales son de prueba (genéricas, de bancos libres) y están en `assets/photos/`; créditos en `assets/photos/CREDITOS.md`. Los SVG de `assets/` se conservan como respaldo.

| Slot | Archivo actual | Proporción | Dirección de arte | Alt sugerido |
|---|---|---|---|---|
| Hero escena 1 | hero-1.svg | 16:9 | Aro de luz encendido con cámara, fondo oscuro cálido | Aro de luz y cámara en un set oscuro |
| Hero escena 2 | hero-2.svg | 16:9 | Cabina con monitor, cortinas, cajas de luz | Cabina privada con iluminación |
| Hero escena 3 | hero-3.svg | 16:9 | Cámara, micrófono con brazo y caja de luz | Equipo de grabación del estudio |
| Carrusel (6) | set-1…6.svg | 4:5 | Un detalle del equipo o ambiente por foto, luz cálida | Descripción corta del objeto |

Reglas: nada de personas ni espejos con reflejos de personas, sin metadatos EXIF (borrarlos antes de subir) y nombres de archivo neutros.

## Datos provisionales a reemplazar
- Nombre "Estudio Umbra" (provisional).
- Número de mensajes: `data-w` del botón `#wa` en `index.html` (solo dígitos con código de país). Vacío por ahora.
- Envío del formulario: atributo `data-endpoint` del `<form id="form">`. Sin él funciona en modo demostración.
- Textos de servicios y preguntas frecuentes: genéricos, ajustar a las condiciones reales.

## Privacidad
- `index.html` lleva `noindex, nofollow` y `robots.txt` bloquea todo. Quitar ambos si quieres aparecer en buscadores.
- No hay analítica, CDN ni fuentes externas.
