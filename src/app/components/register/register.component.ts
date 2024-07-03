import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PocketbaseService} from "../../services/pocketbase.service";
import {NgClass, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  name = '';
  username = '';
  email = '';
  password = '';
  passwordConfirm= '';
  avatarUrl: string | ArrayBuffer | null = null;
  fileToUpload!: File;
  serverResponse: string|null = null;

  constructor(private pocketbaseService: PocketbaseService, private router: Router) { }

  ngOnInit(): void { }

  async onSubmit(): Promise<void> {
    // Remplacer 'password' par le mot de passe récupéré du formulaire, si nécessaire
    const userData = new FormData();
    userData.append('username', this.username);
    userData.append('email', this.email);
    userData.append('password', this.password);
    userData.append('name', this.name);
    userData.append('avatar', this.fileToUpload);
    userData.append('passwordConfirm', this.passwordConfirm);

    const response: any = await this.pocketbaseService.signUp(userData);
    await this.pocketbaseService.signIn(this.email, this.password);
    if (this.pocketbaseService.isAuthenticated()) {
      await this.router.navigate(['threads']);
    }
    Object.keys(response.data).forEach((key: string) => {
      this.serverResponse = response.data[key].message;
    })
  }

  onFileSelected(event: any): void {
    if (event.target?.files && event.target.files[0]) {
      const file = event.target?.files[0];
      this.fileToUpload = file;
      // Convertir le fichier en url de data pour l'afficher comme aperçu
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.avatarUrl = reader.result;
      };
    }
  }
}
