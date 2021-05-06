
import { parseISO, format } from 'date-fns'

export default function DateTimeFormatter({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'p, d LLLL yyyy')}</time>
}
