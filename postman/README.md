# Postman quick test order

1. POST `http://localhost:5000/api/auth/register`
```json
{"name":"Test Student","email":"test@example.com","password":"password123"}
```

2. Copy the returned token.
3. In Postman, use Authorization > Bearer Token for protected endpoints.

GET `/api/profile`

PUT `/api/profile`
```json
{
  "education":"B.Tech",
  "college":"Example University",
  "branch":"AI & ML",
  "year":"3rd Year",
  "skills":["Python","React","SQL"],
  "interests":["AI","Web Development"],
  "strengths":["Problem Solving","Creativity"],
  "careerGoals":"Become a full-stack AI engineer"
}
```

GET `/api/assessment/questions`

POST `/api/assessment/submit`
```json
{
  "answers":[
    {"questionId":1,"value":5},
    {"questionId":2,"value":4}
  ]
}
```
For the actual request, send all 20 answers.
