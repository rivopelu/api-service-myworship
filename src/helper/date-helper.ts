import { addHours } from 'date-fns';

export class DateHelper {
  public parseToUtc(date: Date, utc?: number) {
    return addHours(date, utc ? utc : 7);
  }
}
