import {
  Component, OnInit, ViewChild,
} from '@angular/core';
import {SharedModule} from "../../../../shared.module";
import {Product, products} from "./products";
import {$exec, Command, commands} from "./commands";
import {Terminal, TerminalService} from "primeng/terminal";
import {TranslateService} from "@ngx-translate/core";
import {CodemirrorComponent} from "../../../../components/codemirror.component";
import {Table} from "primeng/table";

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'online-editing',
  imports: [
    SharedModule,
    CodemirrorComponent
  ],
  template: `
    <div class="card">
      <p-table
        #tableInstance
        styleClass="p-datatable-sm p-datatable-gridlines border-1 border-gray-700"
        [resizableColumns]="true"
        dataKey="code"
        [(selection)]="selectedProducts"
        [columns]="cols"
        [value]="products"
        [scrollable]="true"
        scrollHeight="300px"
        [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
            <th pResizableColumn *ngFor="let col of columns">
              {{ col.header }}
            </th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product let-rowIndex="rowIndex" let-columns="columns" let-editing="editing">
          <tr [pSelectableRow]="product" [pSelectableRowIndex]="rowIndex">
            <td>
              <p-tableCheckbox [value]="product" />
            </td>
            <td *ngFor="let col of columns" [pEditableColumn]="product[col.field]" [pEditableColumnField]="col.field">
              <p-cellEditor>
                <ng-template pTemplate="input">
                  <input
                    class="p-inputtext-sm"
                    pInputText
                    type="text"
                    [(ngModel)]="product[col.field]" />
                </ng-template>
                <ng-template pTemplate="output">
                  {{ product[col.field] }}
                </ng-template>
              </p-cellEditor>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
    <div class="card">
      <p-tabView
        styleClass="border-1 border-gray-700 p-0 my-4"
        [(activeIndex)]="index">
        @for (command of commands; let i = $index; track i) {
          <p-tabPanel>
            <ng-template pTemplate="header">
              <span class="p-menuitem-icon" [class]="command.icon"></span>
              <span class="ml-2 ng-star-inserted">
                      {{ command.label | translate }}
                    </span>
            </ng-template>
            @if (i == index) {
              <div class="flex w-full" style="height: 288px;overflow: scroll">
                <div class="run-column flex-shrink-0" style="margin-top: 4px">
                  @for (index of [].constructor(command.rowNum); let j = $index; track j) {
                    <div class="w-2rem text-center" style="height: 1.4rem; line-height: 1.6rem">
                      @if (!!command.slice?.[j]) {
                        <span [pTooltip]="'RUN' | translate" (click)="run(command, j)" showDelay="300"
                              tooltipPosition="left" class="pi pi-play text-green-500 cursor-pointer"></span>
                      }
                      @if (command.tip[j]) {
                        <span [pTooltip]="command.tip[j] | translate" showDelay="300"
                              class="pi pi-question-circle text-blue-500 cursor-pointer"></span>
                      }
                    </div>
                  }
                </div>
                <codemirror styleClass="flex-grow-1 max-w-full" [disabled]="true" [(ngModel)]="command.doc"/>
              </div>
            }
          </p-tabPanel>
        }
      </p-tabView>
      <p-terminal #terminalInstance [style]="{'white-space': 'pre-wrap', 'font-family': 'Hack'}"
                  [welcomeMessage]="'TERMINAL_WELCOME' | translate" prompt="Kronos $"/>
    </div>
  `,
  standalone: true,
  styles: [
    `
      :host {
        width: 100%;
      }

      .logo {
        mix-blend-mode: color-dodge;
        transform: scale(2.5);
      }
    `
  ]
})
export class OnlineEditingComponent implements OnInit {
  products: Product[] = products;
  selectedProducts: Product[] = [];

  cols!: Column[];

  commands = commands;
  index = 1;
  @ViewChild("terminalInstance") terminalInstance: Terminal | undefined;
  @ViewChild("tableInstance") tableInstance: Table | undefined;

  constructor(private translate: TranslateService, private terminal: TerminalService) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'code', header: 'Code'},
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'quantity', header: 'Quantity'}
    ];
    this.terminal.commandHandler.subscribe((command) => {
      if (command === 'clear') {
        this.terminalInstance!.commands = [];
        return;
      }
      if (command === 'help') {
        this.terminal.sendResponse(
          [
            "execute-[command] --task=[task-no]",
            "Usage:",
            "execute-select --task=[task-no]\t\trun select task",
            "execute-insert --task=[task-no]\t\trun insert task",
            "execute-update --task=[task-no]\t\trun update task",
            "execute-delete --task=[task-no]\t\trun delete task",
            "execute-upsert --task=[task-no]\t\trun upsert task"
          ].join("\n")
        );
        return;
      }
      let response = $exec[command] ? $exec[command](this.products, (data, selected) => {
        this.products = data || this.products;
        this.selectedProducts = selected || [];
        if(this.selectedProducts.length > 0){
          setTimeout(() => {
            this.tableInstance!.scrollTo({
              top: (this.products.indexOf(this.selectedProducts[0])) * 41,
              behavior: "smooth",
            });
          }, 500);
        }
      }) : [`Command not found ${command}`];
      this.terminal.sendResponse("Loading...");
      setTimeout(() => {
        this.terminal.sendResponse(response.join("\n"));
        this.terminalInstance!.cd.detectChanges();
      }, 500);
    });
  }

  run(cmd: Command, index: number) {
    this.terminalInstance!.command = cmd.slice![index];
    let event = {keyCode: 13};
    this.terminalInstance!.handleCommand(event as KeyboardEvent);
    this.terminalInstance!.cd.detectChanges();
  }
}
