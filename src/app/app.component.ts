import {Component, OnInit} from '@angular/core';
import {SharedModule} from "./shared.module";
import {PrimeNGConfig} from 'primeng/api';
import {TranslateService} from "@ngx-translate/core";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppService]
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig, private translate: TranslateService, private appService: AppService) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translate.setDefaultLang(this.appService.language);
  }
}
