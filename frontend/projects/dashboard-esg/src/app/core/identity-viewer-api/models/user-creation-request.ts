/* tslint:disable */
/* eslint-disable */
import { AuthenticationDataItem } from './authentication-data-item';
import { UserProfileFieldRequest } from './user-profile-field-request';
export interface UserCreationRequest {
  authenticationData: AuthenticationDataItem;
  password: string;
  profileFields?: null | Array<UserProfileFieldRequest>;
}
