import { Routes } from "@angular/router";
import { InicioComponent } from "./inicio.component";
import { inject } from "@angular/core";
import { InicioService } from "./inicio.service";

export default [
    {
        path: '',
        component: InicioComponent,
        resolve  : {
            data: () => inject(InicioService).getData(),
        },
    }
] as Routes