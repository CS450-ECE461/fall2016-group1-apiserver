## PUT: ```/api/v1/users/{id}```

Updates one or more fields on a particular user.

The key ```id``` can be a value from ```_id```, ```handle```, or
```emailAddress```. If you are aiming for consistency, you should
be using ```_id``` here, as it will never change for any particular
user. It's also faster, as it's always the first field to be matched.

Client authentication is required (when implemented), as well as user
authentication.

### Request

#### Headers

```Accept: application/json```

```Content-Type: application/json```

#### Body

These will be the same as [creating](create.md), but you only need
to send the fields that are being updated. ```_id``` can never be
updated

### Examples

#### Requests

##### By ```_id```
```
PUT /api/v1/users/5818e5010ef048201c6adee4

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json

{
  "user": {
    "emailAddress": "jdoe@example.com",
    "handle": "therealjdoe"
  }
}
```

##### By ```handle```
```
PUT /api/v1/users/jdoe123

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json

{
  "user": {
    "emailAddress": "jdoe@example.com",
    "handle": "therealjdoe"
  }
}
```

##### By ```emailAddress```
```
PUT /api/v1/users/jdoe%40example.org

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json

{
  "user": {
    "emailAddress": "jdoe@example.com",
    "handle": "therealjdoe"
  }
}
```

#### Responses

No matter what field you use as ```id``` in the route, you will get
the exact same response. Remember that ```_id``` is auto-generated
and does not change, ever. ```handle``` and ```emailAddress```
are user-specified and can change whenever.  

##### Success

######```200 OK```
```
{
  user: {
    "_id": "5818e5010ef048201c6adee4",
    "updatedAt": "2016-11-02T16:52:23.143Z",
    "createdAt": "2016-11-02T16:29:48.588Z",
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "jdoe@example.com",
    "handle": "jdoe123"
  }
}
```
Sensitive values such as ```password``` are never returned.
You'll also notice that ```updatedAt``` has changed. 
##### Errors

###### ```404 Not Found```
You'll get this when there's no user that has a ```_id```, ```handle```,
or ```emailAddress``` that matches the ```id``` you provided in the
route. The non-existant user can therefore not be updated.