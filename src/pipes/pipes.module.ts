import { NgModule } from '@angular/core';
import { PercentPipe } from './percent/percent';
import { ThousandsPipe } from './thousands/thousands';
import { NumbersortPipe } from './numbersort/numbersort';
import { TextorverflowPipe } from './textorverflow/textorverflow';
@NgModule({
	declarations: [PercentPipe,
    ThousandsPipe,
    NumbersortPipe,
    TextorverflowPipe],
	imports: [],
	exports: [PercentPipe,
    ThousandsPipe,
    NumbersortPipe,
    TextorverflowPipe]
})
export class PipesModule {}
