import { Pipe, PipeTransform } from '@angular/core';
import { isToday, isYesterday } from '../shared/helper';

@Pipe({
  name: 'chatDate',
})
export class ChatDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    if (isToday(date)) {
      return 'Today';
    }

    return value;
  }
}
