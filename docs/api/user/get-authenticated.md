## GET: ```/api/v1/users/me```

Get information for authenticated user.

### Request

#### Headers
```Accept: application/json```

```Content-Type: application/json```

```Authorization: "JWT JWT_TOKEN_STRING"```


#### Example
```
GET /api/v1/users/me

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json
Authorization: "JWT b9h347685934b.f37498gf3847.njf786394fgb32748y"

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
