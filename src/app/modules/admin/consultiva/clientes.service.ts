import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    BehaviorSubject,
    Observable,
    tap,
    take,
    map,
    switchMap,
    throwError,
    of,
    filter,
} from 'rxjs';
import {
    InventoryBrand,
    InventoryCategory,
    InventoryPagination,
    InventoryProduct,
    InventoryTag,
    InventoryVendor,
} from './clientes/clientes.types';

@Injectable({
    providedIn: 'root',
})
export class ClientesService {
    private _brands: BehaviorSubject<InventoryBrand[] | null> =
        new BehaviorSubject(null);
    private _categories: BehaviorSubject<InventoryCategory[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    private _product: BehaviorSubject<InventoryProduct | null> =
        new BehaviorSubject(null);
    private _products: BehaviorSubject<InventoryProduct[] | null> =
        new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(
        null,
    );
    private _vendors: BehaviorSubject<InventoryVendor[] | null> =
        new BehaviorSubject(null);
    private _paginator: BehaviorSubject<MatPaginator | null> =
        new BehaviorSubject(null);
    private _sort: BehaviorSubject<MatSort | null> = new BehaviorSubject(null);
    private _selectedProduct: BehaviorSubject<InventoryProduct | null> =
        new BehaviorSubject(null);
    private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private _httpClient: HttpClient) {}

    get brands$(): Observable<InventoryBrand[]> {
        return this._brands.asObservable();
    }

    get categories$(): Observable<InventoryCategory[]> {
        return this._categories.asObservable();
    }

    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }

    get product$(): Observable<InventoryProduct> {
        return this._product.asObservable();
    }

    get products$(): Observable<InventoryProduct[]> {
        return this._products.asObservable();
    }

    get tags$(): Observable<InventoryTag[]> {
        return this._tags.asObservable();
    }

    get vendors$(): Observable<InventoryVendor[]> {
        return this._vendors.asObservable();
    }

    get paginator$(): Observable<MatPaginator> {
        return this._paginator.asObservable();
    }

    get sort$(): Observable<MatSort> {
        return this._sort.asObservable();
    }

    get selectedProduct$(): Observable<InventoryProduct> {
        return this._selectedProduct.asObservable();
    }

    get isLoading$(): Observable<boolean> {
        return this._isLoading.asObservable();
    }

    getBrands(): Observable<InventoryBrand[]> {
        return this._httpClient
            .get<InventoryBrand[]>('api/apps/ecommerce/inventory/brands')
            .pipe(
                tap((brands) => {
                    this._brands.next(brands);
                }),
            );
    }

    getCategories(): Observable<InventoryCategory[]> {
        return this._httpClient
            .get<InventoryCategory[]>('api/apps/ecommerce/inventory/categories')
            .pipe(
                tap((categories) => {
                    this._categories.next(categories);
                }),
            );
    }

    getProducts(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = '',
    ): Observable<{
        pagination: InventoryPagination;
        products: InventoryProduct[];
    }> {
        return this._httpClient
            .get<{
                pagination: InventoryPagination;
                products: InventoryProduct[];
            }>('api/apps/ecommerce/inventory/products', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._products.next(response.products);
                }),
            );
    }

    getProductById(id: string): Observable<InventoryProduct> {
        return this._products.pipe(
            take(1),
            map((products) => {
                const product = products.find((item) => item.id === id) || null;

                this._product.next(product);

                return product;
            }),
            switchMap((product) => {
                if (!product) {
                    return throwError(
                        'Could not found product with id of ' + id + '!',
                    );
                }

                return of(product);
            }),
        );
    }

    createProduct(): Observable<InventoryProduct> {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient
                    .post<InventoryProduct>(
                        'api/apps/ecommerce/inventory/product',
                        {},
                    )
                    .pipe(
                        map((newProduct) => {
                            this._products.next([newProduct, ...products]);

                            return newProduct;
                        }),
                    ),
            ),
        );
    }

    updateProduct(
        id: string,
        product: InventoryProduct,
    ): Observable<InventoryProduct> {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient
                    .patch<InventoryProduct>(
                        'api/apps/ecommerce/inventory/product',
                        {
                            id,
                            product,
                        },
                    )
                    .pipe(
                        map((updatedProduct) => {
                            const index = products.findIndex(
                                (item) => item.id === id,
                            );

                            products[index] = updatedProduct;

                            this._products.next(products);

                            return updatedProduct;
                        }),
                        switchMap((updatedProduct) =>
                            this.product$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    this._product.next(updatedProduct);

                                    return updatedProduct;
                                }),
                            ),
                        ),
                    ),
            ),
        );
    }

    deleteProduct(id: string): Observable<boolean> {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient
                    .delete('api/apps/ecommerce/inventory/product', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            const index = products.findIndex(
                                (item) => item.id === id,
                            );

                            products.splice(index, 1);

                            this._products.next(products);

                            return isDeleted;
                        }),
                    ),
            ),
        );
    }

    getTags(): Observable<InventoryTag[]> {
        return this._httpClient
            .get<InventoryTag[]>('api/apps/ecommerce/inventory/tags')
            .pipe(
                tap((tags) => {
                    this._tags.next(tags);
                }),
            );
    }

    createTag(tag: InventoryTag): Observable<InventoryTag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .post<InventoryTag>('api/apps/ecommerce/inventory/tag', {
                        tag,
                    })
                    .pipe(
                        map((newTag) => {
                            this._tags.next([...tags, newTag]);

                            return newTag;
                        }),
                    ),
            ),
        );
    }

    updateTag(id: string, tag: InventoryTag): Observable<InventoryTag> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .patch<InventoryTag>('api/apps/ecommerce/inventory/tag', {
                        id,
                        tag,
                    })
                    .pipe(
                        map((updatedTag) => {
                            const index = tags.findIndex(
                                (item) => item.id === id,
                            );

                            tags[index] = updatedTag;

                            this._tags.next(tags);

                            return updatedTag;
                        }),
                    ),
            ),
        );
    }

    deleteTag(id: string): Observable<boolean> {
        return this.tags$.pipe(
            take(1),
            switchMap((tags) =>
                this._httpClient
                    .delete('api/apps/ecommerce/inventory/tag', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            const index = tags.findIndex(
                                (item) => item.id === id,
                            );

                            tags.splice(index, 1);

                            this._tags.next(tags);

                            return isDeleted;
                        }),
                        filter((isDeleted) => isDeleted),
                        switchMap((isDeleted) =>
                            this.products$.pipe(
                                take(1),
                                map((products) => {
                                    products.forEach((product) => {
                                        const tagIndex = product.tags.findIndex(
                                            (tag) => tag === id,
                                        );

                                        if (tagIndex > -1) {
                                            product.tags.splice(tagIndex, 1);
                                        }
                                    });

                                    return isDeleted;
                                }),
                            ),
                        ),
                    ),
            ),
        );
    }

    getVendors(): Observable<InventoryVendor[]> {
        return this._httpClient
            .get<InventoryVendor[]>('api/apps/ecommerce/inventory/vendors')
            .pipe(
                tap((vendors) => {
                    this._vendors.next(vendors);
                }),
            );
    }

    setPaginator(paginator: MatPaginator): void {
        this._paginator.next(paginator);
    }

    setSort(sort: MatSort): void {
        this._sort.next(sort);
    }

    setSelectedProduct(product: InventoryProduct | null): void {
        this._selectedProduct.next(product);
    }

    setIsLoading(state: boolean): void {
        this._isLoading.next(state);
    }
}
