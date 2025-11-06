import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CheckoutService, ShippingAddress } from './checkoutservice.service';
import { JwtHelper } from '@/jwt/jwt-helper';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Router } from '@angular/router';
declare var Razorpay: any;

interface Address {

  id: number;
  name:string;
  address: string;
  phoneNumber: string;
  country: string;
  state: string;
  pinCode: string;
  city: string;
}
@Component({
  selector: 'app-checkout',
  imports: [ButtonModule,FormsModule,RadioButtonModule, FloatLabelModule,ConfirmDialogModule, CommonModule, InputGroupAddonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {


  isEditMode = false;
editingAddressId: any =0;
  showAddAddressDialog: boolean = false;
  addressForm!: FormGroup;
  addresses: ShippingAddress[] = [];
  selectedAddressId: number | null = null;
  showAddAddressForm = false;
  userId:number=0;
  userInfo:any;
  selectedPaymentMode='Prepaid';

  constructor(private route: Router,private fb: FormBuilder, private messageService: MessageService, private checkoutService: CheckoutService,
    private jwtHelper: JwtHelper,private confirmationService: ConfirmationService
  ) {
    this.addressForm = this.fb.group({
      name:['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', Validators.required],
      city: ['', Validators.required],
    });

    // Example existing addresses (fetch from backend ideally)
    // this.addresses = [
    //   {
    //     id: 1,
    //     shippingAddress: '123 Street, Apartment 4A',
    //     phoneNumber: '9876543210',
    //     country: 'India',
    //     state: 'Karnataka',
    //     pinCode: '560001',
    //     city: 'Bangalore'
    //   }
    // ];
  }
  ngOnInit(): void {
    this.userInfo = this.jwtHelper.getUserInfo();
    this.userId = this.userInfo.id;
    this.getAllShippingAddress(this.userId);
  }

  getAllShippingAddress(id: any) {

    this.checkoutService.getAllShippingAddresses(id).subscribe({
      next: (res:ShippingAddress[]) => {

        res.forEach((x:any)=>{
          this.addresses.push(x);
        });
      },
      error: (err) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Oops!',
          detail: 'Unable to fetch the Shipping address',
          sticky: true
        });
      }
    }
    )
  }

  toggleAddAddress() {
    this.showAddAddressForm = !this.showAddAddressForm;
    this.addressForm.reset();
  }

  selectAddress(id: number) {
    this.selectedAddressId = id;
  }

  submitNewAddress() {
  if (this.addressForm.invalid) return;

  const addressData = {
    ...this.addressForm.value,
    isDefault: false // or true if needed
  };
if (this.isEditMode && this.editingAddressId !== null) {
    //  Update address
    this.checkoutService
      .updateShippingAddress(this.userId, this.editingAddressId, addressData)
      .subscribe({
        next: (updated) => {
          const index = this.addresses.findIndex(a => a.id === this.editingAddressId);
          if (index !== -1) {
            this.addresses[index] = updated;
          }
          this.showAddAddressDialog = false;
      this.showAddAddressForm = false;
          this.addressForm.reset();
          
        },
        error: err => {
          console.error('Update failed', err);
        }
      });
  } else {
  this.checkoutService.createShippingAddress(this.userId, addressData).subscribe({
    next: (createdAddress:any) => {
      this.addresses.push(createdAddress);  // Add the saved address with real ID
      this.selectedAddressId = createdAddress.id;

      // UI state updates
      this.showAddAddressDialog = false;
      this.showAddAddressForm = false;
      this.addressForm.reset();
    },
    error: (err) => {
      this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Oops!',
          detail: 'Unable to add new shipping address',
          sticky: true
        });
    }
  });
}
}

