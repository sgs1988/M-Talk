import { Pipe, PipeTransform } from '@angular/core';

import { IUser } from '../models/user.model';

@Pipe({ name: 'contactFilter' })
export class ContactFilterPipe implements PipeTransform {
  transform(items: IUser[], searchText: string): IUser[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    return items.filter((user) => {
      const lowerFirst = user.firstName.toLowerCase();
      const lowerLast = user.lastName.toLowerCase();
      const name = `${lowerFirst} ${lowerLast}`;
      const lowerSearchText = searchText.toLowerCase();

      if (name.includes(lowerSearchText)) {
        return true;
      }

      return false;
    });
  }
}
