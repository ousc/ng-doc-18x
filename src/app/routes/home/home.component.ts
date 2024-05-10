import {AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {SharedModule} from "../../shared.module";
import {LayoutMenuBarComponent} from "./components/layout-menu-bar.component";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {EditorState, Extension} from "@codemirror/state";
import {oneDark} from "@codemirror/theme-one-dark";
import {EditorView} from "@codemirror/view";
import {kotlin} from '@codemirror/legacy-modes/mode/clike';
import {basicSetup} from 'codemirror';
import {StreamLanguage} from "@codemirror/language";
import {MenuItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

interface Column {
  field: string;
  header: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
    LayoutMenuBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit{
  constructor(private translate: TranslateService) {
  }

  products!: Product[];

  cols!: Column[];

  ngOnInit() {
    this.products = [
      {
        "id": "1000",
        "code": "f230fh0g3",
        "name": "Bamboo Watch",
        "description": "Product Description",
        "image": "bamboo-watch.jpg",
        "price": 65,
        "category": "Accessories",
        "quantity": 24,
        "inventoryStatus": "INSTOCK",
        "rating": 5
      },
      {
        "id": "1001",
        "code": "djkf9843k",
        "name": "Leather Wallet",
        "description": "Stylish leather wallet",
        "image": "leather-wallet.jpg",
        "price": 45,
        "category": "Accessories",
        "quantity": 18,
        "inventoryStatus": "INSTOCK",
        "rating": 4
      },
      {
        "id": "1002",
        "code": "wkej349dk",
        "name": "Silver Bracelet",
        "description": "Elegant silver bracelet",
        "image": "silver-bracelet.jpg",
        "price": 80,
        "category": "Jewelry",
        "quantity": 12,
        "inventoryStatus": "INSTOCK",
        "rating": 4.5
      },
      {
        "id": "1003",
        "code": "ie943kfw0",
        "name": "Sunglasses",
        "description": "UV protection sunglasses",
        "image": "sunglasses.jpg",
        "price": 55,
        "category": "Accessories",
        "quantity": 30,
        "inventoryStatus": "INSTOCK",
        "rating": 4
      }, {
        "id": "1004",
        "code": "jgk345gk2",
        "name": "Leather Bag",
        "description": "Stylish leather bag",
        "image": "leather-bag.jpg",
        "price": 120,
        "category": "Bags",
        "quantity": 10,
        "inventoryStatus": "INSTOCK",
        "rating": 4.2
      },
      {
        "id": "1005",
        "code": "fj39dkf94",
        "name": "Smart Watch",
        "description": "Intelligent smart watch",
        "image": "smart-watch.jpg",
        "price": 150,
        "category": "Electronics",
        "quantity": 15,
        "inventoryStatus": "INSTOCK",
        "rating": 4.8
      },
      {
        "id": "1006",
        "code": "dkj349dj3",
        "name": "Diamond Ring",
        "description": "Exquisite diamond ring",
        "image": "diamond-ring.jpg",
        "price": 500,
        "category": "Jewelry",
        "quantity": 5,
        "inventoryStatus": "INSTOCK",
        "rating": 4.9
      },
      {
        "id": "1007",
        "code": "3j4k9dk43",
        "name": "Headphones",
        "description": "High-quality headphones",
        "image": "headphones.jpg",
        "price": 80,
        "category": "Electronics",
        "quantity": 20,
        "inventoryStatus": "INSTOCK",
        "rating": 4.5
      },
      {
        "id": "1008",
        "code": "fj39dkf94",
        "name": "Backpack",
        "description": "Spacious backpack",
        "image": "backpack.jpg",
        "price": 70,
        "category": "Bags",
        "quantity": 25,
        "inventoryStatus": "INSTOCK",
        "rating": 4.3
      },
      {
        "id": "1009",
        "code": "dkj349dj3",
        "name": "Silver Earrings",
        "description": "Elegant silver earrings",
        "image": "silver-earrings.jpg",
        "price": 40,
        "category": "Jewelry",
        "quantity": 15,
        "inventoryStatus": "INSTOCK",
        "rating": 4.6
      },
      {
        "id": "1010",
        "code": "3j4k9dk43",
        "name": "Wireless Mouse",
        "description": "Ergonomic wireless mouse",
        "image": "wireless-mouse.jpg",
        "price": 25,
        "category": "Electronics",
        "quantity": 35,
        "inventoryStatus": "INSTOCK",
        "rating": 4.2
      },
      {
        "id": "1011",
        "code": "fj39dkf94",
        "name": "Travel Bag",
        "description": "Durable travel bag",
        "image": "travel-bag.jpg",
        "price": 90,
        "category": "Bags",
        "quantity": 8,
        "inventoryStatus": "INSTOCK",
        "rating": 4.0
      },
      {
        "id": "1012",
        "code": "dkj349dj3",
        "name": "Gold Necklace",
        "description": "Luxurious gold necklace",
        "image": "gold-necklace.jpg",
        "price": 300,
        "category": "Jewelry",
        "quantity": 7,
        "inventoryStatus": "INSTOCK",
        "rating": 4.8
      },
      {
        "id": "1013",
        "code": "3j4k9dk43",
        "name": "Bluetooth Speaker",
        "description": "Portable Bluetooth speaker",
        "image": "bluetooth-speaker.jpg",
        "price": 70,
        "category": "Electronics",
        "quantity": 15,
        "inventoryStatus": "INSTOCK",
        "rating": 4.4
      },
      {
        "id": "1014",
        "code": "fj39dkf94",
        "name": "Laptop Bag",
        "description": "Stylish laptop bag",
        "image": "laptop-bag.jpg",
        "price": 50,
        "category": "Bags",
        "quantity": 20,
        "inventoryStatus": "INSTOCK",
        "rating": 4.1
      },
      {
        "id": "1015",
        "code": "dkj349dj3",
        "name": "Pearl Bracelet",
        "description": "Beautiful pearl bracelet",
        "image": "pearl-bracelet.jpg",
        "price": 70,
        "category": "Jewelry",
        "quantity": 12,
        "inventoryStatus": "INSTOCK",
        "rating": 4.7
      },
      {
        "id": "1016",
        "code": "3j4k9dk43",
        "name": "Digital Camera",
        "description": "High-resolution digital camera",
        "image": "digital-camera.jpg",
        "price": 200,
        "category": "Electronics",
        "quantity": 10,
        "inventoryStatus": "INSTOCK",
        "rating": 4.6
      },
      {
        "id": "1017",
        "code": "fj39dkf94",
        "name": "Tote Bag",
        "description": "Stylish tote bag",
        "image": "tote-bag.jpg",
        "price": 60,
        "category": "Bags",
        "quantity": 15,
        "inventoryStatus": "INSTOCK",
        "rating": 4.2
      },
      {
        "id": "1018",
        "code": "dkj349dj3",
        "name": "Diamond Necklace",
        "description": "Exquisite diamond necklace",
        "image": "diamond-necklace.jpg",
        "price": 600,
        "category": "Jewelry",
        "quantity": 4,
        "inventoryStatus": "INSTOCK",
        "rating": 4.9
      },
      {
        "id": "1019",
        "code": "3j4k9dk43",
        "name": "Wireless Headphones",
        "description": "Wireless noise-canceling headphones",
        "image": "wireless-headphones.jpg",
        "price": 120,
        "category": "Electronics",
        "quantity": 8,
        "inventoryStatus": "INSTOCK",
        "rating": 4.7
      }
    ]

    this.cols = [
      {field: 'code', header: 'Code'},
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'quantity', header: 'Quantity'}
    ];
    this.items = [
      { label: 'SELECT', icon: 'pi pi-check' },
      { label: 'INSERT', icon: 'pi pi-plus' },
      { label: 'UPDATE', icon: 'pi pi-pencil' },
      { label: 'DELETE', icon: 'pi pi-trash' },
      { label: 'UPSERT', icon: 'pi pi-sync' }
    ];

    this.activeItem = this.items[0];
  }


  @ViewChild('ktEditor') ktEditor: any;

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      let editorEle = this.ktEditor.nativeElement;
      let ext: Extension = [basicSetup, StreamLanguage.define(kotlin), oneDark];
      let state!: EditorState;

      try {
        state = EditorState.create({
          doc: '\nuser.select().where().execute();\n\n\n\n\n',
          extensions: ext,
        });
      } catch (e) {
        console.error(e);
      }

      new EditorView({
        state,
        parent: editorEle,
      });
    }
  }
  items: MenuItem[] | undefined;

  activeItem: MenuItem | undefined;

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }
}
