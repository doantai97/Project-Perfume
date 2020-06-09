package com.perfume.dto;

import java.util.List;

public class PagingDTO {
    long total;
    int page;
    int limit;
    long offset;

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public long getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public PagingDTO() {
    }

    public PagingDTO(long total, int page, int limit, long offset) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.offset = offset;
    }
}
