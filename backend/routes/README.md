# Table of Contents
* [Auth Endpoints](#Auth-Endpoints)
    * [Login](#Login)
* [User Endpoints](#User-Endpoints)
    * [Get User](#Get-User)
    * [Add User](#Add-User)
    * [Update User](#Update-User)
    * [Remove User](#Remove-User)
* [Group Endpoints](#Group-Endpoints)
    * [Get Group](#Get-Group)
    * [Add Group](#Add-Group)
    * [Update Group](#Update-Group)
    * [Remove Group](#Remove-Group)

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
### Get User
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
        **Content:** { error: "The user you requested does not exist." }

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
      **Content:** { message: "User added to database with ID 12"}
* **Error Response:**
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { error: "Internal Server Error when adding user." }

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
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { error: "Internal Server Error when updating user." }

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
      **Content:** { message: "User with ID 1001 deleted successfully"}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "No user found with ID 1001." }

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
      **Content:** { message: "Group added to database with ID 8", id: 8}
* **Error Response:**<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "Group doesn't exist" }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { error: "Internal Server Error when adding group." }

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
    * **Code:** 200 OK<br>
      **Content:** { message: "Group 9 successfully updated."}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "Group 9 doesn't exist" }

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
      **Content:** { message: "Group with ID 10 successfully deleted"}
* **Error Response:**<br>
    * **Code:** 401 UNAUTHORIZED<br>
        **Content:** { error: "You are unauthorized to make this request." }<br>
    OR<br>
    * **Code:** 404 NOT FOUND<br>
        **Content:** { error: "No group found with ID 10" }<br>
    OR<br>
    * **Code:** 500 INTERNAL SERVER ERROR<br>
        **Content:** { error: "INTERNAL SERVER ERROR deleting group with ID 9" }

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