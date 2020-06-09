package com.perfume.constant;

public enum CommentType {
    NEWS("news"),PRODUCT("product");

    private String _value;
    CommentType(String value) {
        this._value = value;
    }

    public String value(){
        return _value;
    }


    public static CommentType find(String value){
        for(CommentType v : values()){
            if( v.value().equals(value)){
                return v;
            }
        }
        return null;
    }

}
