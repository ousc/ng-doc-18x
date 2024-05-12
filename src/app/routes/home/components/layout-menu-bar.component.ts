import { Component } from '@angular/core';
import {MegaMenuItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {AppService} from "../../../app.service";
import {SharedModule} from "../../../shared.module";

@Component({
  selector: 'layout-menu-bar',
  imports: [
    SharedModule
  ],
  template: `
    <p-megaMenu [model]="items" [styleClass]="'border-none menu-bar p-0 pl-4'">
      <ng-template pTemplate="start">
        <img [routerLink]="['/']" src="https://cdn.leinbo.com/assets/images/kronos/logo_dark.png" class="logo" draggable="false"
             [style.width.px]="60" alt="logo"/>
        <span [routerLink]="['/']" class="logo">Kronos ORM</span>
      </ng-template>
      <ng-template pTemplate="item" let-item>
        <a *ngIf="item.root" pRipple [routerLink]="item.routerLink" routerLinkActive="p-menuitem-active"
           class="flex align-items-center p-menuitem-link cursor-pointer px-3 py-2 overflow-hidden relative font-semibold text-lg">
          <i [ngClass]="item.icon"></i>
          <span class="mx-2">{{ item.label | translate }}</span>
        </a>
        <a *ngIf="!item.root && !item.image" [routerLink]="item.routerLink" class="flex align-items-center p-3 cursor-pointer mb-2 gap-2">
                <span
                  class="inline-flex align-items-center justify-content-center border-circle bg-primary w-3rem h-3rem">
                    <i [ngClass]="item.icon + ' text-lg'"></i>
                </span>
          <span class="inline-flex flex-column gap-1">
                    <span class="font-medium text-lg text-900">{{ item.label }}</span>
                    <span class="white-space-nowrap">{{ item.subtext }}</span>
                </span>
        </a>
        <div [routerLink]="item.routerLink" *ngIf="item.image" class="flex flex-column align-items-start gap-3 p-2">
          <img [src]="item.image" alt="megamenu-demo" class="w-full"/>
          <span>{{ item.subtext }}</span>
          <p-button [label]="item.label" [outlined]="true"></p-button>
        </div>
      </ng-template>
      <ng-template pTemplate="end">
        <p-button
          [text]="true"
          class="mr-4"
          (click)="op.toggle($event)"
          icon="pi pi-language"/>
        <p-overlayPanel #op styleClass="m-0 p-0">
          <ul class="list-none m-0 p-0 w-12rem">
            @for (item of [{lang: 'zh-CN', label: '简体中文'}, {lang: 'en', label: 'English'}]; track $index) {
              <a class="block p-2 border-round hover:surface-hover w-full cursor-pointer flex"
                 (click)="setLang(item.lang)">
                <span class="font-bold text-900 flex-1">{{ item.label }}</span>
                <span class="ml-2 text-700 flex-1 text-right">
            <span class="pi pi-github"></span>
          </span>
              </a>
            }
          </ul>
        </p-overlayPanel>
        <p-button
          [text]="true"
          class="mr-4"
          icon="pi pi-github"/>
      </ng-template>
    </p-megaMenu>
  `,
  standalone: true,
  styles: [
    `
      :host ::ng-deep {
        .p-megamenu-start {
          margin-right: 24px;
        }

        .menu-bar {
          display: flex;
          background: linear-gradient(45deg, #832E3D 0%, #000 20%, #7F52FF 40%, #832E3D 60%, #000 80%, #7F52FF 100%);
          background-size: 500% 500%;
          animation: gradient 12s linear infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 100% 0
          }
          100% {
            background-position: 25% 100%
          }
        }

        .logo {
          cursor: pointer;
          mix-blend-mode: exclusion;
          transform-origin: center;
          vertical-align: middle;
          font-family: "Poppins", sans-serif;
          font-weight: bolder;

          &:hover {
            filter: grayscale(100%);
            opacity: 0.8;
            transition: .1s ease-in-out;
          }
        }

        .p-menuitem-active {
          color: rgba(255, 255, 255, 0.87);
          background: rgba(255, 255, 255, 0.2);
        }
      }
    `
  ]
})
export class LayoutMenuBarComponent {
  items: MegaMenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: "HOME",
        root: true,
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'DOCUMENTATION',
        icon: 'pi pi-book',
        root: true,
        items: [
          [
            {
              items: [
                {label: '特性', icon: 'pi pi-list', subtext: 'Subtext of item'},
                {label: '快速上手', icon: 'pi pi-users', subtext: 'Subtext of item'},
                {label: '配置指南', icon: 'pi pi-file', subtext: 'Subtext of item'}
              ]
            }
          ],
          [
            {
              items: [
                {label: '数据类型', icon: 'pi pi-shield', subtext: 'Subtext of item'},
                {label: '数据操作', icon: 'pi pi-question', subtext: 'Subtext of item'},
                {label: '数据库类型', icon: 'pi pi-search', subtext: 'Subtext of item'}
              ]
            }
          ],
          [
            {
              items: [
                {label: '异步任务', icon: 'pi pi-comments', subtext: 'Subtext of item'},
                {label: '第三方框架', icon: 'pi pi-star', subtext: 'Subtext of item'},
                {label: 'FAQ', icon: 'pi pi-globe', subtext: 'Subtext of item'}
              ]
            }
          ],
          [
            {
              items: [{
                image: 'https://cdn.leinbo.com/assets/images/kronos/code-cover.jpg',
                label: '快速上手',
                subtext: '立刻体验Kronos ORM',
                routerLink: ["/documentation/quick-start"]
              }]
            }
          ]
        ]
      },
      {
        label: 'RESOURCES',
        icon: 'pi pi-palette',
        root: true
      },
      {
        label: 'DISCUSSION',
        icon: 'pi pi-comments',
        root: true
      }
    ];
  }

  constructor(private translate: TranslateService, private appService: AppService) {
  }

  setLang(lang: string) {
    this.appService.language = lang; // update language
    this.translate.use(lang);
  }
}
