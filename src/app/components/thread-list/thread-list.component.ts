import {Component, OnInit} from '@angular/core';
import {PocketbaseService} from "../../services/pocketbase.service";
import {RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-thread-list',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './thread-list.component.html',
  styleUrl: './thread-list.component.css'
})
export class ThreadListComponent implements OnInit {
  threads: any[] = [];
  page = 1;
  pageSize = 2;
  collectionSize = this.threads.length;

  get displayData(): any[] {
    return this.threads
      .map((thread, i) => ({id: i + 1, ...thread}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  nextPage() {
    this.page = this.page + 1;
  }

  previousPage() {
    this.page = this.page - 1;
  }

  constructor(private pbService: PocketbaseService) {}

  async ngOnInit() {
    this.threads = await this.pbService.getThreads();
    for (const thread of this.threads) {
      console.log(thread);
      const count = await this.pbService.getPostsByThreadId(thread.id)
      thread.creator = await this.pbService.getUser(thread.creator)
      console.log(thread);
      thread.posts_count = count.length
    }
    this.collectionSize = this.threads.length;
    console.log(this.threads);
  }

  async logout() {
    await this.pbService.signOut()
  }

  protected readonly Math = Math;
}
