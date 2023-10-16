import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnInit,
    OnDestroy,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NgIf, NgFor, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { InventoryProduct } from '../../clientes.types';
import { ClientesService } from '../../../clientes.service';
import { MatIconModule } from '@angular/material/icon';
import { TableRowDetailComponent } from '../table-row-detail/table-row-detail.component';

@Component({
    selector: 'table-row',
    templateUrl: './table-row.component.html',
    styles: [
        `
            .inventory-grid {
                grid-template-columns: repeat(6, minmax(0, 1fr)) 40px;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        MatIconModule,
        CurrencyPipe,
        TableRowDetailComponent,
    ],
})
export class TableRowComponent implements OnInit, OnDestroy {
    products$: Observable<InventoryProduct[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    selectedProduct: InventoryProduct | null = null;

    constructor(
        private _clienteService: ClientesService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.products$ = this._clienteService.products$;

        this._clienteService.selectedProduct$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (selectedProduct) => (this.selectedProduct = selectedProduct),
            );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    toggleDetails(productId: string): void {
        if (this.selectedProduct && this.selectedProduct.id === productId) {
            this._clienteService.setSelectedProduct(null);
            return;
        }

        this._clienteService.getProductById(productId).subscribe((product) => {
            this._clienteService.setSelectedProduct(product);
            this._changeDetectorRef.markForCheck();
        });
    }
}
