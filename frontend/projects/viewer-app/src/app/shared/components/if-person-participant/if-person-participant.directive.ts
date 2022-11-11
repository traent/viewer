import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LedgerProjectParticipant, ProjectParticipant, WorkflowParticipant } from '@viewer/models';
import { BehaviorSubject, combineLatest, distinctUntilChanged } from 'rxjs';

@UntilDestroy()
@Directive({ selector: '[appIfPersonParticipant]' })
export class IfPersonParticipantDirective {
  static ngTemplateGuard_appIfPersonParticipant(
    _: IfPersonParticipantDirective,
    exp: ProjectParticipant | null | undefined,
  ): exp is LedgerProjectParticipant | null | undefined {
    return exp !== WorkflowParticipant;
  };

  private readonly appIfPersonParticipantElse$ = new BehaviorSubject<TemplateRef<any> | null>(null);
  @Input() set appIfPersonParticipantElse(value: TemplateRef<any> | null) {
    this.appIfPersonParticipantElse$.next(value);
  }

  private readonly appIfPersonParticipant$ = new BehaviorSubject<ProjectParticipant | null | undefined>(null);
  @Input() set appIfPersonParticipant(value: ProjectParticipant | null | undefined) {
    this.appIfPersonParticipant$.next(value);
  }

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly templateRef: TemplateRef<any>,
  ) {
    combineLatest([
      this.appIfPersonParticipant$.pipe(distinctUntilChanged()),
      this.appIfPersonParticipantElse$.pipe(distinctUntilChanged()),
    ]).subscribe(([participant, elseTemplate]) => {
      if (participant !== WorkflowParticipant) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (elseTemplate) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(elseTemplate);
      }
    });
  }
}
