import { Pipe, PipeTransform } from '@angular/core';
import { ProfileValidationState } from '@api/models';
import { IdentityValidation, IdentityValidationState } from '@traent/ngx-components';

@Pipe({ name: 'identityValidation' })
export class IdentityValidationPipe implements PipeTransform {
  transform(state: ProfileValidationState, type: 'user' | 'member' | 'organization'): IdentityValidation;
  transform(state: ProfileValidationState | undefined, type: 'user' | 'member' | 'organization'): IdentityValidation | undefined;
  // eslint-disable-next-line class-methods-use-this
  transform(
    state: ProfileValidationState | null | undefined,
    type: 'user' | 'member' | 'organization',
  ): IdentityValidation | null | undefined {
    if (state == null) {
      return state;
    }

    const invalidMessage = type === 'user'
      ? 'Invalid user profile'
      : type === 'organization' ? 'Invalid organization profile' : 'Invalid member profile';
    const validMessage = type === 'user'
      ? 'Valid user profile'
      : type === 'organization' ? 'Valid organization profile' : 'Valid member profile';
    const pendingMessage = type === 'user'
      ? 'User profile validation pending'
      : type === 'organization' ? 'Organization profile validation pending' : 'Member profile validation pending';

    switch (state) {
      case ProfileValidationState.Invalid: return {
        state: IdentityValidationState.Invalid,
        message: invalidMessage,
      };
      case ProfileValidationState.Valid: return {
        state: IdentityValidationState.Valid,
        message: validMessage,
      };
      case ProfileValidationState.None: return {
        state: IdentityValidationState.None,
        message: pendingMessage,
      };
    }
  }
}
