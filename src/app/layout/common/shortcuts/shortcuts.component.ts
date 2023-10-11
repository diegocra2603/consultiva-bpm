import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types';
import { HeaderShortcutsComponent } from './components/header-shortcuts/header-shortcuts.component';
import { ModeShortCut } from './contracts/types-shortcuts';
import { AddEditModeComponent } from './components/add-edit-mode/add-edit-mode.component';
import { NoShortcutsComponent } from './components/no-shortcuts/no-shortcuts.component';
import { ListShortcutsComponent } from './components/list-shortcuts/list-shortcuts.component';

@Component({
    selector: 'shortcuts',
    templateUrl: './shortcuts.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'shortcuts',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, NgIf, MatTooltipModule, NgFor, NgClass, NgTemplateOutlet, RouterLink, MatSlideToggleModule, HeaderShortcutsComponent, AddEditModeComponent, NoShortcutsComponent, ListShortcutsComponent],
})
export class ShortcutsComponent {
    @ViewChild('shortcutsOrigin') private _shortcutsOrigin: MatButton;
    @ViewChild('shortcutsPanel') private _shortcutsPanel: TemplateRef<any>;

    mode: ModeShortCut = ModeShortCut.VIEW;

    public shortcuts: Shortcut[];

    public shortcutToEdit: Shortcut;

    private _overlayRef: OverlayRef;

    constructor(
        private _shortcutsService: ShortcutsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
    ) { }

    openPanel(): void {
        if (!this._shortcutsPanel || !this._shortcutsOrigin) {
            return;
        }

        this.mode = ModeShortCut.VIEW;

        if (!this._overlayRef) {
            this._createOverlay();
        }

        this._overlayRef.attach(new TemplatePortal(this._shortcutsPanel, this._viewContainerRef));
    }

    closePanel(): void {
        this._overlayRef.detach();
    }

    changeMode(mode: ModeShortCut.VIEW): void {
        this.mode = mode;
    }

    newShortcut(): void {
        this.mode = ModeShortCut.ADD;
    }

    editShortcut(shortcut: Shortcut): void {
        this.shortcutToEdit = shortcut;
        this.mode = ModeShortCut.EDIT;
    }

    save(shortcut: Shortcut): void {

        if (shortcut.id) {
            this._shortcutsService.update(shortcut.id, shortcut).subscribe();
        }

        else {
            this._shortcutsService.create(shortcut).subscribe()
        }

        this.mode = ModeShortCut.VIEW;
    }

    delete(shortcut: Shortcut): void {
        this._shortcutsService.delete(shortcut.id).subscribe();
        this.mode = ModeShortCut.MODIFY;
    }

    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._shortcutsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }
}
