import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'loading-bar',
    templateUrl: './loading-bar.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [MatProgressBarModule],
})
export class LoadingBarComponent {}