onPhoneInput(event: any) {
  const input = event.target.value.replace(/\D/g, ''); // remove non-digits
  event.target.value = input.slice(0, 10); // limit to 10 digits
  this.addressForm.get('phoneNumber')?.setValue(event.target.value, { emitEvent: false });
}

  placeOrder() {
    const selectedAddress = this.addresses.find(a => a.id === this.selectedAddressId);
    const shippingAddressId = selectedAddress?.id;
    if (!selectedAddress) {
      this.messageService.add({
        key: 'global',
        severity: 'warn',
        summary: 'No Address Selected',
        detail: 'Please select a shipping address before proceeding.',
        icon: 'pi pi-exclamation-triangle'
      });
      return;
    }
    if (!this.selectedPaymentMode) {
      this.messageService.add({
        key: 'global',
        severity: 'warn',
        summary: 'No Address Selected',
        detail: 'Please select payent mode proceeding.',
        icon: 'pi pi-exclamation-triangle'
      });
      return;
    }

    const checkoutRequest = {
      shippingAddressId:shippingAddressId,
      paymentMode: this.selectedPaymentMode
    };

    this.checkoutService.Checkout(checkoutRequest).subscribe({
  next: (res:any) => {
    console.log('Order placed successfully:', res);
    if (this.selectedPaymentMode === 'Prepaid') {
        this.createRazorpayOrder(res);
        this.messageService.add({
         // key:'global',
          severity: 'success',
          summary: 'Order placed',
          detail: 'Your order has been placed successfully!'
        });
      } else {
        this.messageService.add({
          key:'global',
          severity: 'success',
          summary: 'Order placed',
          detail: 'Your order has been placed with COD'
        });
      }

  },
  error: (err) => {
    this.messageService.add({
          key:'global',
          severity: 'warn',
          summary: 'Oops!',
          detail: err.error.message
        });
  }
});
    // TODO: Send to backend via HTTP POST

    
  }
  createRazorpayOrder(order: any) {
  
      this.openRazorpayWidget(order);
      
 
}

openRazorpayWidget(order: any) {

    console.log("Razorpay Order ID:", order.razorPayOrderId);
  const options: any = {
    key: order.apikey,
    amount: order.amount,
    currency: order.currency,
    name: "ZFC Store",
    description: "Order Payment",
    order_id: order.razorPayOrderId,
    handler: (response: any) => {
      // Payment succeeded in Razorpay UI, but verification happens via webhook on backend
      this.messageService.add({
        key:'global',
        severity: 'info',
        summary: 'Payment Processing',
        detail: 'Your payment was successful. Order confirmation will be sent shortly to your registered mail id.'
      });
      // Optional: disable further payment attempts, redirect user, etc.
      this.route.navigate(['/order/order-history']);
    },
    modal: {
      ondismiss: () => {
        // User closed the payment modal without completing payment
        this.messageService.add({
          key:'global',
          severity: 'warn',
          summary: 'Payment Cancelled',
          detail: 'You cancelled the payment. Please try again to complete your order.'
        });
      }
    },
    prefill: {
      name: this.userInfo.username,
      email: this.userInfo.email,
      contact: this.userInfo.phoneNumber
    },
    theme: {
      color: '#F37254'
    },
    method: {
      upi: true, 
      card: true,
      netbanking: true,
      wallet: false,
    },
    upi: {
      flow: 'collect'
    }
  };

  this.loadRazorpayScript().then(() => {
    const rzp = new Razorpay(options);
    rzp.open();
  });
}


loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve();
    script.onerror = () => reject('Razorpay SDK failed to load');
    document.body.appendChild(script);
  });
}

verifyRazorpayPayment(payload: any) {
  this.checkoutService.verifyRazorpayPayment(payload).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Payment Success',
        detail: 'Order confirmed and marked as PAID!'
      });
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Verification Failed',
        detail: 'Payment could not be verified'
      });
    }
  });
}


  editAddress(address: Address) {
  this.isEditMode = true;
  this.editingAddressId = address.id;
  this.showAddAddressDialog = true;

  this.addressForm.patchValue({
    address: address.address,
    phoneNumber: address.phoneNumber,
    country: address.country,
    state: address.state,
    pinCode: address.pinCode,
    city: address.city
  });

}

deleteAddress(addressId: number) {
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this address?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    
    accept: () => {
      this.checkoutService.deleteShippingAddress(this.userId, addressId).subscribe({
        next: () => {
          this.addresses = this.addresses.filter(addr => addr.id !== addressId);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Address deleted successfully' });
        },
        error: err => {
          console.error('Error deleting address', err);
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Failed to delete address' });
        }
      });
    }
  });
}


}
