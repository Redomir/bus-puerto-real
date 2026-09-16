import type { DayCode, Direction, ScheduleRow } from '../data/line6'

/** Tipo de día "laborable" (L), sábado (S) o domingo/festivo (D). */
export type DayType = 'L' | 'S' | 'D'

const DAY_TYPE_MEMBERS: Record<DayCode, DayType[]> = {
  'L-V': ['L'],
  S: ['S'],
  D: ['D'],
  'S-D-F': ['S', 'D'],
  'L-S': ['L', 'S'],
  'L-D': ['L', 'S', 'D'],
}

export function dayTypeLabel(dayType: DayType): string {
  switch (dayType) {
    case 'L':
      return 'Laborable (L-V)'
    case 'S':
      return 'Sábado'
    case 'D':
      return 'Domingo / festivo'
  }
}

/** Deriva el tipo de día a partir de la fecha del sistema. No conoce festivos: para
 * esos días el usuario debe seleccionar manualmente "Domingo / festivo". */
export function dayTypeFromDate(date: Date): DayType {
  const day = date.getDay() // 0 = domingo, 6 = sábado
  if (day === 0) return 'D'
  if (day === 6) return 'S'
  return 'L'
}

export function rowAppliesToDay(row: ScheduleRow, dayType: DayType): boolean {
  return DAY_TYPE_MEMBERS[row.dayCode].includes(dayType)
}

export function rowsForDay(direction: Direction, dayType: DayType): ScheduleRow[] {
  return direction.rows.filter((r) => rowAppliesToDay(r, dayType))
}

/** Minutos desde medianoche para una hora "HH:MM". */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export interface NextDeparture {
  row: ScheduleRow
  departure: string
  /** Minutos hasta la salida (puede ser >=1440 si es la de mañana). */
  minutesUntil: number
  isTomorrow: boolean
}

/** Siguiente salida para una dirección dado un tipo de día y una hora "ahora" (minutos desde medianoche). */
export function nextDeparture(
  direction: Direction,
  dayType: DayType,
  nowMinutes: number,
): NextDeparture | null {
  const todays = rowsForDay(direction, dayType)
    .slice()
    .sort((a, b) => toMinutes(a.times[0]) - toMinutes(b.times[0]))

  const upcoming = todays.find((r) => toMinutes(r.times[0]) >= nowMinutes)
  if (upcoming) {
    return {
      row: upcoming,
      departure: upcoming.times[0],
      minutesUntil: toMinutes(upcoming.times[0]) - nowMinutes,
      isTomorrow: false,
    }
  }

  // No quedan salidas hoy: buscamos la primera de mañana (puede ser otro tipo de día).
  const tomorrowType = nextDayType(dayType)
  const tomorrowRows = rowsForDay(direction, tomorrowType)
    .slice()
    .sort((a, b) => toMinutes(a.times[0]) - toMinutes(b.times[0]))
  const first = tomorrowRows[0]
  if (!first) return null

  return {
    row: first,
    departure: first.times[0],
    minutesUntil: 1440 - nowMinutes + toMinutes(first.times[0]),
    isTomorrow: true,
  }
}

function nextDayType(dayType: DayType): DayType {
  if (dayType === 'L') return 'L' // el día siguiente a un laborable puede ser laborable o sábado; asumimos laborable
  if (dayType === 'S') return 'D'
  return 'L'
}

export function formatMinutes(minutes: number): string {
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
