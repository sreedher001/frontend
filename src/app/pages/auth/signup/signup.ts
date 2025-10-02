import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { PasswordModule } from 'primeng/password';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm,ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService, TreeNode } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { GalleriaModule } from 'primeng/galleria';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { Divider, DividerModule } from 'primeng/divider';
import { JwtHelper } from '@/jwt/jwt-helper';
@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    TableModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule, FileUploadModule, GalleriaModule,
    DialogModule,DividerModule,PasswordModule,MultiSelectModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})

export class Signup {

displayConfirmation: boolean = false;
  user = {
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    state: '',
    pinCode: '',
    address: '',
    password: '',
    confirmPassword: '',
    roles:[]=[]
  };
  loading = false;
    roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Moderator', value: 'mod' },
    { label: 'Admin', value: 'admin' }
  ];

  isAdmin: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,private jwtHelper:JwtHelper
  ) {
this.jwtHelper.getUserRoles().forEach(role=>{
  if(role==="ROLE_ADMIN"){
    this.isAdmin=true;
  }
});
  }

  onSubmit(signupForm: NgForm,) {
if (signupForm.invalid) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Oops!',
        detail: 'Please fill all required fields..'
      });
      return;
    }

     // 👇 Password mismatch check
  if (this.user.password !== this.user.confirmPassword) {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: 'Password Error',
      detail: 'Passwords do not match'
    });
    return;
  }

    if (signupForm.valid) {
      this.loading = true;
      const payload = {...this.user};
      //delete payload.confirmPassword;
      this.loginService.signup(payload).subscribe({
        next: (res) => {
          this.loading = false; 
          // const response = res;
          console.log("response signup",res);
          this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Verify your mail!',
        detail: `Click on the link sent to your email -${this.user.email} and verify`,
        sticky:true
      });
        },
        error: (err) => {
          this.loading = false;
           this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Oops!',
        detail: err.error.message,
        sticky:true
      });
        }
      });
    }
  }

  closeConfirmation() {
    this.displayConfirmation = false;
  }
  openConfirmation() {
    this.displayConfirmation = true;
  }
}


