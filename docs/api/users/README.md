# User API

Used to create, update, and delete users. 

## POST: ```/api/v1/users```

Creates a new user.

### Request

#### Headers
```Accept: application/json```

```Content-Type: application/json```

#### Body

Key | Type | Description
--- | ---- | ----------- 
```firstName``` | string | **Required.** The user's first name. Cannot contain numbers.
```middleName``` | string | **Optional.** The user's middle name. Cannot contain numbers.
```lastName``` | string | **Required.** The user's last name. Cannot contain numbers.
```emailAddress``` | string | **Required/Unique.** The user's email address.
```handle``` | string | **Optional/Unique.** The user's screenname. [Why 'handle'?](../../commentary/why-handle.md)
```password``` | string | **Required.** The user's password. Must be greater than 8 characters long and contain at least one special character (!, @, #, $, etc). 


#### Example
```
POST /api/v1/users

Accept: applcation/json
Cache-Control: no-cache
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "jdoe@example.org",
  "password": "totally!insecure@123",
  "handle": "jdoe123"
}
```

### Responses

#### Success

##### ```201 Created```
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

##### ```409 Conflict```

The fields ```emailAddress``` and  ```handle``` must be unique.
```
{
  "errors": [
    {
      "status": 409,
      "code": 11000,
      "title": "Conflict",
      "message": "Already exists"
    }
  ]
}
```

If a field isn't validated, then it will also return ```409 Conflict```. For example,
if you pass ```emailAddress``` as ```test1234example.com```:
```
{
  "errors": [
    {
      "status": 409,
      "title": "Conflict",
      "paths": {
        "emailAddress": {
          "message": "Validator failed for path `emailAddress` with value `test1234example.com`"
        }
      }
    }
  ]
}
```
