import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ModeShortCut } from '../../contracts/types-shortcuts';
import { Shortcut } from '../../shortcuts.types';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'item-shortcut',
  templateUrl: './item-shortcut.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'item-shortcut',
  standalone: true,
  imports : [NgIf, NgTemplateOutlet, MatIconModule, RouterLink]
})
export class ItemShortcutComponent {
  @Input() mode: ModeShortCut;

  @Input() shortcut: Shortcut;

  @Output() editShortcut: EventEmitter<Shortcut> = new EventEmitter<Shortcut>()

}
