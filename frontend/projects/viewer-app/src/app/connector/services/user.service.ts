/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AuthenticationData2FaRequest } from '../models/authentication-data-2-fa-request';
import { User } from '../models/user';
import { UserCreationRequest } from '../models/user-creation-request';
import { UserPasswordChangeRequest } from '../models/user-password-change-request';
import { UserVerificationDocument } from '../models/user-verification-document';


/**
 * Operations on Users
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation createUser
   */
  static readonly CreateUserPath = '/users';

  /**
   * Create a new User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createUser$Response(params: {
    't3-AsAgentId'?: string;
    body: UserCreationRequest
  }): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.CreateUserPath, 'post');
    if (params) {
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * Create a new User.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createUser(params: {
    't3-AsAgentId'?: string;
    body: UserCreationRequest
  }): Observable<User> {

    return this.createUser$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  /**
   * Path part for operation changePassword
   */
  static readonly ChangePasswordPath = '/users/{id}/password';

  /**
   * Change a User's password.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changePassword()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changePassword$Response(params: {
    id: string;
    't3-AsAgentId'?: string;
    body: UserPasswordChangeRequest
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.ChangePasswordPath, 'put');
    if (params) {
      rb.path('id', params.id, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Change a User's password.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `changePassword$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changePassword(params: {
    id: string;
    't3-AsAgentId'?: string;
    body: UserPasswordChangeRequest
  }): Observable<void> {

    return this.changePassword$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation setTwoFactorAuthenticationData
   */
  static readonly SetTwoFactorAuthenticationDataPath = '/users/{id}/2fa';

  /**
   * Set User's Authentication Data for 2FA.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `setTwoFactorAuthenticationData()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setTwoFactorAuthenticationData$Response(params: {
    id: string;
    't3-AsAgentId'?: string;
    body: AuthenticationData2FaRequest
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.SetTwoFactorAuthenticationDataPath, 'put');
    if (params) {
      rb.path('id', params.id, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Set User's Authentication Data for 2FA.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `setTwoFactorAuthenticationData$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  setTwoFactorAuthenticationData(params: {
    id: string;
    't3-AsAgentId'?: string;
    body: AuthenticationData2FaRequest
  }): Observable<void> {

    return this.setTwoFactorAuthenticationData$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUser
   */
  static readonly GetUserPath = '/users/{id}';

  /**
   * Retrieve a User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser$Response(params: {
    id: string;
    't3-AsAgentId'?: string;
    't3-Additional-Authorization'?: Array<string>;
  }): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.GetUserPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
      rb.header('t3-Additional-Authorization', params['t3-Additional-Authorization'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * Retrieve a User.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser(params: {
    id: string;
    't3-AsAgentId'?: string;
    't3-Additional-Authorization'?: Array<string>;
  }): Observable<User> {

    return this.getUser$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  /**
   * Path part for operation getCurrentUser
   */
  static readonly GetCurrentUserPath = '/users/me';

  /**
   * Get current User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUser$Response(params?: {
    't3-AsAgentId'?: string;
  }): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.GetCurrentUserPath, 'get');
    if (params) {
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * Get current User.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCurrentUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUser(params?: {
    't3-AsAgentId'?: string;
  }): Observable<User> {

    return this.getCurrentUser$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  /**
   * Path part for operation addUserVerificationDocument
   */
  static readonly AddUserVerificationDocumentPath = '/users/{id}/verification-documents';

  /**
   * Add a new verification document to the user.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addUserVerificationDocument()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  addUserVerificationDocument$Response(params: {
    id: string;
    't3-AsAgentId'?: string;
    body?: {
'type': string;
'content': Blob;
}
  }): Observable<StrictHttpResponse<UserVerificationDocument>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.AddUserVerificationDocumentPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserVerificationDocument>;
      })
    );
  }

  /**
   * Add a new verification document to the user.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addUserVerificationDocument$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  addUserVerificationDocument(params: {
    id: string;
    't3-AsAgentId'?: string;
    body?: {
'type': string;
'content': Blob;
}
  }): Observable<UserVerificationDocument> {

    return this.addUserVerificationDocument$Response(params).pipe(
      map((r: StrictHttpResponse<UserVerificationDocument>) => r.body as UserVerificationDocument)
    );
  }

}
