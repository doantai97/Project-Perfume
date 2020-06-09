package com.perfume.dto;

import java.util.List;

public class ResponsePaging<D> {
    List<D> data;
    PagingDTO paging;

    public List<D> getData() {
        return data;
    }

    public void setData(List<D> data) {
        this.data = data;
    }

    public PagingDTO getPaging() {
        return paging;
    }

    public void setPaging(PagingDTO paging) {
        this.paging = paging;
    }

    public ResponsePaging() {
    }

    public ResponsePaging(List<D> data, PagingDTO paging) {
        this.data = data;
        this.paging = paging;
    }
}
