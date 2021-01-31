import { Injectable, Injector } from '@angular/core';
import { SiteService } from '../services/site/site.service';

@Injectable()
export class SiteInitializer {
	constructor(private injector: Injector) {
		// To enable browser undo for first time visit.
		history.pushState(null, null, `/`);
	}

	initialize(): Promise<any> {
		return this.injector.get(SiteService).initSite().toPromise();
	}
}
