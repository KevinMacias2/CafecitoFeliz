import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appIfAuthenticated]',
    standalone: true
})
export class IfAuthenticatedDirective implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private templateRef = inject(TemplateRef);
    private viewContainer = inject(ViewContainerRef);
    private subscription: Subscription = new Subscription();

    @Input() set appIfAuthenticated(shouldBeAuthenticated: boolean) {
        this.check(shouldBeAuthenticated);
    }

    // Default to true if used without assignment like *appIfAuthenticated
    private showIfAuthenticated = true;

    ngOnInit() {
        this.subscription = this.authService.currentUser$.subscribe(user => {
            this.updateView(!!user);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private check(shouldBeAuthenticated: boolean) {
        this.showIfAuthenticated = shouldBeAuthenticated;
        this.updateView(this.authService.isAuthenticated());
    }

    private updateView(isAuthenticated: boolean) {
        this.viewContainer.clear();

        // Logic: 
        // if showIfAuthenticated is true, show when logic is true.
        // if showIfAuthenticated is false (meaning "show if NOT authenticated"), show when logic is false.
        const shouldShow = (isAuthenticated === this.showIfAuthenticated);

        if (shouldShow) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
