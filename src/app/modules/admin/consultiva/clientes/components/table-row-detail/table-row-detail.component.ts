import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnInit,
    Input,
    ChangeDetectorRef,
    EventEmitter,
    Output,
    OnDestroy,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
    MatCheckboxModule,
    MatCheckboxChange,
} from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
    InventoryTag,
    InventoryVendor,
    InventoryBrand,
    InventoryCategory,
    InventoryProduct,
} from '../../clientes.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ClientesService } from '../../../clientes.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'table-row-detail',
    templateUrl: './table-row-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRippleModule,
        MatSlideToggleModule,
    ],
})
export class TableRowDetailComponent implements OnInit, OnDestroy {
    selectedProductForm: UntypedFormGroup;

    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;

    public selectedProduct: InventoryProduct | null = null;
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _clienteService: ClientesService,
    ) {}

    ngOnInit(): void {
        this.selectedProductForm = this._formBuilder.group({
            id: [''],
            category: [''],
            name: ['', [Validators.required]],
            description: [''],
            tags: [[]],
            sku: [''],
            barcode: [''],
            brand: [''],
            vendor: [''],
            stock: [''],
            reserved: [''],
            cost: [''],
            basePrice: [''],
            taxPercent: [''],
            price: [''],
            weight: [''],
            thumbnail: [''],
            images: [[]],
            currentImageIndex: [0],
            active: [false],
        });

        this._clienteService.selectedProduct$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((selectedProduct) => {
                this.selectedProduct = selectedProduct;
                this.selectedProductForm.patchValue(selectedProduct);
            });

        this._clienteService.brands$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((brands: InventoryBrand[]) => {
                this.brands = brands;

                this._changeDetectorRef.markForCheck();
            });

        this._clienteService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: InventoryCategory[]) => {
                this.categories = categories;

                this._changeDetectorRef.markForCheck();
            });

        this._clienteService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: InventoryTag[]) => {
                this.tags = tags;
                this.filteredTags = tags;

                this._changeDetectorRef.markForCheck();
            });

        this._clienteService.vendors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vendors: InventoryVendor[]) => {
                this.vendors = vendors;

                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    cycleImages(forward: boolean = true): void {
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex =
            this.selectedProductForm.get('currentImageIndex').value;

        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        if (forward) {
            this.selectedProductForm
                .get('currentImageIndex')
                .setValue(nextIndex);
        } else {
            this.selectedProductForm
                .get('currentImageIndex')
                .setValue(prevIndex);
        }
    }

    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    filterTags(event): void {
        const value = event.target.value.toLowerCase();

        this.filteredTags = this.tags.filter((tag) =>
            tag.title.toLowerCase().includes(value),
        );
    }

    filterTagsInputKeyDown(event): void {
        if (event.key !== 'Enter') {
            return;
        }

        if (this.filteredTags.length === 0) {
            this.createTag(event.target.value);

            event.target.value = '';

            return;
        }

        const tag = this.filteredTags[0];
        const isTagApplied = this.selectedProduct.tags.find(
            (id) => id === tag.id,
        );

        if (isTagApplied) {
            this.removeTagFromProduct(tag);
        } else {
            this.addTagToProduct(tag);
        }
    }

    createTag(title: string): void {
        const tag = {
            title,
        };

        this._clienteService.createTag(tag).subscribe((response) => {
            this.addTagToProduct(response);
        });
    }

    updateTagTitle(tag: InventoryTag, event): void {
        tag.title = event.target.value;

        this._clienteService
            .updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        this._changeDetectorRef.markForCheck();
    }

    deleteTag(tag: InventoryTag): void {
        this._clienteService.deleteTag(tag.id).subscribe();

        this._changeDetectorRef.markForCheck();
    }

    addTagToProduct(tag: InventoryTag): void {
        this.selectedProduct.tags.unshift(tag.id);

        this.selectedProductForm
            .get('tags')
            .patchValue(this.selectedProduct.tags);

        this._changeDetectorRef.markForCheck();
    }

    removeTagFromProduct(tag: InventoryTag): void {
        this.selectedProduct.tags.splice(
            this.selectedProduct.tags.findIndex((item) => item === tag.id),
            1,
        );

        this.selectedProductForm
            .get('tags')
            .patchValue(this.selectedProduct.tags);

        this._changeDetectorRef.markForCheck();
    }

    toggleProductTag(tag: InventoryTag, change: MatCheckboxChange): void {
        if (change.checked) {
            this.addTagToProduct(tag);
        } else {
            this.removeTagFromProduct(tag);
        }
    }

    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.tags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase(),
            ) > -1
        );
    }

    createProduct(): void {
        this._clienteService.createProduct().subscribe((newProduct) => {
            this.selectedProduct = newProduct;

            this.selectedProductForm.patchValue(newProduct);

            this._changeDetectorRef.markForCheck();
        });
    }

    updateSelectedProduct(): void {
        const product = this.selectedProductForm.getRawValue();

        delete product.currentImageIndex;

        this._clienteService
            .updateProduct(product.id, product)
            .subscribe(() => {
                this.showFlashMessage('success');
            });
    }

    deleteSelectedProduct(): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message:
                'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const product = this.selectedProductForm.getRawValue();

                this._clienteService.deleteProduct(product.id).subscribe(() => {
                    this._clienteService.setSelectedProduct(null);
                });
            }
        });
    }

    showFlashMessage(type: 'success' | 'error'): void {
        this.flashMessage = type;

        this._changeDetectorRef.markForCheck();

        setTimeout(() => {
            this.flashMessage = null;

            this._changeDetectorRef.markForCheck();
        }, 3000);
    }
}
