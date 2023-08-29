# loan_app
# LoanApp  with User Interface

The LoanApp  is a server-side application built using Node.js and Express.js framework using microservice architecture . It provides a user-friendly web interface for managing loan applications and includes functionalities for user registration, login, and loan submission. The app utilizes PostgreSQL as its database for storing user information, loan applications, and other relevant data and information is exchange from users to admin by microservice architecture.

## Features

- **User Registration and Authentication**: Users can register with the LoanApp platform by providing their details. Passwords are securely hashed using bcrypt. The application supports user authentication, ensuring secure access to features.

- **Login Page**: The microservice includes a login page where registered users can enter their credentials to authenticate and access the platform.

- **User Interface for Loan Applications**: The microservice provides a user-friendly landing page where users can submit loan applications. The interface allows users to input their application details, attach relevant documents, and submit the application for processing.

- **Admin Interface for Loan Management**: The application includes an admin interface accessible after authentication. Admin users can view, approve, or reject loan applications based on predefined criteria.

- **Input Validation**: The microservice uses the validator module to validate user inputs, ensuring accurate and secure data submission.

- **File Uploads**: The application employs the multer middleware to handle file uploads, enabling users to attach supporting documents to their loan applications.

- **Database Integration**: The microservice uses PostgreSQL as its database to store user information, loan applications, and other data related to loan processing.

- **Session Management**: The application utilizes express-session for managing user sessions, ensuring a seamless and secure user experience.

- **AMQP Integration**: The microservice integrates AMQP (Advanced Message Queuing Protocol) using the amqplib module and a custom Producer class. This allows efficient message-based communication between different components of the system.

## Prerequisites

Before running the LoanApp microservice, ensure that you have the following installed:

- Node.js: https://nodejs.org
- NPM (Node Package Manager): This is typically bundled with Node.js.
- PostgreSQL: Set up and configure a PostgreSQL database to store application data. Make sure you have the necessary credentials and connection details available.

## Installation

1. Clone the repository and navigate to the project directory in your terminal.

2. Install the necessary dependencies by running the following command:

```
npm install
```

## Configuration

Before running the microservice, configure the required environment variables such as database credentials and AMQP connection details. These configurations should be specified in a separate `config.js` file, which is not provided in the code snippet.

## Usage

To start the LoanApp microservice, run the following command:

```
node app.js
```

By default, the microservice listens on port 3000. You can modify the port number in the `app.js` file if necessary.

## User Interface

Once the microservice is running, you can access the user interface through your web browser. Here are the main pages:

- **Login Page**: Access the login page at `http://localhost:3000/login` to authenticate with your credentials.

- **Registration Page**: Visit `http://localhost:3000/register` to register as a new user and provide the necessary details.

- **Dashboard Page**: After logging in or registering, you will be redirected to the landing page. This page allows you to submit loan applications, provide relevant information, and upload supporting documents.

Please note that the actual implementation of these pages is not provided in the code snippet and needs to be developed separately based on your specific requirements.

## License

This microservice is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributions

Contributions to the LoanApp microservice are welcome! If you encounter any issues or

 have suggestions for improvements, please feel free to submit a pull request or open an issue on the project's repository.

## Contact

If you have any questions or need further assistance, please contact the project maintainer at nwaokefrancis@gmail.com.

Thank you for using the LoanApp microservice! We hope it simplifies loan application management for your organization, both for users and administrators.
