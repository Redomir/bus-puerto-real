import type { DayType } from '../lib/schedule'

const OPTIONS: { value: DayType; label: string; short: string }[] = [
  { value: 'L', label: 'Laborable', short: 'L-V' },
  { value: 'S', label: 'Sábado', short: 'S' },
  { value: 'D', label: 'Domingo / festivo', short: 'D' },
]

interface Props {
  value: DayType
  isAuto: boolean
  onChange: (dayType: DayType) => void
  onReset: () => void
}

export default function DayTypeSelector({ value, isAuto, onChange, onReset }: Props) {
  return (
    <div className="day-selector">
      <div className="day-selector__tabs" role="tablist" aria-label="Tipo de día">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={value === opt.value}
            className={`day-selector__tab${value === opt.value ? ' is-active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {!isAuto && (
        <button type="button" className="day-selector__reset" onClick={onReset}>
          Usar hoy automáticamente
        </button>
      )}
    </div>
  )
}
