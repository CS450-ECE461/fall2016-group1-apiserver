## POST: ```/api/v1/users/me```

Get information for authenticated user.

### Request

#### Headers
```Accept: application/json```

```Content-Type: application/json```

#### Body

Key | Type | Description
--- | ---- | ----------- 
```auth_token``` | string | **Required.** The user's JWT token. Aquired from successful authentication.


#### Example
```
POST /api/v1/users/me

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json

{
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjEzMDA4MTkzODAsIm5hbWUiOiJDaHJpcyBTZXZpbGxlamEiLCJhZG1pbiI6dHJ1ZX0.03f329983b86f7d9a9f5fef85305880101d5e302afafa20154d094b229f75"
}
```

### Responses

#### Success

##### ```200 OK```
```
{
  "_id": "5818e5010ef048201c6adee4",
  "updatedAt": "2016-11-02T16:29:48.588Z",
  "createdAt": "2016-11-02T16:29:48.588Z",
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "jdoe@example.org",
  "handle": "jdoe123"
}
```
Sensitive fields like ```password``` are never returned.

#### Errors

##### ```401 Unauthorized```

If a valid token can not be found in the JSON body of the request under the heading "auth_token", the following is given.
```
{
    error: 'Invalid Token.' 
}
```