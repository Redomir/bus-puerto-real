# Contribuir

¡Gracias por el interés! Este es un proyecto pequeño y sin ánimo de lucro, así
que el proceso es sencillo.

## Formas de contribuir

- **Horarios desactualizados**: si el CMTBC publica un cambio de horario,
  abre un issue (o mejor, un PR) actualizando
  [`src/data/line6.ts`](src/data/line6.ts) con los nuevos datos de
  https://siu.cmtbc.es/es/horarios_lineas_tabla.php?linea=6
- **Bugs**: abre un issue describiendo qué esperabas y qué ha pasado
  (capturas si aplica).
- **Nuevas líneas / mejoras**: abre primero un issue para comentar el
  enfoque antes de ponerte a programar, así evitamos trabajo duplicado.

## Poner el proyecto en marcha

```bash
npm install
npm run dev
```

## Antes de abrir un PR

```bash
npm run lint
npx tsc -b --noEmit
npm run build
```

Manda el PR contra `master`. Descríbelo brevemente: qué cambia y por qué.
