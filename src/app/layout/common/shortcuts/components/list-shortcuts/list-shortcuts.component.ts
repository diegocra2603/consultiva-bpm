import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Shortcut } from '../../shortcuts.types';
import { ItemShortcutComponent } from '../item-shortcut/item-shortcut.component';
import { ShortcutsService } from '../../shortcuts.service';
import { Subject, takeUntil } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { NoShortcutsComponent } from '../no-shortcuts/no-shortcuts.component';

@Component({
  selector: 'list-shortcuts',
  templateUrl: './list-shortcuts.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'list-shortcuts',
  standalone: true,
  imports: [NgFor, ItemShortcutComponent, NgIf, NoShortcutsComponent]
})
export class ListShortcutsComponent implements OnInit, OnDestroy {

  @Input() mode: Shortcut;

  public shortcuts: Shortcut[] = [];

  @Output() editShortcut: EventEmitter<Shortcut> = new EventEmitter<Shortcut>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private _overlayRef: OverlayRef;

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _shortcutsService: ShortcutsService) { }

  ngOnInit(): void {
    this._shortcutsService.shortcuts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((shortcuts: Shortcut[]) => {
        this.shortcuts = shortcuts;
        console.log(this.shortcuts);
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
