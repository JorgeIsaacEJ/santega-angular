import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimateService {

  rippleEffect( 
    e: any,
    el: any
  ): void {
    e = e.touches ? e.touches[0] : e;
    const r = el.getBoundingClientRect(), d = Math.sqrt(Math.pow(r.width, 2.3) + Math.pow(r.height, 2)) * 2;
    el.style.cssText = `--s: 0; --o: 1;`;
    el.offsetTop;
    el.style.cssText = `--t: 1; --o: 0; --d: ${d}; --x:${e.clientX - r.left}; --y:${e.clientY - r.top};`;
  }

  toggleAnimation( 
    element: Element, 
    show: boolean, 
    property: string, 
    firstValue: string, 
    secondValue: string, 
    duration: number 
  ): void {

    if( show ) {
      element.animate([
          { [property]: firstValue },
          { [property]: secondValue }
      ], {
          duration,
          easing: 'ease-in-out',
          iterations: 1,
          direction: 'alternate',
          fill: 'forwards'
      });

    } else {

      element.animate([
        { [property]: secondValue },
        { [property]: firstValue }
      ], {
        duration,
        easing: 'ease-in-out',
        iterations: 1,
        direction: 'alternate',
        fill: 'forwards'
      });
    }
  }
}
