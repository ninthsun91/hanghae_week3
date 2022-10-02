
## Why: 과제 제출시에는 아래 질문을 고민해보고 답변을 함께 제출해주세요.
### 1. 수정, 삭제 API의 request를 어떤 방식으로 사용하셨나요? (param, query, body)
#### posts

수정: PUT, "/posts/:_postId", route parameter로 postId 전달

삭제: DELETE, "/posts/:_postId", route parameter로 postId 전달

#### comments

수정: PUT, "/comments/:_commentId", route parameter로 commentId 전달

삭제: DELETE, "/comments/:_commentId", route parameter로 commentId 전달



### 2. 어떤 상황에 어떤 방식의 request를 써야하나요?

데이터조회 > GET

데이터작성 > POST

데이터수정 > PUT

데이터삭제 > DELETE


### 3. RESTful한 API를 설계했나요? 어떤 부분이 그런가요? 어떤 부분이 그렇지 않나요?

각각의 요청에 대해 별개의 URL을 가지며 데이터를 JSON 형태로 클라이언트에게 반환


### 4. 역할별로 Directory Structure를 분리하였을 경우 어떠한 이점이 있을까요?

유지보수가 용이함
