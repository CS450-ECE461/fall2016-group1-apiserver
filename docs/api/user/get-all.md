## GET: ```/api/v1/users```

Gets a set of users, optionally matching a set of conditions.



Client authentication is required (when implemented), but user
authentication is optional.

### Request

#### Headers

```Accept: application/json```

#### Query

##### ```limit```: int

Limits the number of results to return. See ```skip``` for an example
on how to use this field with pagination. By default, this is set to 20.
The maximum accepted value is 100.

##### ```sort```: string

Sorts the results on a particular property.

##### ```skip```: int

Skips a certain number of results, and returns up to ```limit``` results
after ```skip```. For example, if you set ```limit``` to 20 and ```skip```
to 20, you will get results 21-40, assuming they exist. Using
these fields allows you to do pagination.

#### Body

No request body is accepted.

### Examples

#### Requests

##### Pagination
```
GET /api/v1/users?skip=20&limit=20

Accept: application/json
Cache-Control: no-cache
```

#### Responses

##### Success

Returns a set of users matching the conditions.

######```200 OK```
```
{
  users: [
    {
      "_id": "5818e5010ef048201c6adee4",
      "updatedAt": "2016-11-02T16:29:48.588Z",
      "createdAt": "2016-11-02T16:29:48.588Z",
      "firstName": "John",
      "lastName": "Doe",
      "emailAddress": "jdoe@example.org",
      "handle": "jdoe123"
    },
    {
      //...
    }
  ]
}
```
Sensitive values such as ```password``` are never returned.
##### Errors

###### ```404 Not Found```
You'll get this when there's no user matching the conditions.