# Bus Puerto Real

Wrapper moderno y mobile-first del horario de la línea **M-030** (línea 6 del
CMTBC): Cádiz - Río San Pedro - Campus Universitario - Puerto Real - Hospital.

Fuente de datos original:
https://siu.cmtbc.es/es/horarios_lineas_tabla.php?linea=6

## Qué hace

- Próxima salida en cada sentido (IDA/VUELTA) con cuenta atrás en vivo.
- Detección automática del tipo de día (laborable / sábado / domingo), con
  selector manual para festivos (el consorcio no publica un calendario de
  festivos consultable, así que no se detectan automáticamente).
- Horario completo del sentido seleccionado, filtrado por tipo de día, con
  cada salida expandible para ver el paso por todas las paradas intermedias.
- Indicador de servicio adaptado a movilidad reducida (PMR).

Los horarios están embebidos en [`src/data/line6.ts`](src/data/line6.ts)
(vigentes desde el 07/01/2025 según la web oficial); si el consorcio publica
un cambio de horario hay que actualizar ese archivo a mano.

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build   # build de producción en dist/
npm run lint    # oxlint
```
