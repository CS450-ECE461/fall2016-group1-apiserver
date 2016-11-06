## POST: ```/api/v1/auth/jwt```

Request JWT Authorization token for user.

### Request

#### Headers
```Accept: application/json```

```Content-Type: application/json```

#### Body

Key | Type | Description
--- | ---- | ----------- 
```username``` | string | **Required.** The user's login username. Can be their handle OR email address.
```password``` | string | **Required.** The user's password.


#### Example
```
POST /api/v1/auth/jwt

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json

{
  "username": "jdoe@example.org",
  "password": "totally!insecure@123",
}
```

### Responses

#### Success

##### ```200 OK```
```
{
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjEzMDA4MTkzODAsIm5hbWUiOiJDaHJpcyBTZXZpbGxlamEiLCJhZG1pbiI6dHJ1ZX0.03f329983b86f7d9a9f5fef85305880101d5e302afafa20154d094b229f75"
}
```
This token can be included in future requests to authorize the request in the context of the authorized user.

#### Errors

##### ```422 Unauthorized```

The user must exist in the database and password must match.
```
{
    error: 'Authentication Error.' 
}
```
