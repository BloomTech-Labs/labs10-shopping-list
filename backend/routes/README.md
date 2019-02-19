# Table of Contents
* [Auth Endpoints](#Auth-Endpoints)
    * [Login](#Login)
* [User Endpoints](#User-Endpoints)
    * [Get User By ID](#Get-User-By-ID)
    * [Get User By Email](#Get-User-By-Email)
    * [Add User](#Add-User)
    * [Update User](#Update-User)
    * [Remove User](#Remove-User)
* [Group Endpoints](#Group-Endpoints)
    * [Get Group](#Get-Group)
    * [Add Group](#Add-Group)
    * [Update Group](#Update-Group)
    * [Remove Group](#Remove-Group)
* [Group Member Endpoints](#GroupMember-Endpoints)
    * [Get All Members](#Get-All-Group-Member)
    * [Get By Group ID](#Get-Group-Member-By-Group-ID)
    * [Get By User ID](#Get-Group-Member-By-User-ID)
    * [Get By User ID && Group ID](#Get-Group-Member-By-User-ID-&&-Group-ID)
    * [Add Group Member](#Add-Group-Member)
    * [Update Group Member](#Update-Group-Member)
    * [Remove Group Member](#Remove-Group-Member)

# API Endpoints
## Auth Endpoints
### Login
Logs the user in through OAuth
* **URL**<br>
/api/auth/login
* **Method:**<br>
`POST`
* **URL Params**<br>
None
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { id: 12, name: "Wildcats"}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/auth/login",
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

## User Endpoints
### Protected
### Get User By ID
Returns json data about a single user.
* **URL**<br>
/api/user/:id
* **Method:**<br>
`GET`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { id: 12, email: "annam45@gmail.com", name: "Anna Marie", profilePicture: "https://i.imgur.com/M8kRKQC.png", "subscriptionType": 1, "createdAt": "2019-02-18T21:04:27.039Z", "updatedAt": "2019-02-18T21:04:27.039Z"}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { message: "The user you requested does not exist."}<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** {message: "Internal Server Error", data: { err: "Error details" } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/user/12",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

### Get User By Email
Returns json data about a single user.
* **URL**<br>
/api/user/email/:email
* **Method:**<br>
`GET`
* **URL Params**<br>
`email=[string]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { id: 12, email: "annam45@gmail.com", name: "Anna Marie", profilePicture: "https://i.imgur.com/M8kRKQC.png", "subscriptionType": 1, "createdAt": "2019-02-18T21:04:27.039Z", "updatedAt": "2019-02-18T21:04:27.039Z"}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { message: "The user you requested does not exist."}<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** {message: "Internal Server Error", data: { err: "Error details" } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/user/email/annam45@gmail.com",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

### Add User
Adds a single user to the database
* **URL**<br>
/api/user/
* **Method:**<br>
`POST`
* **URL Params**<br>
None
* **Data Params**<br>
`email=[string]`<br>
`name=[string]`<br>
`profilePicture=[string]`<br>
`subscriptionType=[integer]`
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "User added to database with ID 12", id: 12}
* **Error Response:**
    * **Code:** 401 UNAUTHORIZED<br>
            **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** {message: "The requested user already exists",<br>
        data: { err: { name: "error", length: 217, severity: "ERROR", code: "23505", detail: "Key (email)=(rudyhwest@ymail.com) already exists", schema": public", table: "users", constraingt: "users_email_unique", file: "nbtinser.c", line: "434", routine: "_bt_check_unique" } }


* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/user",
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```
#### Data Params Table
| Column             | Description                | Required |
|--------------------|----------------------------|----------|
| email              | Email address of the user  | Yes      |
| name               | Full name of the user      | Yes      |
| profilePicture     | Profile Picture            | No       |
| subscriptionType   | Type of subscription       | No       |
| createdAt          | Date the user was created  | No       |
| updatedAt          | Date the user was updated  | No       |

[TOP](#Table-of-Contents)

### Update User
Updates a single user to the database
* **URL**<br>
/api/user/:id
* **Method:**<br>
`POST`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
`email=[string]`<br>
`name=[string]`<br>
`profilePicture=[string]`<br>
`subscriptionType=[integer]`
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "User 1001 successfully updated."}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
            **Content:** { message: "The requested user does not exist."}<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Error updating user with ID 999."<br>
         data: { err: { name: "error", length: 217, severity: "ERROR", code: "23505", detail: "Key (email)=(rudyhwest@ymail.com) already exists", schema": public", table: "users", constraingt: "users_email_unique", file: "nbtinser.c", line: "434", routine: "_bt_check_unique" } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/user/12",
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```
#### Data Params Table
* Note that you will need at least one setting to update -> email, name, profilePicture, subscriptionType

| Column             | Description                | Required |
|--------------------|----------------------------|----------|
| email              | Email address of the user  | No       |
| name               | Full name of the user      | No       |
| profilePicture     | Profile Picture            | No       |
| subscriptionType   | Type of subscription       | No       |
| createdAt          | Date the user was created  | No       |
| updatedAt          | Date the user was updated  | No       |

[TOP](#Table-of-Contents)

### Remove User
Removes a single user from the database
* **URL**<br>
/api/user/:id
* **Method:**<br>
`DELETE`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "User 1002 successfully deleted."}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { message: "The requested user does not exist."}<br>

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/user/12",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

## Group Endpoints
#### Un-Protected
#### Get Group
Get's a particular group
* **URL**<br>
/api/group/:id
* **Method:**<br>
`GET`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { id: 8, userID: 1000, name: "Lament House", token: "x89dDKl", createdAt: "2019-02-19T15:52:56:.191Z", updatedAt: "2019-02-19T15:55:56:.191Z"}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 200 OK<br>
        **Content:** { [] }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/group/12",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

#### Add Group
Adds new group.
* **URL**<br>
/api/group
* **Method:**<br>
`POST`
* **URL Params**<br>
None
* **Data Params**<br>
`userID=[integer]`<br>
`name=[string]`<br>
`token=[string]`<br>
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "Group 13 successfully added.", group: { id: 13 }, groupMember: { id: 9 } }
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "The requested group does not exist." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Internal Server Error", data: { err: { "Error Details" } } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/group",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

#### Data Params Table
| Column    | Description                | Required |
|-----------|----------------------------|----------|
| userID    | ID of user                 | Yes      |
| name      | Name of group              | Yes      |
| token     | Token for inviting members | No       |
| createdAt | Date the group was created | No       |
| updatedAt | Date the group was updated | No       |

[TOP](#Table-of-Contents)

### Update Group
Update a particular group
* **URL**<br>
/api/group/:id
* **Method:**<br>
`PUT`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
`userID=[integer]`<br>
`name=[string]`<br>
`token=[string]`
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "Group 13 successfully updated.", id: 13 }
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "The requested group does not exist." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Internal Server Error", data: { err: { "Error Details" } } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/group/12",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

#### Data Params Table
* Note that you will need at least one setting to update -> userID, name, token

| Column    | Description                | Required |
|-----------|----------------------------|----------|
| userID    | ID of user                 | No       |
| name      | Name of group              | No       |
| token     | Token for inviting members | No       |
| createdAt | Date the group was created | No       |
| updatedAt | Date the group was updated | No       |

[TOP](#Table-of-Contents)

### Remove Group
Remove a particular group
* **URL**<br>
/api/group/:id
* **Method:**<br>
`DELETE`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "Group 13 successfully removed.", id: 13 }
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "The requested group does not exist." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Internal Server Error", data: { err: { "Error Details" } } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/group/12",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

## GroupMember Endpoints
#### Un-Protected
#### Get All Group Member
Get all members within a particular group
* **URL**<br>
/api/groupMember/
* **Method:**<br>
`GET`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** {data: [{ id: 8, userID: 1000, groupID: 504, moderator: true, weeklyNotification: true, monthlyNotification: true, createdAt: "2019-02-19T15:52:56:.191Z", updatedAt: "2019-02-19T15:55:56:.191Z"}]}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
            **Content:** { message: "The requested group members do not exist." }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember/group/12",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

#### Get Group Member By Group ID
Get all members within a particular group
* **URL**<br>
/api/groupMember/group/:id
* **Method:**<br>
`GET`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** [{ id: 8, userID: 1000, groupID: 504, moderator: true, weeklyNotification: true, monthlyNotification: true, createdAt: "2019-02-19T15:52:56:.191Z", updatedAt: "2019-02-19T15:55:56:.191Z"}]
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
            **Content:** { message: "The requested group members do not exist." }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember/group/12",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

#### Get Group Member By User ID
Get all members within a particular group
* **URL**<br>
/api/groupMember/user/:id
* **Method:**<br>
`GET`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** [{ id: 8, userID: 1000, groupID: 504, moderator: true, weeklyNotification: true, monthlyNotification: true, createdAt: "2019-02-19T15:52:56:.191Z", updatedAt: "2019-02-19T15:55:56:.191Z"}]
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
            **Content:** { message: "The requested group members do not exist." }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember/user/12",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)

#### Get Group Member By User ID && Group ID
Get all members within a particular group
* **URL**<br>
/api/groupMember/getmember/
* **Method:**<br>
`GET`
* **URL Params**<br>
None
* **Data Params**<br>
`userID=[integer]`<br>
`groupID=[integer]`
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { data: [{id: 8, userID: 1000, groupID: 504, moderator: true, weeklyNotification: true, monthlyNotification: true, createdAt: "2019-02-19T15:52:56:.191Z", updatedAt: "2019-02-19T15:55:56:.191Z"}]}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
            **Content:** { message: "The requested group members do not exist." }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember/getmember",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
#### Data Params Table
| Column                 | Description                 | Required |
|------------------------|-----------------------------|----------|
| userID                 | ID of user                  | Yes      |
| groupID                | ID of group                 | Yes      |
| moderator              | Is group moderator          | No       |
| weeklyNotification     | Subscribed to notifs        | No       |
| monthlyNotification    | Subscribed to notifs        | No       |
| total                  | Total gross                 | No       |
| net                    | Net gross                   | No       |
| createdAt              | Date the member was created | No       |
| updatedAt              | Date the member was updated | No       |

[TOP](#Table-of-Contents)

#### Add Group Member
Adds new group.
* **URL**<br>
/api/groupMember/
* **Method:**<br>
`POST`
* **URL Params**<br>
None
* **Data Params**<br>
`userID=[integer]`<br>
`groupID=[integer]`<br>
`moderator=[string]`<br>
`weeklyNotification=[boolean]`<br>
`monthlyNotification=[boolean]`<br>
`total=[integer]` **MAY BE DEPRECIATED LATER ON**<br>
`net=[integer]` **MAY BE DEPRECIATED LATER ON**
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "Group member added.", id: 9 }
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Internal Server Error", data: { err: { "Error Details" } } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

#### Data Params Table
| Column                 | Description                 | Required |
|------------------------|-----------------------------|----------|
| userID                 | ID of user                  | Yes      |
| groupID                | ID of group                 | Yes      |
| moderator              | Is group moderator          | No       |
| weeklyNotification     | Subscribed to notifs        | No       |
| monthlyNotification    | Subscribed to notifs        | No       |
| total                  | Total gross                 | No       |
| net                    | Net gross                   | No       |
| createdAt              | Date the member was created | No       |
| updatedAt              | Date the member was updated | No       |

[TOP](#Table-of-Contents)

### Update Group Member
Update a particular group member
* **URL**<br>
/api/groupMember/update/:id
* **Method:**<br>
`PUT`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
`userID=[integer]`<br>
`groupID=[integer]`<br>
`moderator=[string]`<br>
`weeklyNotification=[boolean]`<br>
`monthlyNotification=[boolean]`<br>
`total=[integer]` **MAY BE DEPRECIATED LATER ON**<br>
`net=[integer]` **MAY BE DEPRECIATED LATER ON**
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "Member successfully updated.", id: 13 }
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "The requested group member does not exist." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Internal Server Error", data: { err: { "Error Details" } } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember/update/12",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

#### Data Params Table
* Note that you will need at least one setting to update -> userID, moderator, etc.

| Column                 | Description                 | Required |
|------------------------|-----------------------------|----------|
| userID                 | ID of user                  | No       |
| groupID                | ID of group                 | No       |
| moderator              | Is group moderator          | No       |
| weeklyNotification     | Subscribed to notifs        | No       |
| monthlyNotification    | Subscribed to notifs        | No       |
| total                  | Total gross                 | No       |
| net                    | Net gross                   | No       |
| createdAt              | Date the member was created | No       |
| updatedAt              | Date the member was updated | No       |

[TOP](#Table-of-Contents)

### Remove Group Member
Remove a particular group member
* **URL**<br>
/api/groupMember/remove/:id
* **Method:**<br>
`DELETE`
* **URL Params**<br>
`id=[integer]`
* **Data Params**<br>
None
* **Success Response:**<br>
    * **Code:** 200<br>
      **Content:** { message: "Member successfully removed.", id: 13 }
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "The requested group member does not exist." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { message: "Internal Server Error", data: { err: { "Error Details" } } }

* **Sample Call:**
  ```javascript
    $.ajax({
      url: "/api/groupMember/remove/12",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```

[TOP](#Table-of-Contents)