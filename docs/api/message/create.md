## POST: ```/api/v1/messages```

Sends a message.

### Request

#### Headers
```Accept: application/json```

```Content-Type: application/json```

```Authorization: "JWT JWT_TOKEN_STRING"```

#### Body

Key | Type | Description
--- | ---- | ----------- 
```channel``` | _id | **Optional.** The channel ID this message is associated with. Can use "receiver" instead.
```receiver``` | _id | **Optional.** Receiver's user ID. Appends message to channel with this user.
```receivers``` | [_id] | **Optional.** Array of user IDs. Appends message to channel with these users.
```expireAt``` | date | **Required.** The time this message expires. Minimum time is Date.now().
```content``` | string | **Required.** The message content.


#### Example
```
POST /api/v1/messages

Accept: application/json
Cache-Control: no-cache
Content-Type: application/json
Authorization: "JWT b9h347685934b.f37498gf3847.njf786394fgb32748y"
{
  message: {
    "channel": "53jihb3f7bu34r4f4",
    "expireAt": Date.now()+600000,
    "content": "this message will go to the appropriate channel"
  }
}
```

### Responses

#### Success

##### ```201 Created```
```
{
  message: {
    "_id": "5818e5010ef048201c6adee4",
    "updatedAt": "2016-11-02T16:29:48.588Z",
    "createdAt": "2016-11-02T16:29:48.588Z",
    "channel": "53jihb3f7bu34r4f4",
    "expireAt": "2016-11-02T16:39:48.588Z",
    "content": "this message will go to the appropriate channel"
  }
}
```

#### Errors

##### ```422 Unprocessable Entity```
The request didn't contain all necessary information.
For example, it did not contain content.

##### ```401 Unauthorized```
The request didn't contain a valid JWT Header.
