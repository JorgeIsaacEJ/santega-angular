import { Component, Input } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.scss']
})
export class AvisoComponent {

  @Input('nombre') usuario : string = 'Usuario del Sitio Web';

  exportAllToPDF(htmlView: HTMLElement) {
    const doc = new jsPDF({
      format: 'letter'
    });

    doc.html(htmlView, {
      callback: (doc: jsPDF) => {
        doc.deletePage(doc.getNumberOfPages());
        doc.save('Aviso-de-privacidad');
      }
    });
  }
}
