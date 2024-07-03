import {Component, OnInit} from '@angular/core';
import { PocketbaseService } from '../../services/pocketbase.service';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  serverResponse: string | null = null;

  constructor(private pocketbaseService: PocketbaseService, private router: Router) { }

  ngOnInit(): void { }

  async onSubmit(): Promise<void> {
    // Replace with your actual login request
    const response = await this.pocketbaseService.signIn(this.email, this.password);
    // console.log(response);
    if (!response.record){
      this.serverResponse = 'authentication failed';
    } else {
      await this.router.navigate(['threads']);
    }
  }
}
