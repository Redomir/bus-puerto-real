import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { line6 } from './data/line6'
import type { Direction } from './data/line6'
import {
  dayTypeFromDate,
  dayTypeLabel,
  nextDeparture,
  rowsForDay,
  type DayType,
} from './lib/schedule'
import DayTypeSelector from './components/DayTypeSelector'
import NextDepartureCard from './components/NextDepartureCard'
import ScheduleList from './components/ScheduleList'

const [idaDirection, vueltaDirection] = line6.directions as [Direction, Direction]

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export default function App() {
  const now = useNow()
  const autoDayType = dayTypeFromDate(now)
  const [dayTypeOverride, setDayTypeOverride] = useState<DayType | null>(null)
  const dayType = dayTypeOverride ?? autoDayType

  const [activeDirectionId, setActiveDirectionId] = useState<'ida' | 'vuelta'>('ida')
  const activeDirection = activeDirectionId === 'ida' ? idaDirection : vueltaDirection

  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const nextIda = useMemo(
    () => nextDeparture(idaDirection, dayType, nowMinutes),
    [dayType, nowMinutes],
  )
  const nextVuelta = useMemo(
    () => nextDeparture(vueltaDirection, dayType, nowMinutes),
    [dayType, nowMinutes],
  )

  const rowsToday = useMemo(
    () => rowsForDay(activeDirection, dayType),
    [activeDirection, dayType],
  )

  const activeNext = activeDirectionId === 'ida' ? nextIda : nextVuelta

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__top">
          <span className="app-header__line">M-030</span>
          <h1 className="app-header__title">Bus Puerto Real</h1>
        </div>
        <p className="app-header__subtitle">{line6.name}</p>
      </header>

      <main className="app-main">
        <section className="section" aria-label="Tipo de día">
          <div className="section__label">
            {dayTypeOverride ? 'Mostrando horario para' : 'Hoy es'}:{' '}
            <strong>{dayTypeLabel(dayType)}</strong>
          </div>
          <DayTypeSelector
            value={dayType}
            isAuto={dayTypeOverride === null}
            onChange={setDayTypeOverride}
            onReset={() => setDayTypeOverride(null)}
          />
        </section>

        <section className="section" aria-label="Próximas salidas">
          <div className="next-cards">
            <NextDepartureCard direction={idaDirection} next={nextIda} />
            <NextDepartureCard direction={vueltaDirection} next={nextVuelta} />
          </div>
        </section>

        <section className="section" aria-label="Horario completo">
          <div className="direction-tabs" role="tablist" aria-label="Dirección">
            {line6.directions.map((d) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={activeDirectionId === d.id}
                className={`direction-tabs__tab${activeDirectionId === d.id ? ' is-active' : ''}`}
                onClick={() => setActiveDirectionId(d.id)}
              >
                {d.label}
                <span className="direction-tabs__route">
                  {d.from} → {d.to}
                </span>
              </button>
            ))}
          </div>

          <ScheduleList
            direction={activeDirection}
            rows={rowsToday}
            nextDeparture={activeNext && !activeNext.isTomorrow ? activeNext.departure : null}
            nowMinutes={nowMinutes}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Horario vigente desde el{' '}
          {new Date(line6.effectiveFrom).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
          . El tipo de día se detecta automáticamente (L-V / sábado / domingo); en festivos
          selecciona manualmente "Domingo / festivo".
        </p>
        <p>
          Datos oficiales del{' '}
          <a href={line6.sourceUrl} target="_blank" rel="noreferrer">
            Consorcio de Transportes de la Bahía de Cádiz
          </a>
          .
        </p>
      </footer>
    </div>
  )
}
