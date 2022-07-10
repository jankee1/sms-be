## SMS-BE
This repository contains back end files for SMS application.
Front end repository can be found under the following link https://github.com/jankee1/sms-fe

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Live demo](#Demo)

### General info
This project is a simple application which allows for sending message and share it with anyone. * Messages are encrypted and stored in database. 
* Read message is automatically removed (all messages can be read only once).
* A user can select that the message will be removed after 24h regardless wheter it would be read or not.
* Sender and message fields are validated (only letters and digits are allowed)
	
### Technologies
Project is created with:
* Node.js v 16.5.0 
* Express.js v 4.18.1
* TypeScript v 4.7.4
* Crypto module
* MySQL
* CORS
* UUID	
* Express rate limiter


### Demo
The application is available under the below link:
https://sms.networkmanager.pl/
