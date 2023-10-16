import {
    AfterViewInit,
    Component,
    OnInit,
    ChangeDetectorRef,
    ViewChild,
    OnDestroy,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ClientesService } from '../../../clientes.service';
import { Subject, switchMap, takeUntil, map } from 'rxjs';
import { InventoryPagination } from '../../clientes.types';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { NgClass } from '@angular/common';

@Component({
    selector: 'paginator',
    templateUrl: './paginator.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [MatPaginatorModule, NgClass],
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    private _sort: MatSort;
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    public pagination: InventoryPagination;
    public isLoading: boolean;

    constructor(
        private _clienteService: ClientesService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this._clienteService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        this._clienteService.sort$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((sort) => (this._sort = sort));

        this._clienteService.isLoading$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((isLoading) => (this.isLoading = isLoading));
    }

    ngAfterViewInit(): void {
        if (this._paginator) {
            this._changeDetectorRef.markForCheck();

            this._clienteService.setPaginator(this._paginator);

            this._paginator.page
                .pipe(
                    switchMap(() => {
                        this._clienteService.setSelectedProduct(null);
                        this._clienteService.setIsLoading(true);

                        return this._clienteService.getProducts(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction,
                        );
                    }),
                    map(() => {
                        this._clienteService.setIsLoading(false);
                    }),
                )
                .subscribe();
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
