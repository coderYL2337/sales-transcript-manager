Sales Transcript Manager is a powerful tool designed to help sales teams analyze, annotate, and summarize sales call transcripts. It provides an intuitive interface for adding comments to specific parts of a transcript, attaching files to comments, and generating summaries using AI.
##Main Features

View and navigate through sales call transcripts
Add, edit, and delete comments on specific parts of the transcript
Attach files to comments for additional context
AI-powered summary generation of the transcript and its comments
Intuitive user interface with a three-column layout: Transcript, Comments, and Summary

##Technologies Used
##Frontend

React.js
TypeScript
CSS3

##Backend

Node.js with AWS Lambda for handling CRUD operations for comments and file attachments
Integration with an LLM (Language Learning Model) to generate summaries

##Database

Amazon DynamoDB for storing comments and metadata
Amazon S3 for storing attached files
Integration with an LLM for summarizing the transcript

##Installation
To set up the project locally, follow these steps:

Clone the repository:
###'git clone https://github.com/coderYL2337/sales-transcript-manager.git'

Navigate to the project directory:
###'cd sales-transcript-manager'

Install the dependencies:
###'npm install'


##Running the Application
To start the development server, run:
###'npm start'
This will start the application on http://localhost:3000.
Building for Production
To create a production build, run:
### 'npm run build'
This will create a build directory with optimized production-ready files.
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
