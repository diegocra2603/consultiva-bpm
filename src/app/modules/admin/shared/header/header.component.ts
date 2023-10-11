import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports        : [TranslocoModule, MatIconModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTabsModule, MatButtonToggleModule, NgApexchartsModule, NgFor, NgIf, MatTableModule, NgClass, CurrencyPipe],
})
export class HeaderComponent {
  selectedProject: string = 'ACME Corp. Backend App';
  @Input() titulo:string = "";

}
