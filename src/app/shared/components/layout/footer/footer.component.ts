import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/shared/services/events.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    private readonly eventsService: EventsService,
    private readonly router: Router
  ) { }

  setSection( section: string ): void {

    this.eventsService.setSectionSelected( section );
    this.router.navigate(['/inicio'], {
      queryParams: {
        s: section
      }
    })
  }

}
