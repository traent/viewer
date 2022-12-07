import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MaterialOrCustomIcon } from '@traent/ngx-components';

import { State } from '../ledger-objects/models/WorkflowsDSLv1/state';
import { WorkflowService } from './workflow.service';

export interface UIWorkflowStateView {
  icon: MaterialOrCustomIcon;
  bgBadge: string;
  bgHeader: string;
}

export interface UIWorkflowState {
  configs: {
    tag: string;
  };
  label: string;
  /** Value used in the header */
  description: string;
  isActive: boolean;
  /** It's define if the state is selected as documents filters by the User */
  isSelected: boolean;
  /** The original identifier of the state */
  stateId?: string;
  ui: UIWorkflowStateView;
}

export interface UIWorkflow {
  uiStates: UIWorkflowState[];
}

export interface UIWorkflowMetadata {
  view: {
    journalistTagId: string;
    sourceTagId: string;
  };
}

const mapUIWorkflowConfigs: Record<string, UIWorkflowStateView> = {
  start: {
    icon: { material: 'hourglass_top' },
    bgBadge: '#E0E0E0',
    bgHeader: '#F2F2F2',
  },
  'information-gathering': {
    icon: { material: 'hourglass_top' },
    bgBadge: '#E0E0E0',
    bgHeader: '#F2F2F2',
  },
  review: {
    icon: { material: 'hourglass_top' },
    bgBadge: '#E0E0E0',
    bgHeader: '#F2F2F2',
  },
  'verdict-fake': {
    icon: { custom: 'not-verified' },
    bgBadge: '#FFCDD2',
    bgHeader: '#FFEBEE',
  },
  'verdict-inaccurate': {
    icon: { custom: 'not-verified' },
    bgBadge: '#FFDCB2',
    bgHeader: '#FFF1E0',
  },
  'verdict-old': {
    icon: { material: 'warning' },
    bgBadge: '#E1BEE7',
    bgHeader: '#F3E5F5',
  },
  'verdict-unverifiable': {
    icon: { material: 'help' },
    bgBadge: '#C5CAE9',
    bgHeader: '#C5CAE9',
  },
  'verdict-verified': {
    icon: { custom: 'verified' },
    bgBadge: '#C8E6C9',
    bgHeader: '#E8F5E9',
  },
  'news-update': {
    icon: { material: 'hourglass_top' },
    bgBadge: '#E0E0E0',
    bgHeader: '#FFF1E0',
  },
};

@Injectable({
  providedIn: 'root',
})
export class UiWorkflowService {
  // the UI has a fixed representation of the Workflow, the only dynamic state is the verdict
  private readonly mappedStates = [
    {
      stateName: 'start',
    },
    {
      stateName: 'information-gathering',
    },
    {
      stateName: 'review',
    },
    {
      stateName: 'verdict',
      states: [
        'verdict-fake',
        'verdict-inaccurate',
        'verdict-old',
        'verdict-unverifiable',
        'verdict-verified',
      ],
    },
    {
      stateName: 'news-update',
    },
  ];

  constructor(
    private readonly workflowService: WorkflowService,
    private readonly translateService: TranslateService,
  ) {
  }

  async getUiStates(): Promise<UIWorkflowState[]> {
    const workflow = await this.workflowService.getWorkflow();
    if (!workflow) {
      throw new Error('Cannot parse workflow');
    }
    const lastState = workflow.lastState?.toString();

    if (workflow.dsl?.version === 0) {
      throw new Error('Workflow version 0 not supported');
    }

    if (workflow.dsl?.version === 1) {
      return this.mappedStates.map((s) => {
        if (s.states?.length && lastState) {
          // define if the last state is included in the list of defined states for the `verdict`
          const isLastState = s.states.includes(lastState);
          const stateFind = isLastState
            ? (workflow.dsl?.definition.states as any)[lastState] as State
            : undefined;

          return {
            configs: { tag: stateFind?.metadata.view.document_tag_ids[0] },
            description: stateFind?.metadata.description,
            isActive: !!(stateFind && lastState),
            isSelected: false,
            label: isLastState
              ? `${this.translateService.instant('Esito')}: ${stateFind?.name}`
              : this.translateService.instant('Esito del fact-checking'),
            stateId: stateFind && lastState,
            ui: mapUIWorkflowConfigs[lastState],
          };
        }

        const state = (workflow.dsl?.definition.states as any)[s.stateName] as State;

        return {
          configs: { tag: state.metadata.view.document_tag_ids[0] },
          description: state.metadata.view.state_label,
          isActive: s.stateName === lastState,
          isSelected: false,
          label: state.name,
          stateId: s.stateName,
          ui: mapUIWorkflowConfigs[s.stateName],
        };
      });
    }
    return [];
  }

  async getWorkflowMetadata(): Promise<UIWorkflowMetadata> {
    const workflow = await this.workflowService.getWorkflow();
    if (!workflow) {
      throw new Error('Cannot parse workflow');
    }

    if (workflow.dsl?.version === 0) {
      throw new Error('Workflow version 0 not supported');
    }

    return workflow.dsl?.definition.metadata;
  }
}
