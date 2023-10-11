import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types';
import { Observable, ReplaySubject, Subject, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShortcutsService {

    private _shortcuts: ReplaySubject<Shortcut[]> = new ReplaySubject<Shortcut[]>(1);

    public set shortCutsLocalStorage(value: Shortcut[]) {
        localStorage.setItem('shortcuts', JSON.stringify(value))
    }

    constructor(private _httpClient: HttpClient) {}

    get shortcuts$(): Observable<Shortcut[]> {
        return this._shortcuts.asObservable();
    }

    getAll(): Observable<Shortcut[]> {
        return this._httpClient.get<Shortcut[]>('api/common/shortcuts').pipe(
            tap((shortcuts) => {
                this._shortcuts.next(shortcuts);
            }),
        );
    }

    create(shortcut: Shortcut): Observable<Shortcut> {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.post<Shortcut>('api/common/shortcuts', { shortcut }).pipe(
                map((newShortcut) => {
                    this._shortcuts.next([...shortcuts, newShortcut]);

                    this.shortCutsLocalStorage = [...shortcuts, newShortcut];
                    return newShortcut;
                }),
            )),
        );
    }

    update(id: string, shortcut: Shortcut): Observable<Shortcut> {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.patch<Shortcut>('api/common/shortcuts', {
                id,
                shortcut,
            }).pipe(
                map((updatedShortcut: Shortcut) => {
                    // Find the index of the updated shortcut
                    const index = shortcuts.findIndex(item => item.id === id);

                    // Update the shortcut
                    shortcuts[index] = updatedShortcut;

                    // Update the shortcuts
                    this.shortCutsLocalStorage = shortcuts;
                    this._shortcuts.next(shortcuts);

                    // Return the updated shortcut
                    return updatedShortcut;
                }),
            )),
        );
    }

    delete(id: string): Observable<boolean> {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.delete<boolean>('api/common/shortcuts', { params: { id } }).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted shortcut
                    const index = shortcuts.findIndex(item => item.id === id);

                    // Delete the shortcut
                    shortcuts.splice(index, 1);

                    // Update the shortcuts
                    this.shortCutsLocalStorage = shortcuts
                    this._shortcuts.next(shortcuts);
                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
}
