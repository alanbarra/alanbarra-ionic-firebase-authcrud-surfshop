import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public wavesPosition: number = 0;
  private wavesDifference: number = 100;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
      this.presentAlert('Sucesso', 'Login efetuado com sucesso.');
      console.log(this.authService.getAuth());
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    if (this.userRegister.password !== this.userRegister.confirmPassword) {
      this.loading.dismiss();
      this.presentAlert('Erro', 'Senhas devem ser iguais');
    } else {
      try {
        await this.authService.register(this.userRegister);
        this.presentAlert('Sucesso', 'Cadastro realizado.');
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading.dismiss();
      }
    }
  }

  handleError(error: any) {
    if (error.code === 'auth/invalid-email') {
      this.presentAlert('Erro', 'Email inválido');
    }
    if (error.code === 'auth/email-already-in-use') {
      this.presentAlert('Erro', 'Já existe cadastro com esse email');
    }
    if (error.code === 'auth/weak-password') {
      this.presentAlert('Erro', 'Senha deve conter pelo menos 6 caracteres');
    }
    if (error.code === 'auth/wrong-password') {
      this.presentAlert('Erro', 'Senha não confere');
    }
    if (error.code === 'auth/user-not-found') {
      this.presentAlert('Erro', 'Usuário não encontrado');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor, aguarde',
    });
    return this.loading.present();
  }

  async presentAlert(header: string, msg: string) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
