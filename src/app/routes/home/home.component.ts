import {Component} from '@angular/core';
import {SharedModule} from "../../shared.module";
import {LayoutMenuBarComponent} from "./components/layout-menu-bar.component";
import {TranslateService} from "@ngx-translate/core";
import {CodemirrorComponent} from "../../components/codemirror.component";
import {Product, products} from "./products";
import {codes} from "./codes";

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
    LayoutMenuBarComponent,
    CodemirrorComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private translate: TranslateService) {
  }

  products: Product[] = products;
  result = [];

  cols!: Column[];

  ngOnInit() {
    this.cols = [
      {field: 'code', header: 'Code'},
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'quantity', header: 'Quantity'}
    ];
  }

  codes = codes;
  index = 0;
}
