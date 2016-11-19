## DELETE: ```/api/v1/users/{id}```

Deletes a particular user based on a unique value.

The key ```id``` can be a value from ```_id```, ```handle```, or
```emailAddress```. If you are aiming for consistency, you should
be using ```_id``` here, as it will never change for any particular
user. It's also faster, as it's always the first field to be matched.

Client authentication is required (when implemented), but user
authentication is optional.

### Request

#### Headers

```Accept: application/json```

#### Body

No request body is accepted.

### Examples

#### Requests

##### By ```_id```
```
DELETE /api/v1/users/5818e5010ef048201c6adee4

Accept: application/json
Cache-Control: no-cache
```

##### By ```handle```
```
DELETE /api/v1/users/jdoe123

Accept: application/json
Cache-Control: no-cache
```

##### By ```emailAddress```
```
DELETE /api/v1/users/jdoe%40example.org

Accept: application/json
Cache-Control: no-cache
```

#### Responses


##### Success

###### ```204 No Content```
The user was deleted. We don't return anything.

##### Errors

###### ```404 Not Found```
You'll get this when there's no user that has a ```_id```, ```handle```,
or ```emailAddress``` that matches the ```id``` you provided in the
route. The non-existant user can therefore not be deleted.
