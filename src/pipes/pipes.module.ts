import { NgModule } from '@angular/core';
import { PercentPipe } from './percent/percent';
import { ThousandsPipe } from './thousands/thousands';
import { NumbersortPipe } from './numbersort/numbersort';
@NgModule({
	declarations: [PercentPipe,
    ThousandsPipe,
    NumbersortPipe],
	imports: [],
	exports: [PercentPipe,
    ThousandsPipe,
    NumbersortPipe]
})
export class PipesModule {}
