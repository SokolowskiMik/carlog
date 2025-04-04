// import { Component } from '@angular/core';
// import { AuthService } from '../../data/auth.service';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// import "firebase/auth";
// import firebase from 'firebase/compat/app';

// @Component({
//   selector: 'app-login-twitter',
//   imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule,MatButtonModule,
//     MatDatepickerModule,MatNativeDateModule,
//     AngularFireAuthModule
//   ],
//   templateUrl: './login-twitter.component.html',
//   styleUrl: './login-twitter.component.scss'
// })
// export class LoginTwitterComponent {
//   twitterLoginForm!: FormGroup;


//   constructor(public authService : AuthService, private fb: FormBuilder) {}

//   ngOnInit() {
//     this.twitterLoginForm = this.fb.group({
//       email: ['', Validators.required],
//       password: ['', Validators.required],
//     });
//   }

//   onSubmit() {
//     if (this.twitterLoginForm.valid) {
//       console.log('Register Data:', this.twitterLoginForm.value);
//       this.authService.register(this.twitterLoginForm.value.email, this.twitterLoginForm.value.password)
//     } else {
//       console.log('Form is invalid');
//     }
//   }

//   // These samples are intended for Web so this import would normally be
// // done in HTML however using modules here is more convenient for
// // ensuring sample correctness offline.

// twitterProvider() {
//   // [START auth_twitter_provider_create]
//   var provider = new firebase.auth.TwitterAuthProvider();
//   // [END auth_twitter_provider_create]

//   // [START auth_twitter_provider_params]
//   provider.setCustomParameters({
//     'lang': 'es'
//   });
//   // [END auth_twitter_provider_params]
// }

// twitterSignInPopup(provider) {
//   // [START auth_twitter_signin_popup]
//   firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then((result) => {
//       /** @type {firebase.auth.OAuthCredential} */
//       var credential = result.credential;

//       // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
//       // You can use these server side with your app's credentials to access the Twitter API.
//       var token = credential.accessToken;
//       var secret = credential.secret;

//       // The signed-in user info.
//       var user = result.user;
//       // IdP data available in result.additionalUserInfo.profile.
//         // ...
//     }).catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
//       // ...
//     });
//   // [END auth_twitter_signin_popup]
// }

// twitterSignInRedirectResult() {
//   // [START auth_twitter_signin_redirect_result]
//   firebase.auth()
//     .getRedirectResult()
//     .then((result) => {
//       if (result.credential) {
//         /** @type {firebase.auth.OAuthCredential} */
//         var credential = result.credential;

//         // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
//         // You can use these server side with your app's credentials to access the Twitter API.
//         var token = credential.accessToken;
//         var secret = credential.secret;
//         // ...
//       }

//       // The signed-in user info.
//       var user = result.user;
//       // IdP data available in result.additionalUserInfo.profile.
//         // ...
//     }).catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
//       // ...
//     });
//   // [END auth_twitter_signin_redirect_result]
// }

// twitterProviderCredential(accessToken, secret) {
//   // [START auth_twitter_provider_credential]
//   var credential = firebase.auth.TwitterAuthProvider.credential(accessToken, secret);
//   // [END auth_twitter_provider_credential]
// }

// }
