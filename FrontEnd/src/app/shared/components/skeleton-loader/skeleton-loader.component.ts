import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="skeleton-loader" [style.width]="width" [style.height]="height" [class.circle]="circle"></div>
  `,
    styles: [`
    .skeleton-loader {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }

    .circle {
      border-radius: 50%;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
    @Input() width = '100%';
    @Input() height = '20px';
    @Input() circle = false;
}
