# App

App to control check-ins of gym users

## Functional Requirements

- [x] It should be able to register an User;
- [x] It should be able to authenticate an User;
- [x] It should be able to get the user info;
- [x] It should be able to get number of check-in's done by the user;
- [x] It should be able to get the user's check-in's history; 
- [x] It should be able to search nearby GYMs (up to 10km);
- [x] It should be able to search gyms by name;
- [x] It should be able to check-in at a GYM;
- [x] It should be able to validate the check-in at a GYM;
- [x] It should be able to register a new GYM;


## Business Rules

- [x] User should not register with an already registered email
- [x] User should not check-in twice a day
- [x] User only can check-in if they are 100m away from the GYM
- [x] The check-in can only be validated up to 20 minutes after it is created;
- [x] The check-in can only be validated by administrators
- [x] The GYM can only be registered by administrators

## Non Functional Requirements

- [x] The passwords should be encrypted;
- [x] The application data should be saved in a PostgresSQL;
- [x] All list of data should be paginated with 20 items per page;
- [x] The user should be indentified by a JWT