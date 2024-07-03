import {Component, OnInit} from '@angular/core';
import {PocketbaseService} from "../../services/pocketbase.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-thread-detail',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './thread-detail.component.html',
  styleUrl: './thread-detail.component.css'
})
export class ThreadDetailComponent implements OnInit {
  thread: any;
  posts: any[] = [];
  newPostContent: string = '';
  perPage = 10; // Number of items per page
  currentPage = 1; // Current active page

  constructor(
    private route: ActivatedRoute,
    private pbService: PocketbaseService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const userId = this.pbService.getCurrentUser()?.['id'];
      console.log(userId)
      this.thread = await this.pbService.getThreadById(id);
      this.posts = await this.pbService.getPostsByThreadId(id);
      console.log(this.posts)
    }
  }

  async createPost() {
    await this.pbService.createPost({
      thread_id: this.thread.id,
      content: this.newPostContent
    });
    this.posts = await this.pbService.getPostsByThreadId(this.thread.id);
    this.newPostContent = '';
  }

  get paginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    return this.posts.slice(startIndex, startIndex + this.perPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.posts.length / this.perPage)) {
      this.currentPage += 1;
    }
  }

  async deletePost(id: string){
    this.posts.splice(this.posts.indexOf(id), 1);
    await this.pbService.deletePost(id)
  }

  async updatePost(post: any) {
    console.log(post);
    const updatePost = {collectionId: post.collectionId, content: post.content, collectionNumber: post.collectionName, id: post.id, thread_id: post.thread_id, };
    await this.pbService.updatePost(post.id, updatePost);
  }
}
