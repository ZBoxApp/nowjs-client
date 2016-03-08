# NowJs Client

This is a library to use in your front-end app to interact with the **ZBox Now!** API

### Download & Install

You have different ways of downloading and installing the library

#### Npm

In your project just install the library with npm

`npm install nowjs-client`

#### Bower

In your project just install the library with npm

`bower install nowjs-client`

#### Download from GitHub

Download the .tar.gz from GitHub releases uncompress it and copy it somewhere in your project.

[https://github.com/ZBoxApp/nowjs-client/releases/download/v0.1.3/nowjs-client-v0.1.3.tar.gz](https://github.com/ZBoxApp/nowjs-client/releases/download/v0.1.3/nowjs-client-v0.1.3.tar.gz)

#### Download from S3 or use it as a CDN

Download the js file from Amazon S3 or reference it directly in your project from:

[https://s3-sa-east-1.amazonaws.com/zbox-now/nowjs-client/nowjs-client-v0.1.3.min.js](https://s3-sa-east-1.amazonaws.com/zbox-now/nowjs-client/nowjs-client-v0.1.3.min.js)

Or download the .tar.gz

[https://s3-sa-east-1.amazonaws.com/zbox-now/nowjs-client/nowjs-client-v0.1.3.tar.gz](https://s3-sa-east-1.amazonaws.com/zbox-now/nowjs-client/nowjs-client-v0.1.3.tar.gz)

### Usage

In your HTML file reference the plugin

```HTML
    <script src="<path-to-the-js-file/nowjs-client-v0.1.3.min.js"></script>
```


### API

When referencing the library in your project the `window` object will have another object called `zbox`.

To use the library *API* you need to first initialize it.

#### initialize(opts)

`zbox.initialize(object)`

**opts** must have set the following properties:

* `client_id`: The client ID provided by the **ZBox Now!** platform.
* `client_secret`: The client Secret provided by the **ZBox Now!** platform.
* `username`: The username which you want to appear in **ZBox Now!** when posting a new message.
* `icon_url`: The URL of an *.png* image to use as an icon or avatar for the user when posting a new message in **ZBox Now!**.


After you have initialize your API you will be able to use the following:

#### Channels

All access to the API related to channels lives inside the object

`zbox.channels`

##### getAll(string, function)

`zbox.channels.getAll(teamName, callback)`

Returns all the channels available for a team.

* `teamName`: The name of the team
* `callback(error, channels)`: A callback function to be called with the result of getting all the channels for a team
    * `error`: Object
        ```javascript
        {
          status: "Number with the status code",
          message: "String with error details"
        }
        ```
    * `channels`: Array of Objects
        ```javascript
        [{
          id: "String with the id of the channel",
          type: "String channel or group",
          display_name: "String with the name of the channel as it appears to the users",
          name: "String with the name of the channel to use as an identifier"
        }]
        ```
#### getMembers(teamName, channelId, limit, callback)

`zbox.channels.getMembers(string, string, number, function)`

Returns the members for the specified team channel.

* `teamName`: The name of the team
* `channelId`: The id of the channel to get the members from.
* `limit`: The amount of members to return. If set to *0 or less* it will return all the members.
* `callback(error, members)`: A callback function to be called with the result of getting the channel members.
    * `error`: Object
         ```javascript
          {
            status: "Number with the status code",
            message: "String with error details"
          }
         ```
    * `members`: Object
        ```javascript
        {
          id: 'String with the id of the channel queried as string',
          members_count: "Number with the amount of memebrs in the channel",
          members: [{
              email: "String with member email address",
              id: "String with member user id",
              nickname: "String with member nickname (only present if it has one)",
              roles: "String with the role of the member (only present if it has one)",
              username: "String with member username"
          }]
        }
        ```

#### Users

All access to the API related to users lives inside the object

`zbox.users`

##### getAll(teamName, callback)

`zbox.users.getAll(string, function)`

Returns all the users available for a team.

* `teamName`: The name of the team
* `callback(error, users)`: A callback function to be called with the result of getting all the users for a team
    * `error`: Object
        ```javascript
        {
          status: "Number with the status code",
          message: "String with error details"
        }
        ```
    * `users`: Array of Objects
        ```javascript
        [{
          id: "String with the user id",
          email: "String with the user email address",
          first_name: "String with the user first name (only present if it has been set)",
          last_name: "String with the user first name (only present if it has been set)",
          nickname: "String with the user nickname (only present if it has been set)",
          locale: "String with the user preferred locale",
          username: "String with the username"
        }]
        ```
##### getStatuses(teamName, usersId, callback)

`zbox.users.getStatuses(string, array, function)`

Return the status for the specified users. Status can be: `online`, `away` or `offline`.

* `teamName`: The name of the team
* `usersId`: Array with the id of every user from which to get the status
* `callback(error, statuses)`: A callback function to be called with the result of getting all the users statuses
    * `error`: Object
        ```javascript
        {
            status: "Number with the status code",
            message: "String with error details"
        }
        ```
    * `statuses`: Object
        ```javascript
        {
          key1: "String with status",
          key2: "String with status"
        }
        ```
        *key1, key2, etc..* corresponds to each of the userIds used in the array that match an user id in the team.

#### Messages

Send messages to a Channel in **ZBox Now!** using the API. There are two kind of messages that can be sent, a post to a
 specific channel or an ephemeral post to a specific user.

 *Ephemeral posts are messages that do not persists*

All access to the API related to messages lives inside the object

`zbox.messages`

#### send(token, channelName, message, callback)

`zbox.messages.send(string, string, string, function)`

* `token`: The token to send messages which was granted by the incoming webhook
* `channelName`: The identifier name of the channel. If not channelName is set then it will post to the default Channel.
* `message`: The message to be sent (markdown supported)
* `callback(error)`: A callback function to be called when the message is sent. if it was sent successfully then error is `null`
    * `error`: Object
        ```javascript
        {
            status: "Number with the status code",
            message: "String with error details"
        }
        ```

#### sendEphemeral(token, channelName, userId, message, callback)

`zbox.messages.sendEphemeral(string, string, string, string, function)`

* `token`: The token to send messages which was granted by the incoming webhook
* `channelName`: The identifier name of the channel. If not channelName is set then it will post to the default Channel.
* `userId`: The id of the user to send the message to
* `message`: The message to be sent (markdown supported)
* `callback(error)`: A callback function to be called when the message is sent. if it was sent successfully then error is `null`
    * `error`: Object
        ```javascript
        {
            status: "Number with the status code",
            message: "String with error details"
        }
        ```
