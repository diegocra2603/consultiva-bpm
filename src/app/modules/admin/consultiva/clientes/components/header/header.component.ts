import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../../clientes.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        NgIf,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class HeaderComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public isLoading: boolean;

    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(private _clienteService: ClientesService) {}

    ngOnInit(): void {
        this._clienteService.isLoading$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((isLoading) => (this.isLoading = isLoading));
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
