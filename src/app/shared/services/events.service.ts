import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

    public loader = new BehaviorSubject( false );
    loader$ = this.loader.asObservable();

    public sectionSelected = new BehaviorSubject('');
    sectionSelected$ = this.sectionSelected.asObservable();

    loaderToggleActive( value: boolean ): void {
        this.loader.next( value );
    }

    setSectionSelected( section: string ): void {
        this.sectionSelected.next( section );
    }
}
