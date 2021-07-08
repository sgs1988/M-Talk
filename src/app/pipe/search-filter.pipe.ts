import { Pipe, PipeTransform } from '@angular/core';

// import { GInbox } from '../models/group.model';

@Pipe({ name: 'searchFilter' })
export class SearchFilterPipe implements PipeTransform {
  transform(items: any, searchText?: any): any {
    if (!items) {
      return null;
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((inbox: any, i: any) => {
      let searchName = '';
      searchName += inbox.firstName?.toLowerCase();
      searchName += inbox.lastName?.toLowerCase();
      const name = `${searchName}`;
      const lowerSearchText = searchText.toLowerCase();

      if (name.includes(lowerSearchText)) {
        return true;
      }

      return false;
    });
  }
}
