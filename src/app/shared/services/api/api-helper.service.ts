import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { RankingInfo, ResultWithPagination } from 'src/app/shared/models';


@Injectable({
    providedIn: "root"
})
export class ApiHelper {

    public toRankingInfoResponse<T>(apiResonse: HttpResponse<T>): {result: T, rankingInfo: RankingInfo} {
        return {
            result: apiResonse.body,
            rankingInfo: {
              index: Number.parseInt(apiResonse.headers.get('index')),
              countAllItems: Number.parseInt(apiResonse.headers.get('countAllItems'))
            }
          }
    }

    public toResultWithPagination<T>(response: HttpResponse<T>): ResultWithPagination<T> {
        let paginationString = response.headers.get('pagination');
            try {
              var pagination = JSON.parse(paginationString)
            } catch {
              var pagination = null;
            }
            return {
              pagination: pagination,
              result: response.body
            }
    }

}