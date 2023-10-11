import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IconsService
{
    private _icons: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient){}

    get icons(): Observable<any>
    {
        return this._icons.asObservable();
    }

    getIcons(): Observable<any>
    {
        const url = "api/ui/icons/heroicons-solid";

        return this._httpClient.get(url).pipe(
            tap((response: any) =>
            {
                this._icons.next(response);
            }),
        );
    }
}
