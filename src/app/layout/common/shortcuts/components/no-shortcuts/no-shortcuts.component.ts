import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'no-shortcuts',
  templateUrl: './no-shortcuts.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'no-shortcuts',
  standalone: true,
  imports: [MatIconModule]
})
export class NoShortcutsComponent {}
