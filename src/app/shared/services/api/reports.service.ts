import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { END_POINTS } from './globals';
import { SharedSettingsService } from '../shared-settings.service';

const API_URL_MeasureUnits = END_POINTS.MeasureUnitsReport;
const API_URL_ItemData = END_POINTS.ItemsDataReport;
const API_URL_ItemCard = END_POINTS.ItemCardReport;
const API_URL_ItemCardC = END_POINTS.ItemCardCReport;
const API_URL_ReturnItemData = END_POINTS.ReturnItemDataReport;
const API_URL_Supplers = END_POINTS.SuppliersReport;
const API_URL_TrxTypes = END_POINTS.TrxTypesReport;
const API_URL_EmpCustody = END_POINTS.EmpCustodyReport;
const API_URL_ReceiveNote = END_POINTS.ReceiveNoteReport;
const API_URL_ReceiveRecord = END_POINTS.ReceiveRecordReport;
const API_URL_ItemOutOrder = END_POINTS.ItemOutOrderReport;
const API_URL_TempReceiveNotification = END_POINTS.TempReceiveNotificationReport;
const API_URL_TransferCustody = END_POINTS.TransferCustodyReport;
const API_URL_ReturnDocument = END_POINTS.ReturnDocumentReport;

const API_URL_StoreItemsBalance = END_POINTS.StoreItemsBalanceReport;
const API_URL_StoreKeepers = END_POINTS.StoreKeepersReport;
const API_URL_Store = END_POINTS.StoreReport;
const API_URL_WorkPlaces = END_POINTS.WorkPlacesReport;

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient,
    private sharedSettingsService: SharedSettingsService,
) { }

  getMeasureUnitsReport(fromUintId: number, toUnitId: number): Observable<any> {
    return this.http.get<any>(API_URL_MeasureUnits+`/${fromUintId}/${toUnitId}`);
  }

  getItemDataReport( params: {
    itemYear: number,
    rdAdll: boolean,
    rdGrouped: boolean,
    chkAddEmptyColumn: boolean,
    itemGroupId: string,
    chkHasBalance: boolean
  }): Observable<any> {
    if (!params.itemGroupId) params.itemGroupId = 'null';
    return this.http.get<any>(API_URL_ItemData+`/${params.itemYear}/${params.rdAdll}/${params.rdGrouped}/${params.chkAddEmptyColumn}/${params.itemGroupId}/${params.chkHasBalance}`);
  }

  getItemCardReport(params : {
    itemYear: number,
    txtFromItemGroupId: string,
    txtToItemGroupId: string,
    txtFromItemId: string,
    txtToItemId: string,
    txtFromDate: string,
    txtToDate: string,
    optItemCard2: boolean
  }): Observable<any> {
    return this.http.post<any>(API_URL_ItemCard, params);
  }

  getItemCardCReport(params : {
    itemYear: number,
    txtFromItemFullCode: string,
    txtToItemFullCode: string,
    txtFromDate: string,
    txtToDate: string
  }): Observable<any> {
    return this.http.post<any>(API_URL_ItemCardC, params);
  }

  getReturnItemsDataReport(params: {
    itemYear: number,
    rdAdll: boolean,
    rdGrouped: boolean,
    chkAddEmptyColumn: boolean,
    txtItemGroupId: string,
    chkHasBalance: boolean
  }): Observable<any> {
    return this.http.get<any>(API_URL_ReturnItemData+`/${params.itemYear}/${params.rdAdll}/${params.rdGrouped}/${params.chkAddEmptyColumn}/${params.txtItemGroupId}/${params.chkHasBalance}`);
  }

  getSuppliersReport(supplerFromId: number, supplierToId: number): Observable<any> {
    return this.http.get<any>(API_URL_Supplers+`/${supplerFromId}/${supplierToId}`);
  }

  getTrxTypesReport(trxTypeFromId: number, trxTypeToId: number): Observable<any> {
    return this.http.get<any>(API_URL_TrxTypes+`/${trxTypeFromId}/${trxTypeToId}`);
  }

  getEmpCustodyReport(params : {
    txtEmpId: number,
    txtItemFullCode: string,
    txtFromDate: string,
    txtToDate: string,
    chkDetails: boolean,
    chkShowAll: boolean
  }): Observable<any> {
    return this.http.post<any>(API_URL_EmpCustody, params);
  }

  getReceiveNoteReport(params : {
    txtFromDate: string,
    txtToDate: string,
  }): Observable<any> {
    return this.http.post<any>(API_URL_ReceiveNote, params);
  }

  getReceiveRecordReport(params : {
    txtFromDate: string,
    txtToDate: string,
    txtRecipientId: any
  }): Observable<any> {
    return this.http.post<any>(API_URL_ReceiveRecord, params);
  }

  getItemOutOrderReport(params : {
    itemYear: number,
    txtFromDate: string,
    txtToDate: string,
    txtDeliveryPersonId: number
  }): Observable<any> {
    return this.http.post<any>(API_URL_ItemOutOrder, params);
  }

  getTempReceiveNotificationReport(params : {
    txtFromDate: string,
    txtToDate: string
  }): Observable<any> {
    return this.http.post<any>(API_URL_TempReceiveNotification, params);
  }

  getTransferCustodyReport(params : {
    txtFromDate: string,
    txtToDate: string
  }): Observable<any> {
    return this.http.post<any>(API_URL_TransferCustody, params);
  }

  getReturnDocumentReport(params : {
    txtFromDate: string,
    txtToDate: string
  }): Observable<any> {
    return this.http.post<any>(API_URL_ReturnDocument, params);
  }

  getStoreItemsBalanceReport(params):Observable<any>{
    const sessionYear = this.sharedSettingsService.getSessionYear();
    params.itemYear=sessionYear;
    return this.http.post<any>(API_URL_StoreItemsBalance, params);
  }
  getStoreKeepersReport(txtFromId,txtToId):Observable<any>{
    return this.http.get<any>(API_URL_StoreKeepers+`/${txtFromId}/${txtToId}`);
  }

  getStoresReport(txtFromId,txtToId):Observable<any>{
    return this.http.get<any>(API_URL_Store+`/${txtFromId}/${txtToId}`);
  }
  getWorkPlacesReport(txtFromId,txtToId):Observable<any>{
    return this.http.get<any>(API_URL_WorkPlaces+`/${txtFromId}/${txtToId}`);
  }
}
 