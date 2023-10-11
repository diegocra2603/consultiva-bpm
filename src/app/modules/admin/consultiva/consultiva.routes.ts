import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { ClientesService } from "./clientes.service";
import { ClientesComponent } from "./clientes/clientes.component";
import { ClientesLisComponent } from "./clientes/list/clientes-list.component";

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'inventory',
    },
    {
        path     : 'clientes',
        component: ClientesComponent,
        children : [
            {
                path     : '',
                component: ClientesLisComponent,
                resolve  : {
                    brands    : () => inject(ClientesService).getBrands(),
                    categories: () => inject(ClientesService).getCategories(),
                    products  : () => inject(ClientesService).getProducts(),
                    tags      : () => inject(ClientesService).getTags(),
                    vendors   : () => inject(ClientesService).getVendors(),
                },
            },
        ],
    },
] as Routes;