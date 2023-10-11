import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ModeShortCut } from "../../contracts/types-shortcuts";
import { NgIf } from "@angular/common";

@Component({
    selector: 'header-shortcuts',
    templateUrl: './header-shortcuts.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'header-shortcuts',
    standalone: true,
    imports: [MatIconModule, NgIf]
})
export class HeaderShortcutsComponent {

    @Output() closePanel: EventEmitter<void> = new EventEmitter<void>()

    @Output() changeMode: EventEmitter<ModeShortCut> = new EventEmitter<ModeShortCut>()

    @Output() newShortcut: EventEmitter<void> = new EventEmitter<void>()

    @Input() mode : ModeShortCut = ModeShortCut.VIEW;

}