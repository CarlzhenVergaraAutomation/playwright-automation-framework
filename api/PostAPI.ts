import { APIRequestContext } from '@playwright/test'; //importing APIRequestContext from Playwright test package

export class PostsAPI {
  //PostsAPI class to handle API requests related to posts
  constructor(private api: APIRequestContext) {} //constructor to initialize the APIRequestContext

  async getPost(postId: number) {
    //function to get a specific post
    return await this.api.get(`/posts/${postId}`); //get request to fetch a post by its ID
  }

  async createPost(data: { title: string; body: string; userId: number }) {
    //function to create a new post
    return await this.api.post('/posts', {
      //post request to create a new post
      data, //data to be sent in the request body
    });
  }

  async updatePost(
    postId: number,
    data: {
      id: number;
      title: string;
      body: string;
      userId: number;
    },
  ) {
    return await this.api.put(`/posts/${postId}`, {
      data,
    });
  }

  async deletePost(postId: number) {
    return await this.api.delete(`/posts/${postId}`);
  }
}
