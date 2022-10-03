
깃헙에는 MongoDB Atlas로 연결되어있지만, 서버는 local MongoDB에요.
<br/>
<br/>

![aws](https://i.imgur.com/bUBPiE3.png)

<br/>
<br/>
<br/>


## API

| 기능 | METHOD | URL | REQUEST | RESPONSE |
|---|---|---|---|---|
| 게시글 전체목록 | GET | "/posts" | | { data: [{ postId, user, title, createdAt }] } |
| 게시글 작성 | POST | "/posts" | { user, password, title, content } | { message } |
| 게시글 조회 | GET | "/posts/:_postId" | | { data: { postId, user, title, content, createdAt }} |
| 게시글 수정 | PUT | "/posts/:_postId" | { password, title, content } | { message } |
| 게시글 삭제 | DELETE | "/posts/:_postId" | { password } | { message } |
| 댓글 작성 | POST | "/comments/:_postId" | { user, password, content } | { message } |
| 댓글 목록 | GET | "/comments/:_postId" | | { data: [{ commentId, user, content, createdAt }] } |
| 댓글 수정 | PUT | "/comments/:_commentId" | { password, content } | { message } |
| 댓글 삭제 | DELETE | "/comments/:_commentId" | { password } | | { message } |
