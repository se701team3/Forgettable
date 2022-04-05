# Forgettable - Frontend

## Prerequisites
 * You have already forked the repository and cloned your fork to your local machine. More information on this, and the
   fork and pull model in general, see the [gist post](https://gist.github.com/Chaser324/ce0505fbed06b947d962) on the subject. 
 * You have the following installed
   * [Node.js](https://nodejs.org/en/)

## Getting Started
1. Open the command prompt/terminal and set the working directory as `forgettable-frontend` directory of your cloned 
    repository
2. Create firebase-config.js within forgettable-frontend/src
   * It must export a variable called firebaseConfig which contains information about the firebase configuration.
    This information can be found for a Firebase project by going into `Project Settings`, then within `Your apps` and 
    copying the firebaseConfig variable for the Forgettable web app.
3. Create .env under repo's `forgettable-frontend` folder
    - `REACT_APP_MAPS_API_KEY` should be set to a Google Cloud API key with Places and Maps APIs enabled
4. Run `npm i` to install all the required dependencies
5. npm `npm start` to start the application
6. To exit the application press `Ctrl + C`

## Available Scripts
In this project directory you can run:

### `npm start`
Runs the application in development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`
Builds the app for production to the build folder. 
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. If necessary, classnames and function names can be enabled 
for profiling purposes. 


See the section about deployment for more information.

### `npm test`
Launches the test runner in the interactive watch mode. See the section about 
[running tests](https://create-react-app.dev/docs/running-tests) for more information.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can eject at any time. 
This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) 
into your project as dependencies in package.json. All of the commands except eject will still work, but they will 
point to the copied scripts so you can tweak them. 

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you 
shouldn’t feel obligated to use this feature.




