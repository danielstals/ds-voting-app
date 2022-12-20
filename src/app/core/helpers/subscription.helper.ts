import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({ selector: '[subscriptionComponent]' })
export class SubscriptionComponent implements OnDestroy {
  public subs: Subscription[] = [];

  public addSub(sub: Subscription): void {
    this.subs.push(sub);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }
}
