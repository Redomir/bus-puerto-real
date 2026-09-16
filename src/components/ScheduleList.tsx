import { useState } from 'react'
import type { Direction, ScheduleRow } from '../data/line6'

interface Props {
  direction: Direction
  rows: ScheduleRow[]
  nextDeparture: string | null
  nowMinutes: number
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export default function ScheduleList({ direction, rows, nextDeparture, nowMinutes }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const sorted = rows
    .map((row, originalIndex) => ({ row, originalIndex }))
    .sort((a, b) => toMinutes(a.row.times[0]) - toMinutes(b.row.times[0]))

  return (
    <ul className="schedule-list">
      {sorted.map(({ row, originalIndex }) => {
        const isNext = row.times[0] === nextDeparture
        const isPast = toMinutes(row.times[0]) < nowMinutes
        const isOpen = openIndex === originalIndex
        return (
          <li key={originalIndex} className="schedule-list__item">
            <button
              type="button"
              className={`schedule-list__row${isNext ? ' is-next' : ''}${isPast ? ' is-past' : ''}`}
              onClick={() => setOpenIndex(isOpen ? null : originalIndex)}
              aria-expanded={isOpen}
            >
              <span className="schedule-list__time">{row.times[0]}</span>
              <span className="schedule-list__dest">{direction.to}</span>
              {row.pmr && (
                <span className="schedule-list__pmr" title="Servicio adaptado a PMR">
                  ♿
                </span>
              )}
              {isNext && <span className="schedule-list__tag">PRÓXIMO</span>}
              <span className="schedule-list__chevron" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <ol className="schedule-list__stops">
                {direction.stops.map((stop, i) => (
                  <li key={stop}>
                    <span className="schedule-list__stop-time">{row.times[i]}</span>
                    <span className="schedule-list__stop-name">{stop}</span>
                  </li>
                ))}
              </ol>
            )}
          </li>
        )
      })}
      {sorted.length === 0 && (
        <li className="schedule-list__empty">No hay salidas para este tipo de día.</li>
      )}
    </ul>
  )
}
