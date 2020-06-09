package com.perfume.dto;

public class ResponseMsg<T> {
    private T data;
    private int status;
    private String msg;


    public ResponseMsg(T data, int status, String msg) {
        this.data = data;
        this.status = status;
        this.msg = msg;
    }

    public ResponseMsg() {
        this.data = null;
        this.status = 400;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
