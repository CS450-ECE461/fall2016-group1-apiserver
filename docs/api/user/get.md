## GET: ```/api/v1/users/{id}```

Gets a particular user based on a unique value.

The key ```id``` can be a value from ```_id```, ```handle```, or
```emailAddress```. If you are aiming for consistency, you should
be using ```_id``` here, as it will never change for any particular
user. It's also faster, as it's always the first field to be matched.

### Request

#### Headers

```Accept: application/json```

#### Body

No request body is accepted.

### Examples

#### Requests

##### By ```_id```
```
POST /api/v1/users/5818e5010ef048201c6adee4

Accept: application/json
Cache-Control: no-cache
```

##### By ```handle```
```
POST /api/v1/users/jdoe123

Accept: application/json
Cache-Control: no-cache
```

##### By ```emailAddress```
```
POST /api/v1/users/jdoe%40example.org

Accept: application/json
Cache-Control: no-cache
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
    "updatedAt": "2016-11-02T16:29:48.588Z",
    "createdAt": "2016-11-02T16:29:48.588Z",
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "jdoe@example.org",
    "handle": "jdoe123"
  }
}
```

##### Errors

###### ```404 Not Found```
You'll get this when there's no user that has a ```_id```, ```handle```,
or ```emailAddress``` that matches the ```id``` you provided in the
route.

