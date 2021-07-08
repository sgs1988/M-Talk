import { Pipe, PipeTransform } from '@angular/core';

import { IInbox } from '../models/inbox.model';

@Pipe({ name: 'inboxFilter' })
export class InboxFilterPipe implements PipeTransform {
  transform(items: IInbox[], searchText: string): IInbox[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    return items.filter((inbox) => {
      const lowerFirst = inbox.sender.firstName?.toLowerCase();
      const lowerLast = inbox.sender.lastName?.toLowerCase();
      const name = `${lowerFirst} ${lowerLast}`;
      const lowerSearchText = searchText.toLowerCase();

      if (name.includes(lowerSearchText)) {
        return true;
      }

      return false;
    });
  }
}
