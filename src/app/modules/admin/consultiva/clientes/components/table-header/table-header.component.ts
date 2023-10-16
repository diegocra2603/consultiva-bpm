import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef,
    EventEmitter,
    Output,
    Input,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';

import { fuseAnimations } from '@fuse/animations';
import { Subject, switchMap, takeUntil, map } from 'rxjs';
import { ClientesService } from '../../../clientes.service';

@Component({
    selector: 'table-header',
    templateUrl: './table-header.component.html',
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
    imports: [MatSortModule],
})
export class TableHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) private _sort: MatSort;
    private _unsubscribeAll: Subject<void> = new Subject<void>();
    private _paginator: MatPaginator;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _clienteService: ClientesService,
    ) {}

    ngOnInit(): void {
        this._clienteService.paginator$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((paginator) => (this._paginator = paginator));
    }

    ngAfterViewInit(): void {
        if (this._sort) {
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            this._changeDetectorRef.markForCheck();

            this._clienteService.setSort(this._sort);

            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    this._paginator.pageIndex = 0;
                    this._clienteService.setSelectedProduct(null);
                });

            this._sort.sortChange
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
