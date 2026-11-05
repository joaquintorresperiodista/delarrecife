# Cómo escribir una entrada del blog

El blog usa **Jekyll**, que GitHub Pages ya trae incluido. No hay que instalar nada:
al publicar en `main`, GitHub arma el sitio solo (tarda 1 o 2 minutos).

## 1. Crea el archivo

En la carpeta `_posts/`, crea un archivo con este nombre:

```
AAAA-MM-DD-nombre-de-la-entrada.md
```

Ejemplo: `2026-11-20-como-elegir-un-dominio.md`. La parte después de la fecha
será la dirección: `/blog/como-elegir-un-dominio/`. Usa minúsculas, sin tildes ni ñ,
y guiones en vez de espacios.

## 2. Copia este encabezado al inicio

```yaml
---
title: "Título de la entrada"
description: "Resumen de 1 o 2 frases (máx. ~155 caracteres). Sale en Google, en WhatsApp y en el listado."
categoria: desarrollo-web          # desarrollo-web | comunicacion | ecommerce
imagen: /assets/blog/mi-foto.jpg   # opcional. Sube la foto a assets/blog/
imagen_alt: "Qué se ve en la foto" # obligatorio si hay imagen
imagen_ancho: 1200                 # opcional, ancho real en píxeles
imagen_alto: 800                   # opcional, alto real en píxeles
---
```

Las categorías se definen en `_data/categorias.yml`.

## 3. Escribe el texto en Markdown

```markdown
Párrafo normal. **Negrita**, *cursiva* y [un enlace](https://ejemplo.cl).

## Subtítulo

- Punto de una lista
- Otro punto

> Una cita destacada.
```

No uses `# Título` (un solo #): el título ya lo pone la plantilla.

## 4. Listo

Al publicar, la entrada aparece sola en el listado `/blog/`, en el `sitemap.xml`,
en el feed RSS (`/blog/feed.xml`) y en `llms.txt`.

**Borradores:** guarda la entrada en la carpeta `_drafts/` (sin fecha en el nombre)
y no se publicará hasta que la muevas a `_posts/`.

**Ojo con la fecha:** una entrada con fecha futura no se publica hasta ese día
(y solo cuando el sitio se vuelva a construir).
