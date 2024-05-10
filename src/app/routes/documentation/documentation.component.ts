import {Component} from '@angular/core';
import {SharedModule} from "../../shared.module";

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent {

}
