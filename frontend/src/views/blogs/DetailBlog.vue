<template>
  <div class="container is-widescreen">
    <section class="section" v-if="error">
      <div class="container is-widescreen">
        <div class="notification is-danger">{{ error }}</div>
      </div>
    </section>
    <section class="hero">
      <div class="hero-body">
        <p class="title">{{ blog.title }}</p>
      </div>
    </section>
    <section class="section">
      <div class="content">
        <div class="card has-background-light">
          <div class="card-image pt-5">
            <div class="columns">
              <div v-for="image in images" :key="image.id" class="column">
                <figure class="image">
                  <img :src="'http://localhost:3000/' + image.file_path" alt="Placeholder image"
                    style="height: 500px; object-fit: cover;" />
                </figure>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="content">{{ blog.content }}</div>
            <div class="container pb-3">
              <p class="subtitle">Comments</p>
              <div class="columns">
                <div class="column is-7">
                  <input type="text" class="input" v-model="commTxt" placeholder="Add new comment" />
                </div>
                <div class="column is-2">
                  <button @click="addComment" class="button">Add comment</button>
                </div>
                <div class="column is-3">
                  <div class="file">
                    <label class="file-label">
                      <input class="file-input" type="file" id="file" name='comment_image' ref="file"
                        @change="handleFileUpload()">
                      <span class="file-cta">
                        <span class="file-icon">
                          <i class="fas fa-upload"></i>
                        </span>
                        <span class="file-label">
                          Choose an image…
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
            <div v-for="(comment, index) in comments" :key="comment.id" class="box">
              <article class="media">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <img v-if="comment.file_path" :src="'http://localhost:3000/' + comment.file_path" alt="">
                    <img v-else src="https://bulma.io/images/placeholders/128x128.png" alt="Image" />
                  </figure>
                </div>
                <div v-if="index === editToggle" class="media-content">
                  <div class="content">
                    <input v-model="editCommentMessage" class="input" type="text" />
                    <p class="is-size-7">{{ comment.comment_date }}</p>
                  </div>
                  <nav class="level">
                    <div class="level-left">
                      <a class="level-item" aria-label="like">
                        <span class="icon is-small pr-3">
                          <i class="fas fa-heart" aria-hidden="true"></i>
                        </span>
                        Like (0)
                      </a>
                    </div>
                    <div class="level-right">
                      <div class="level-item">
                        <button @click="saveEditComment(comment.id, index)" class="button is-primary">
                          <span>Save Comment</span>
                          <span class="icon is-small">
                            <i class="fas fa-edit"></i>
                          </span>
                        </button>
                      </div>
                      <div class="level-item">
                        <button @click="editToggle = -1" class="button is-info is-outlined">
                          <span>Cancel</span>
                          <span class="icon is-small">
                            <i class="fas fa-times"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>
                <div v-else class="media-content">
                  <div class="content">
                    <p>{{ comment.comment }}</p>
                    <p class="is-size-7">{{ comment.comment_date }}</p>
                  </div>
                  <nav class="level">
                    <div class="level-left">
                      <a @click="addLikeComment(comment.id)" class="level-item" aria-label="like">
                        <span class="icon is-small pr-3">
                          <i class="fas fa-heart" aria-hidden="true"></i>
                        </span>
                        Like ({{ comment.like }})
                      </a>
                    </div>
                    <div v-if="isOwner(comment)" class="level-right">
                      <div class="level-item">
                        <button @click="editToggle = index; editCommentMessage = comment.comment"
                          class="button is-warning">
                          <span>Edit</span>
                          <span class="icon is-small">
                            <i class="fas fa-edit"></i>
                          </span>
                        </button>
                      </div>
                      <div class="level-item">
                        <button @click="deleteComment(comment.id, index)" class="button is-danger is-outlined">
                          <span>Delete</span>
                          <span class="icon is-small">
                            <i class="fas fa-times"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>
              </article>
            </div>
          </div>
          <footer class="card-footer">
            <router-link class="card-footer-item" to="/">To Home Page</router-link>
            <a v-if="isBlogOwner(blog)" class="card-footer-item" @click="deleteBlog">
              <span>Delete this blog</span>
            </a>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ['user'],
  data() {
    return {
      blog: {},
      comments: [],
      images: [],
      file: null,
      error: null,
      commTxt: "",
      editToggle: -1,
      editCommentMessage: "",
    };
  },
  mounted() {
    this.getBlogDetail(this.$route.params.id);
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    isBlogOwner(blog) {
      if (!this.user) {
        return false
      }
      else {
        if (this.user.role == 'admin' || blog.create_by_id === this.user.id) {
          return true
        }
        return false

      }

    }, isOwner(comments) {
      if (!this.user) {
        return false
      }
      else {
        console.log(comments)

        if (this.user.role == 'admin' ||comments.comment_by_id === this.user.id) {
          console.log(comments.comment_by_id)
          return true
        }
        return false

      }

    },
    getBlogDetail(blogId) {
      axios
        .get(`http://localhost:3000/blogs/${blogId}`)
        .then((response) => {
          this.blog = response.data.blog;
          this.images = response.data.images;
          this.comments = response.data.comments;
          console.log(this.images[0].file_path)
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    addComment() {
      let formData = new FormData();
      formData.append("comment", this.commTxt)
      formData.append("comment_image", this.file)
      formData.append("user_id", this.user.id)
      axios
        .post(`http://localhost:3000/${this.blog.id}/comments`, formData)
        .then((response) => {
          console.log(response)
          this.commTxt = "";
          this.comments.push(response.data);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    saveEditComment(commentId, index) {
      axios
        .put(`http://localhost:3000/comments/${commentId}`, {
          comment: this.editCommentMessage,
        })
        .then((response) => {
          this.comments[index].comment = response.data.comment;
          this.editToggle = -1;
        })
        .catch((error) => {
          this.error = error.message;
        });
    },
    deleteComment(commentId, index) {
      const result = confirm(`Are you sure you want to delete this comment`);
      if (result) {
        axios
          .delete(`http://localhost:3000/comments/${commentId}`)
          .then((response) => {
            console.log(response);
            this.comments.splice(index, 1);
          })
          .catch((error) => {
            this.error = error.message;
          });
      }
    },
    addLikeComment(commentId) {
      axios
        .put(`http://localhost:3000/comments/addlike/${commentId}`)
        .then((response) => {
          let selectedComment = this.comments.filter(
            (e) => e.id === commentId
          )[0];
          console.log(selectedComment);
          selectedComment.like = response.data.like;
          console.log(selectedComment);
        })
        .catch((error) => (this.error = error.message));
    },
    deleteBlog() {
      const result = confirm(
        `Are you sure you want to delete \'${this.blog.title}\'`
      );
      if (result) {
        axios
          .delete(`http://localhost:3000/blogs/${this.blog.id}`)
          .then((response) => {
            this.$router.push("/");
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      }
    },
  },
};
</script>