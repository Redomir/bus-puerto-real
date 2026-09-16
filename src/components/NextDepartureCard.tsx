import type { Direction } from '../data/line6'
import type { NextDeparture } from '../lib/schedule'
import { formatMinutes } from '../lib/schedule'

interface Props {
  direction: Direction
  next: NextDeparture | null
}

export default function NextDepartureCard({ direction, next }: Props) {
  return (
    <article className="next-card">
      <header className="next-card__header">
        <span className="next-card__badge">{direction.label}</span>
        <h2 className="next-card__route">
          {direction.from} <span aria-hidden="true">→</span> {direction.to}
        </h2>
      </header>

      {next ? (
        <div className="next-card__body">
          <div className="next-card__time">
            <span className="next-card__countdown">{formatMinutes(next.minutesUntil)}</span>
            <span className="next-card__clock">
              {next.isTomorrow ? 'mañana ' : ''}
              {next.departure}
            </span>
          </div>
          {next.row.pmr && (
            <span className="next-card__pmr" title="Servicio adaptado a personas con movilidad reducida">
              ♿ PMR
            </span>
          )}
        </div>
      ) : (
        <p className="next-card__empty">No hay más salidas para el tipo de día seleccionado.</p>
      )}
    </article>
  )
}
