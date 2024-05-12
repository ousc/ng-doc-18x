import { Component } from '@angular/core';
import {SharedModule} from "../../../shared.module";

@Component({
  selector: 'banner',
  imports: [
    SharedModule
  ],
  template: `
    <h1 class="text-6xl font-bold text-center xl:text-left">
      {{ "REDEFINE" | translate }}
      <span class="font-bold text-primary">Kotlin</span>
      <span class="font-bold text-purple-200 ml-3">ORM</span>
    </h1>
    <p class="section-detail xl:text-left text-center px-0 mt-0 mb-5">
      {{ ("DESCRIPTION1") | translate }}
    </p>
    <p class="section-detail xl:text-left text-center px-0 mt-0 mb-5">
      {{ ("DESCRIPTION2") | translate }}
    </p>
    <p class="section-detail xl:text-left text-center px-0 mt-0 mb-5">
      {{ ("DESCRIPTION3") | translate }}
    </p>
    <div class="flex align-items-center gap-3">
      <p-button [routerLink]="['/documentation/quick-start']" [label]="'GET_START' | translate" icon="pi pi-arrow-right" severity="info" size="large"/>
      <p-button severity="warning" size="large">
        <i class="pi pi-github mr-3"></i>
        <span>{{ "GIVE_A_STAR" | translate }}</span>
        <i class="pi pi-star-fill ml-3 text-yellow-500"></i>
      </p-button>
    </div>
  `,
  standalone: true,
  styles: []
})
export class BannerComponent {
}
