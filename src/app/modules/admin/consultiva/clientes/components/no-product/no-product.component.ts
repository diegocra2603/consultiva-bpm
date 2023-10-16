import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-no-product',
    templateUrl: './no-product.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
})
export class NoProductComponent {}
