import { Component, Input } from '@angular/core';
import {PocketbaseService} from "../../services/pocketbase.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  @Input() threadId!: string;
  content: string = '';

  constructor(private pbService: PocketbaseService) {}

  async createPost() {
    if (this.content.trim()) {
      await this.pbService.createPost({
        thread_id: this.threadId,
        content: this.content
      });
      this.content = '';
      // Optionally, you can emit an event to the parent component to refresh the list of posts
    }
  }
}
