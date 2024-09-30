import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import {error} from "@angular/compiler-cli/src/transformers/util";

declare var paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule]
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  projectWorker:string='';
  private endpointUrl = "https://localhost:7279/api/Payment/create";



  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      amount: ['', Validators.required],
    });

    this.renderPayPalButton();
    this.route.queryParams.subscribe(params => {
      this.projectWorker = params['worker'];
      console.log('Project Worker:', this.projectWorker);
      // Use the projectWorker in your component logic
    });
  }

  renderPayPalButton(): void {
    paypal.Buttons({
      style: {
        layout: 'horizontal',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
      },
      createOrder: (data: any, actions: any) => {
        const amount = this.paymentForm.get('amount')?.value;
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount
            },
          }],
        });
      },
      onApprove: (data: any, actions: any) => {

        return actions.order.capture().then((details: any) => {
          console.log("amount paid is:"+this.paymentForm.get('amount')?.value)
          console.log('Transaction completed by ' + details.payer.name.given_name);
          console.log('Project Worker:', this.projectWorker);
          console.log('Customer id:'+localStorage.getItem('Id'))
          const transactionData = {
            CustomerId:localStorage.getItem('Id'),
            FieldworkerId:this.projectWorker,
            Amount:this.paymentForm.get('amount')?.value,
            Date:"2024-07-16T00:00:00Z"

          };

          // Send the data to the endpoint
          this.http.post(this.endpointUrl, transactionData)
            .subscribe(response => {
              console.log('Transaction data sent successfully', response);
              alert("Transaction data sent successfully");
            }, error => {
              console.error('Error sending transaction data', error);
            });

          // Handle successful transaction here
        });
      },
      onError: (err: any) => {
        console.error('Error during the transaction', err);
        // Handle error here
      }
    }).render(this.paymentRef.nativeElement);
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.renderPayPalButton();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/projects']);
  }
}



