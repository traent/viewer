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

import { ViewerAgent } from '../models/viewer-agent';
import { ViewerMember } from '../models/viewer-member';
import { ViewerOrganization } from '../models/viewer-organization';


/**
 * Operations exposed for Viewer
 */
@Injectable({
  providedIn: 'root',
})
export class ViewerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getViewerAgent
   */
  static readonly GetViewerAgentPath = '/viewer/agents/{agentId}';

  /**
   * Get member or thing details.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getViewerAgent()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerAgent$Response(params: {
    agentId: string;
    't3-AsAgentId'?: string;
  }): Observable<StrictHttpResponse<ViewerAgent>> {

    const rb = new RequestBuilder(this.rootUrl, ViewerService.GetViewerAgentPath, 'get');
    if (params) {
      rb.path('agentId', params.agentId, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ViewerAgent>;
      })
    );
  }

  /**
   * Get member or thing details.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getViewerAgent$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerAgent(params: {
    agentId: string;
    't3-AsAgentId'?: string;
  }): Observable<ViewerAgent> {

    return this.getViewerAgent$Response(params).pipe(
      map((r: StrictHttpResponse<ViewerAgent>) => r.body as ViewerAgent)
    );
  }

  /**
   * Path part for operation getViewerMember
   */
  static readonly GetViewerMemberPath = '/viewer/members/{memberId}';

  /**
   * Get member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getViewerMember()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerMember$Response(params: {
    memberId: string;
    't3-AsAgentId'?: string;
  }): Observable<StrictHttpResponse<ViewerMember>> {

    const rb = new RequestBuilder(this.rootUrl, ViewerService.GetViewerMemberPath, 'get');
    if (params) {
      rb.path('memberId', params.memberId, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ViewerMember>;
      })
    );
  }

  /**
   * Get member.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getViewerMember$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerMember(params: {
    memberId: string;
    't3-AsAgentId'?: string;
  }): Observable<ViewerMember> {

    return this.getViewerMember$Response(params).pipe(
      map((r: StrictHttpResponse<ViewerMember>) => r.body as ViewerMember)
    );
  }

  /**
   * Path part for operation getViewerOrganization
   */
  static readonly GetViewerOrganizationPath = '/viewer/organizations/{organizationId}';

  /**
   * Get organization.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getViewerOrganization()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerOrganization$Response(params: {
    organizationId: string;
    't3-AsAgentId'?: string;
  }): Observable<StrictHttpResponse<ViewerOrganization>> {

    const rb = new RequestBuilder(this.rootUrl, ViewerService.GetViewerOrganizationPath, 'get');
    if (params) {
      rb.path('organizationId', params.organizationId, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ViewerOrganization>;
      })
    );
  }

  /**
   * Get organization.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getViewerOrganization$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerOrganization(params: {
    organizationId: string;
    't3-AsAgentId'?: string;
  }): Observable<ViewerOrganization> {

    return this.getViewerOrganization$Response(params).pipe(
      map((r: StrictHttpResponse<ViewerOrganization>) => r.body as ViewerOrganization)
    );
  }

  /**
   * Path part for operation getViewerOrganizationByKeyId
   */
  static readonly GetViewerOrganizationByKeyIdPath = '/viewer/organizations/by-key-id/{keyId}';

  /**
   * Get organization by key id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getViewerOrganizationByKeyId()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerOrganizationByKeyId$Response(params: {
    keyId: string;
    't3-AsAgentId'?: string;
  }): Observable<StrictHttpResponse<ViewerOrganization>> {

    const rb = new RequestBuilder(this.rootUrl, ViewerService.GetViewerOrganizationByKeyIdPath, 'get');
    if (params) {
      rb.path('keyId', params.keyId, {});
      rb.header('t3-AsAgentId', params['t3-AsAgentId'], {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ViewerOrganization>;
      })
    );
  }

  /**
   * Get organization by key id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getViewerOrganizationByKeyId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getViewerOrganizationByKeyId(params: {
    keyId: string;
    't3-AsAgentId'?: string;
  }): Observable<ViewerOrganization> {

    return this.getViewerOrganizationByKeyId$Response(params).pipe(
      map((r: StrictHttpResponse<ViewerOrganization>) => r.body as ViewerOrganization)
    );
  }

}
