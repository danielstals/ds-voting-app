import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
/**
 * This component can be implemented in other components in order to easily unsubscribe subscriptions
 * when compoments get unloaded from the view. (Helps avoiding memory leaks)
 */
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
