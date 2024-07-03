import { Component } from '@angular/core';
import {PocketbaseService} from "../../services/pocketbase.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-thread-create',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './thread-create.component.html',
  styleUrl: './thread-create.component.css'
})
export class ThreadCreateComponent {
  title: string = '';
  content: string = '';

  constructor(
    private pbService: PocketbaseService,
    private router: Router
  ) {}

  async createThread() {
    const newThread = await this.pbService.createThread({
      title: this.title,
      content: this.content
    });
    this.router.navigate(['/thread', newThread.id]);
  }
}
