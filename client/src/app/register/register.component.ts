import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  private accountService=inject(AccountService);
  private fb=inject(FormBuilder);
  private router=inject(Router);
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister= new EventEmitter();
  model: any={}
  registerForm: FormGroup=new FormGroup({});
  maxDate= new Date()
  validationError: string[] | undefined

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
  }

  initializeForm(){
    this.registerForm= this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.minLength(4),Validators.maxLength(8),Validators.required]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: ()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl)=>{
      return control.value===control.parent?.get(matchTo)?.value? null: {isMatching: true}
    }
  }

  // register(){
  //   const dob=this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
  //   this.registerForm.patchValue({DateOfBirth: dob});
  //   this.accountService.register(this.registerForm.value).subscribe({
  //     next: _=> this.router.navigateByUrl('/members'),
  //     error: error=> this.validationError=error
  //   })
  // }

  register() {
  const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
  let registerDto = this.registerForm.value
  registerDto.dateOfBirth = dob;
  this.accountService.register(registerDto).subscribe({
    next: _ => this.router.navigateByUrl('/members'),
    error: error => this.validationError = error
  });
}

  cancel(){
    this.cancelRegister.emit(false);
  }

  // private getDateOnly(dob: string | undefined){
  //   console.log(dob);
  //   if(!dob)return;

  //   var d= new Date(dob).toISOString().slice(0,10);
  //   console.log(d);
  //   return d;
  // }

  private getDateOnly(dob: string | undefined): string | undefined {
  if (!dob) return;

  const date = new Date(dob);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return String(`${day} ${month} ${year}`);
}

}
