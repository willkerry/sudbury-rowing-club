
import { parseISO, format } from 'date-fns'

export default function DayDateFormatter({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'EEEE d LLLL yyyy')}</time>
}
