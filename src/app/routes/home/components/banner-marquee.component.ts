import { Component } from '@angular/core';
import {SharedModule} from "../../../shared.module";

@Component({
  selector: 'banner-marquee',
  imports: [
    SharedModule
  ],
  template: `
    <section class="banner-marquee-section relative banner-section-border">
      <div class="banner-marquee-container px-5 relative z-5 flex align-items-center p-overflow-hidden">
        <div class="fade-left h-10rem w-6rem block absolute top-0 left-0 z-2"
             style="background:linear-gradient(to right, #19191c, transparent)"></div>
        <div class="marquee-wrapper overflow-hidden flex">
          @for (i of [1,2,3];track i){
            <div class="marquee">
              <div><img src="/assets/images/banner-marquee/java.svg" height="80" alt="jvm"></div>
              <div><img src="/assets/images/banner-marquee/javascript.svg" height="60" alt="javascript"></div>
              <div><img src="/assets/images/banner-marquee/macos.svg" height="80" alt="macos"></div>
              <div><img src="/assets/images/banner-marquee/windows.svg" height="80" alt="windows"></div>
              <div><img src="/assets/images/banner-marquee/linux.svg" height="80" alt="linux"></div>
              <div><img src="/assets/images/banner-marquee/android.svg" height="80" alt="android"></div>
              <div><img src="/assets/images/banner-marquee/ios.svg" height="60" alt="ios"></div>
            </div>
          }
        </div>
        <div class="fade-right h-10rem w-6rem block absolute top-0 right-0 z-2"
             style="background:linear-gradient(to left, #19191c, transparent)"></div>
      </div>
    </section>
  `,
  standalone: true,
  styles: [`
    .marquee-wrapper {
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      gap: 3rem;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      padding-top: 2rem;
      padding-bottom: 2rem;

    }

    .banner-marquee-section .banner-marquee-container .marquee {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 3rem;
      min-width: 100%;
      animation: scrolls 30s linear infinite;
    }

    @keyframes scrolls {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    .banner-section-border:before {
      content: "";
      position: absolute;
      top: -2px;
      left: 0;
      right: 0;
      height: 2px;
      width: 100%;
      background: linear-gradient(90deg,rgba(0,67,238,.55),rgba(0,102,255,0) 60%,rgba(0,255,240,.45));
    }

    .banner-section-border:after {
      content: "";
      position: absolute;
      bottom: 2px;
      left: 0;
      right: 0;
      height: 2px;
      width: 100%;
      background: linear-gradient(90deg,rgba(0,67,238,.55),rgba(0,102,255,0) 60%,rgba(0,255,240,.45));
    }
  `]
})
export class BannerMarqueeComponent {
}