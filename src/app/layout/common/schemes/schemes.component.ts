import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FuseConfig, FuseConfigService, Scheme } from '@fuse/services/config';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'schemes',
  templateUrl: './schemes.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, FormsModule]
})
export class SchemesComponent implements OnInit, OnDestroy {

  config: FuseConfig;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _fuseConfigService: FuseConfigService) { }

  ngOnInit(): void {
    this._fuseConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: FuseConfig) => {
        this.config = config;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public get slideSetScheme(): boolean {

    this._fuseConfigService.config = { scheme: this.schemeStorage }

    return this.schemeStorage === "light";

  }

  public set slideSetScheme(v: boolean) {

    const scheme: Scheme = (v) ? 'light' : 'dark';

    this.schemeStorage = scheme;

    this._fuseConfigService.config = { scheme }

  }

  set schemeStorage(scheme: string) {

    localStorage.setItem('scheme', scheme);

  }

  get schemeStorage(): string {

    return localStorage.getItem('scheme') ?? 'light';

  }

}
