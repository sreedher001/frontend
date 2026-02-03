import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminReturn } from './return.modal';

export interface AdminReturnDetailDto {
  returnId: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;

  productName: string;
  color: string;
  size: string;
  quantity: number;

  reason: string;
  comment: string;
  status: string;

  timeline: ReturnTimelineDto[];
}
export interface ReturnTimelineDto {
  status: string;
  changedBy: string;
  changedAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class Return {
  
  commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getAllReturns(status: string, page: number, size: number) {
  return this.http.get(
    `${this.baseUrl}/admin/returns/all-returns`,
    {
      params: {
        status,
        page,
        size
      }
    }
  );
}

  approve(id: number, comment: string) {
    return this.http.post(`${this.baseUrl}/admin/returns/${id}/approve`, { comment });
  }

  reject(id: number, comment: string) {
    return this.http.post(`${this.baseUrl}/admin/returns/${id}/reject`, { comment });
  }


  received(returnId: number) {
    return this.http.post(`${this.baseUrl}/admin/returns/${returnId}/received`, {});
  }

qc(returnId: number, passed: boolean, comment: string) {
  return this.http.post(
    `${this.baseUrl}/admin/returns/${returnId}/quality-check`,
    { passed, comment }
  );
}



  initiateRefund(returnId: number) {
    return this.http.post(`${this.baseUrl}/admin/returns/${returnId}/refund/initiate`, {});
  }

  refundCompleted(returnId: number, ref: string) {
    return this.http.post(`${this.baseUrl}/admin/returns/${returnId}/refund/complete`, {
      refundReference: ref });
    }
  

  closeReturn(returnId: number) {
    return this.http.post(`${this.baseUrl}/admin/returns/${returnId}/close`, {});
  }

  getReturnDetail(returnId: number) {
  return this.http.get<AdminReturnDetailDto>(
    `${this.baseUrl}/admin/returns/${returnId}`
  );
}

 requestReturn(payload: any) {
    return this.http.post(
      `${this.baseUrl}/returns/return-request`,
      payload
    );
  }
}
