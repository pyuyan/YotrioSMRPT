import { NgModule } from '@angular/core';
import { PercentPipe } from './percent/percent';
import { ThousandsPipe } from './thousands/thousands';
@NgModule({
	declarations: [PercentPipe,
    ThousandsPipe],
	imports: [],
	exports: [PercentPipe,
    ThousandsPipe]
})
export class PipesModule {}
