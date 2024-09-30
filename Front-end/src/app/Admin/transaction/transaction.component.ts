import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {TransactionService} from "../../../Services/Admin/transaction.service";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit{
  payments:any[] = [];

  constructor(private transaction:TransactionService) {
  }

  ngOnInit() {
    this.loadPayments()
  }

  loadPayments(){
    this.transaction.getPayments().subscribe(
      (data: any) => {
        this.payments = data.body
        console.log(this.payments)
      },
      (error) => {
        console.error("error while get payments : ", error)
      }
    )
  }
}
