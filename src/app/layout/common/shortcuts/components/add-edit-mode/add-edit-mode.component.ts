import { AsyncPipe, TitleCasePipe, NgForOf, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Shortcut } from '../../shortcuts.types';
import { ModeShortCut } from '../../contracts/types-shortcuts';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { IconsService } from '../../icon.service';

@Component({
    selector: 'add-edit-mode',
    templateUrl: './add-edit-mode.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'add-edit-mode',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatIconModule,
        MatButtonModule,
        NgIf,
        MatSelectModule,
        NgForOf,
        MatOptionModule,
        NgxMatSelectSearchModule,
        AsyncPipe,
        TitleCasePipe,
    ],
})
export class AddEditModeComponent {
    @Input() mode: ModeShortCut;

    @Input() set shortcut(value: Shortcut) {
        this.shortcutForm.patchValue(value);
    }

    @Output() save: EventEmitter<Shortcut> = new EventEmitter<Shortcut>();

    @Output() delete: EventEmitter<Shortcut> = new EventEmitter<Shortcut>();

    shortcutForm: UntypedFormGroup = this._formBuilder.group({
        id: [''],
        label: ['', [Validators.required]],
        description: [''],
        icon: ['', [Validators.required]],
        link: ['', [Validators.required]],
        useRouter: [false, [Validators.nullValidator]],
    });

    protected icons: any[] = [];

    public iconFilterCtrl: FormControl<string> = new FormControl<string>('');

    public filteredIcons: ReplaySubject<string[]> = new ReplaySubject<string[]>(
        1,
    );

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

    protected _onDestroy = new Subject<void>();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _iconsService: IconsService,
    ) {}

    ngOnInit(): void {
        this._iconsService.icons
            .pipe(takeUntil(this._onDestroy))
            .subscribe((icons) => {
                const namespace = icons.namespace;
                const iconsList = icons.list;
                this.icons = iconsList.map((icon) => ({ namespace, icon }));
            });

        this.filteredIcons.next(this.icons.slice());

        this.iconFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterIcons();
            });
    }

    setIconValue(value: string[]) {
        this.shortcutForm.controls['icon'].setValue(value.join(' '));
    }

    protected filterIcons() {
        if (!this.icons) {
            return;
        }

        let search = this.iconFilterCtrl.value;
        if (!search) {
            this.filteredIcons.next(this.icons.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredIcons.next(
            this.icons.filter(
                (string) => string.toLowerCase().indexOf(search) > -1,
            ),
        );
    }

    internalSave() {
        this.save.emit(this.shortcutForm.value);
        this.shortcutForm.reset();
    }
}
