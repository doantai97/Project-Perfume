import { Component, OnInit } from "@angular/core";
import { IPaging, Paging } from "../../../model/base-respone.model";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Amount } from "../../../model/amount.model";
import { PAGING_PER_PAGE } from "./../../../comom/constant/base.constant";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { AmountService } from "../../../service/amount.service";
@Component({
  selector: "app-amount",
  templateUrl: "./amount.component.html",
  styleUrls: ["./amount.component.scss"]
})
export class AmountComponent implements OnInit {
  amounts: Amount[];
  public entitySelected: Amount;
  paging: IPaging;
  amountFormGroup: FormGroup;
  selectedAmount: Amount;
  mapMailServer = {};
  txtSearch: string;
  limits = PAGING_PER_PAGE;
  isAcction = true;

  constructor(
    public amountService: AmountService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.paging = new Paging();
    this.amounts = [];
    this.initTable();
  }

  initTable() {
    this.amountFormGroup = this.initForm();
    this.loadAll();
  }

  initForm() {
    return this.fb.group({
      id: [],
      name: [
        "",
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      description: ["", [Validators.required]],
      isUpdate: [true],
      isShow: [false]
    });
  }

  search() {
    this.paging.page = 1;
    this.loadAll();
  }

  loadAll() {
    console.log("loadAll");
    const parameters = {
      page: this.paging.page,
      limit: this.paging.limit
    };
    this.amountService.query(parameters).subscribe(res => {
      if (res.status === 200) {
        this.amounts = res.body.data;
        console.log(res.body.paging);
        console.log(this.amounts);
        // this.paging = res.body.paging;
        // this.paging.limit = res.body.paging.limit;
        // this.paging.offset = res.body.paging.offset;
        this.paging.total = res.body.paging.total;
      } else {
        console.warn("can not load mail sender");
      }
    });
  }

  loadPage(page: number) {
    if (page !== this.paging.previousPage) {
      this.paging.previousPage = page;
      this.loadAll();
    }
  }

  // transition() {
  //   const parameters = {
  //     offset: this.paging.offset - 1,
  //     limit: this.paging.limit
  //   }
  //   if (this.order.orderBy) {
  //     parameters['orderBy'] = this.order.orderBy;
  //     parameters['orderType'] = this.order.getOrderType();
  //   }
  //   if (this.txtSearch && this.txtSearch.trim().length > 0) {
  //     parameters['search'] = this.txtSearch;
  //   }
  //   this.router.navigate(['/object/mail-sender'], {
  //     queryParams: parameters
  //   });
  //   // this.loadAll();
  // }

  addAmount() {
    this.amountFormGroup.setValue({
      id: null,
      description: "",
      name: "",
      isUpdate: false,
      isShow: true
    });
  }

  showEdit(amount: Amount) {
    this.amountFormGroup.setValue({
      id: amount.id,
      description: amount.description,
      name: amount.name,
      isUpdate: true,
      isShow: true
    });
    console.log(this.amountFormGroup.value);
  }

  save(modal, amount: Amount) {
    this.entitySelected = amount;
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        backdrop: "static"
      })
      .result.then(result => {
        if (result === "save") {
          this.isAcction = true;
          console.log("save");
          if (amount.id) {
            this.amountService.update(amount).subscribe(res => {
              console.log(res.body);
              this.loadAll();
            });
          } else {
            this.amountService.create(amount).subscribe(res => {
              console.log(res.body);
              this.loadAll();
            });
          }
        }
      });
  }

  remove(modal, amount: Amount) {
    this.entitySelected = amount;
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        backdrop: "static"
      })
      .result.then(
        result => {
          if (result === "delete") {
            console.log("delete");
            console.log(this.selectedAmount);
            if (amount.id) {
              this.amountService.delete(amount.id).subscribe(res => {
                // control.removeAt(index);
                if (res.status === 200) {
                  if (
                    this.paging.offset +
                      this.amounts.length -
                      this.paging.offset ===
                      1 &&
                    this.paging.page !== 1
                  ) {
                    this.paging.page = this.paging.page - 1;
                    this.loadAll();
                  } else {
                    this.loadAll();
                  }
                }
              });
            } else {
            }
          }
        },
        reason => {}
      );
  }

  openViewCertPopup(modal, amount) {
    this.selectedAmount = amount;
    this.modalService
      .open(modal, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        backdrop: "static"
      })
      .result.then(
        result => {},
        reason => {}
      );
  }

  changeLimit() {
    this.paging.page = 1;
    this.loadAll();
  }

  pagingInfo = paging => {
    return `Show ${paging.offset + 1} to ${paging.offset +
      this.amounts.length} of ${paging.total} entries`;
  };
}
