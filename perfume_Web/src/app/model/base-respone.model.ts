export interface IPaging {
  limit?: number;
  offset?: number;
  total?: number;
  page?: number;
  previousPage?: any;
}

export class Paging implements IPaging {
  constructor(
    public limit?: number,
    public offset?: number,
    public total?: number,
    public page?: number
  ) {
    this.limit = limit ? limit : 10;
    this.offset = offset ? offset : 0;
    this.page = page ? this.page : 1;
  }
}

export class OderBy {
  name: string;
  type: string;
}

export class ResponseMsg {
  data: any;
  status: number;
  msg: string;
}
