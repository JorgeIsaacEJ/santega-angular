import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'numberWithCommas'
})
export class NumberWithCommasPipe implements PipeTransform {

  transform( value: number ): string {

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}