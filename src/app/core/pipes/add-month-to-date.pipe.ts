import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'addMonthToDate'
})
export class AddMonthToDatePipe implements PipeTransform {

  transform( value: Date ): Date {

    let d = new Date( value );
    d.setMonth(d.getMonth() + 1); 

    return d;
  }
}