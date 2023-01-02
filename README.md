# Team 8: Dentistimo_Backend
This project is associated with course DIT356 and has been done by group 8.

Status: The development of the project has stopped for now and there are no plans to continue it in the future.

## Description
Dentistimo is a distributed system which allows users to book dentist appointments in the Gothenburg region and allows for more clinics to be added in the future. This respository containts the Dentistimo_Backend. Dentistimo_Backend is a component which itself contains serve and interpreter components and the database. Server contains models for serveral entities inlcuding user, booking and clinic. It also contains controllers for each of the models. Controllers include several endpoints. When a request is sent from the frontend via mqtt, it first goes to the security component to check the authentication. Then the request is sent to the backend. The interpreter in backend checks the request topic and url and sends it to a realted async funtion which uses a relevant endpoint in thye contollers.

## Installation Guide
### 1. Install the following requirements:
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/downloads/)

### 2. Setup middleware component
- Get middlware component from [Middleware_Repo](https://git.chalmers.se/courses/dit355/dit356-2022/t-8/t8-project)
- Run middleware according to the guides in [Middleware_Readme](https://git.chalmers.se/courses/dit355/dit356-2022/t-8/t8-project/-/blob/main/README.md)

### 3. Setup security component
- Get security form [Security_Repo](https://git.chalmers.se/courses/dit355/dit356-2022/t-8/user-manager)
- Run security component according to the guides in [Security_Readme](https://git.chalmers.se/courses/dit355/dit356-2022/t-8/user-manager/-/blob/main/README.md)

### 4. Setup backend 
Make sure you are in the backend repository.

- Install the dependencies: `npm install`
- Run the interpreter: `node interpreter.js`
- Run the server: `node app.js`

## Usage
The main usage of backend is to provide functionality for the frontend through several endpoints, which can retrieve data from the database and change it accordingly.

## Support
If you encountred any issue related to the Dentistimo_Backend, it is suggested to first check the other components (security and middleware) and see if they are running properly.
Also you can run the tests by `npm test`
If you could not fix the issue, you can always contact us on [this email.](dentistimo.dit356@gmail.com)

## Contributing
We are for moment not open to contributions.

## Authors and acknowledgment
- [Yasamin Fazelidehkordi](https://git.chalmers.se/yasaminf)
- [Amin Mahmoudifard](https://git.chalmers.se/aminmah)
- [Emrik Dunvald](https://git.chalmers.se/dunvald)
- [Daniel J Coetzer](https://git.chalmers.se/coetzer)
- [Julia Ayvazian](https://git.chalmers.se/ayvazian)
- [Patrik Samcenko](https://git.chalmers.se/samcenko)
- [Vladyslav Shatskyi](https://git.chalmers.se/shatskyi)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

