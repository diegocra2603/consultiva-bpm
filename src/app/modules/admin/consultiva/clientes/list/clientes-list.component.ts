import {
    AsyncPipe,
    CurrencyPipe,
    NgClass,
    NgFor,
    NgIf,
    NgTemplateOutlet,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import {
    InventoryProduct,
    InventoryBrand,
    InventoryCategory,
    InventoryTag,
    InventoryPagination,
    InventoryVendor,
} from '../clientes.types';
import { ClientesService } from '../../clientes.service';
import { LoadingBarComponent } from '../components/loading-bar/loading-bar.component';
import { HeaderComponent } from '../components/header/header.component';
import { TableHeaderComponent } from '../components/table-header/table-header.component';
import { TableRowComponent } from '../components/table-row/table-row.component';
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Component({
    selector: 'app-clientes-list',
    templateUrl: './clientes-list.component.html',
    styleUrls: ['./clientes-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        NgIf,
        MatProgressBarModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSortModule,
        NgFor,
        NgTemplateOutlet,
        MatPaginatorModule,
        NgClass,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRippleModule,
        AsyncPipe,
        CurrencyPipe,
        LoadingBarComponent,
        HeaderComponent,
        TableHeaderComponent,
        TableRowComponent,
        PaginatorComponent,
    ],
})
export class ClientesLisComponent implements OnInit {
    products$: Observable<InventoryProduct[]>;

    constructor(private _clientesService: ClientesService) {}

    ngOnInit(): void {
        this.products$ = this._clientesService.products$;
    }
}
