import { HttpParams, HttpResponse } from "@angular/common/http";
import { signal } from "@angular/core";
import { PaginatedResult } from "../_models/Pagination";

export function setPaginationResponse<T>(response: HttpResponse<T>,
    paginationResultSignal: ReturnType<typeof signal<PaginatedResult<T> | null>>)
{
      paginationResultSignal.set({
          items: response.body as T,
          pagination: JSON.parse(response.headers.get('Pagination')!),
        })

  }

  export function SetPaginationHeaders(pageNumber: number, pageSize: number ){
    let params= new HttpParams();

    if(pageNumber&&pageSize){
      params=params.append('pageNumber', pageNumber);
      params=params.append('pageSize', pageSize);
    }
    return params;
  }