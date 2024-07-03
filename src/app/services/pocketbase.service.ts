import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class PocketbaseService {
  private pb: PocketBase;
  public currentUser: any;

  constructor() {
    this.pb = new PocketBase('http://127.0.0.1:8090'); // URL de votre instance PocketBase
  }

  async getThreads() {
    return await this.pb.collection('threads').getFullList();
  }

  async getUser(id: string){
    const response: any = await this.pb.collection('users').getOne(id);
    response.avatar = this.pb.files.getUrl(response, response.avatar)
    return response
  }

  async getThreadById(id: string) {
    return await this.pb.collection('threads').getOne(id);
  }

  async createThread(data: any) {
    data.creator = this.pb.authStore.model?.['id']
    return await this.pb.collection('threads').create(data);
  }

  async createPost(data: any) {
    data.creator = this.pb.authStore.model?.['id']
    return await this.pb.collection('posts').create(data);
  }

  async updatePost(id: string, data: any) {
    return await this.pb.collection('posts').update(id, data);
  }

  async deletePost(id: string) {
    await this.pb.collection('posts').delete(id);
  }

  async getPostsByThreadId(threadId: string) {
    const response: any = await this.pb.collection('posts').getFullList({
      filter: `thread_id='${threadId}'`
    });
    for (const post of response) {
      post.deletable = this.pb.authStore.model?.['id'] === post.creator
      post.creator = await this.getUser(post.creator)
    }
    return response
  }

  async signIn(email: string, password: string) {
    this.currentUser = await this.pb.collection('users').authWithPassword(email, password);
    return this.currentUser
  }

  async signUp(data: any) {
    return await this.pb.collection('users').create(data);
  }

  async signOut() {
    this.pb.authStore.clear()
    // Vous pourriez également vouloir ajouter une méthode de déconnexion dans votre back-end et appeler ici.
  }

  isAuthenticated() {
    return this.pb.authStore.isValid
  }

  getCurrentUser() {
    return this.pb.authStore.model;
  }
}
