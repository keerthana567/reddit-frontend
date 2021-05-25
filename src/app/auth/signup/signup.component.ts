import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { SignupRequestPayload } from './singup-request.payload';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupRequestPayload: SignupRequestPayload;
  signupForm: FormGroup;
  UserExists: Boolean=false;
  UserExists1: Boolean=false;

  constructor(private authService: AuthService, private router: Router,
    private toastr: ToastrService) {
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''

    };
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.compose([Validators.maxLength(30), Validators.required,this.VerifyUser.bind(this)])),
      email: new FormControl('', [Validators.required, Validators.email,this.Verifyemail.bind(this)]),
      password: new FormControl('', Validators.required),
    });
  }

  Verifyemail(email)
 {
    // console.log("functioncall");
   this.authService.getVerifyEmail(email.value)
      .subscribe(data => {
        // console.log(data);
        // console.log(typeof data);
        if(data==true)
        {
          // console.log(email.value,this.signupForm.get('email'));
          this.UserExists=false;
          // console.log("if");

       }
         else
         {
          this.UserExists=true;
          // return {valid:false}
          this.signupForm.get('email').setErrors({notValid:true});
          // console.log(email.value,this.signupForm.get('email'));
          this.toastr.error('email already exists');
        }
      } 
      );
     
  }
  VerifyUser(username)
  {
    // console.log("functioncall");
    
 this.authService.getVerifyUser(username.value)
    .subscribe(data => {
      if(data==true)
      {
        console.log("gfhddddddddddd");
          this.UserExists1=false;
     }
       else
       {
         console.log("ffffffffffff");
        console.log(data);
        this.UserExists1=true;
        this.signupForm.get('username').setErrors({notValid1:true});
        this.toastr.error('username already exists');
      }
    } 
    );
   
}

  signup() {
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;
    

    this.authService.signup(this.signupRequestPayload)
      .subscribe(data => {
        // console.log(data);
       
         
          // console.log("if");
        this.router.navigate(['/login'],
          { queryParams: { registered: 'true' } });
      }, error => {
        // console.log(error);
        this.toastr.error('User email already exists');
      });
      
  }
}
