import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, ToastController, Events } from 'ionic-angular';

import { ThfStorageService } from '@totvs/thf-storage';
import { ThfSyncService } from '@totvs/thf-sync';

import { TabsPage } from '../tabs/tabs';

// import { UserData } from '../../providers/user-data';

// import { UserOptions } from '../../interfaces/user-options';

// import { TabsPage } from '../tabs-page/tabs-page';
// import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login = { username: '', password: '' };
  submitted = false;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public toastCtrl: ToastController,
    private thfSync: ThfSyncService,
    private thfStorage: ThfStorageService
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.thfSync.getModel('Users').find().exec().then(data => {
        const foundUser = data.items.find(user => {
          return (user.username === this.login.username) && (user.password === this.login.password);
        })

        foundUser ? this.logIn(foundUser) : this.createToast();
      });
    }
  }

  onSignup() {
    // this.navCtrl.push(SignupPage);
  }

  createToast () {
    const toast = this.toastCtrl.create({
      message: 'User or password are incorrect',
      duration: 3000,
      position: 'top',
      cssClass: 'toaster'
    });
    toast.present();
  }

  logIn(foundUser) {
    this.thfStorage.set('login', { userId: foundUser.id }).then(() => {
      this.events.publish('user:login');
      this.navCtrl.push(TabsPage)
    });
  }

}
