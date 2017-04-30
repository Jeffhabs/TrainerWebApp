# Personal Trainer Web Application
###### Demo username: test8@gmail.com password: qqqqqq
#### Resources
  * Clients
  * Workouts
  * Trainers

#### Clients Attributes
  * id
  * firstname
  * lastname
  * email
  * age
  * weight
  * bodyfat
  * address
  * city
  * state
  * postalCode
  * summary
  * phonenumber
  * avatar

#### Workouts Attributes
  * id
  * owner (clientID)
  * title
  * sets
  * reps
  * rest

#### Trainer Attributes
  * id
  * firstname
  * lastname
  * email
  * password

#### REST Endpoints
HTTP METHOD | Endpoint | Usage | Returns
----------- | -------- | ----- | -------
GET | /clients | List all Clients | clients
GET | /clients/{id} | Retrieve a client | client
POST | /clients | Create a client | -
PUT | /clients/{id} | Update a client | -
DELETE | /clients/{id} | Delete a client | -
POST | /clients/{id}/workouts | Create workout for client | -
GET | /workouts/{clientId} | List all clients workouts | workouts by client id
DELETE | /workouts/{id} | Delete workout | -

#### Sample Client JSON
    [
      ....
      {
        "id": "58b88d556b475b2128874f4e"
        "firstname": "Bill",
        "lastname": "Murray",
        "email": "bill.murray@gmail.com",
        "age": 66,
        "weight": "150",
        "bodyfat": "15%",
        "address": "1234 Fake Street",
        "city": "Los Angles",
        "state": "California",
        "postalCode": "90210",
        "summary": "I love groundhogs day",
        "phonenumber": "801-555-5555",
        "avatar": "url-avatar-1.png"
      }
      ....
    ]

#### Sample Workout JSON
    [
      ....
      {
        "id": "58b88d556b475baskdjflj1",
        "owner": "58b88d556b475b2128874f4e",
        "title": "Bicep Curls",
        "sets": "3",
        "reps": "8/10/12",
        "rest": "60s"
      },
      ....
    ]
