# Contributing guide

Hello and thank you for expressing interest in contributing to Forgettable!

Be sure to read the [Code of Conduct](https://github.com/se701team3/Forgettable/wiki/Code-of-Conduct) to ensure our community remains a welcoming environment.

This guide takes you through the workflow you should follow when contributing to our project.

## Contribution overview

1. Create an issue/Assign yourself to an issue
   1. Issue must be reviewed by at least one person
2. Fork the repository
3. Clone to local repository
4. Create new feature branch
5. Push changes to Forked repository
6. Create pull request
   1. Must be reviewed by at least two people
7. Success!

## Start contributing

Be sure to read the READMEs to get a better understanding of the project. Look through both the Frontend and Backend READMEs as well.

### Issues

#### Create a new issue

* If you find a problem in our code, or you have an exciting idea for an addition, create a new issue. Be sure to use the provided Issue template. 
* Ensure you link to the appropriate dependencies when required e.g. Blocks Issue #78.
* Add the relevant labels. Find more info on the appropriate labels [here](#label-guide).
* When you have created your issue, tag an appropriate person in the 'Reviewers' section to get it approved.
* The reviewer will respond with a comment, add the 'approved' label to your issue, and assign you to the issue.
* Now you are free to start working on it.

#### Complete an existing issue

If you find an existing issue that interests you, express your interest in the comments. Once you are assigned to the issue, you can start working on it.

### Prepare you workspace

The 'fork and pull' model is used for this project. Once you have an issue assigned, for the main repository. You will then clone this fork to your local repository. It is also recommended to create a new branch in your local repository to start working on your issue.

### Before making a pull request

1. Refer to the [coding style guide](#coding-style-guide) to ensure our project remains consistent.
2. Update local repository to remain up-to-date with the main repository
3. Rebase often
4. If your code requires testing, ensure all tests pass.

### Pull request

1. Create a pull request to be merged to the main repository.
2. Ensure a succinct, yet descriptive title is included.
3. The description should describe some additional details about the changes made.
4. Remember to link the pull request to the issue that it fixes e.g. "Fixes #46"
5. The code must also pass the automated test and build in the CI pipeline
6. Every pull request must be reviewed by at least one other person.
7. Once it is successfully reviewed, it can be merged into the main repository.

# Coding style guide

* Try to follow the style of the existing code. Look through some existing files to see how variables and functions are named.
* This project uses eslint. Ensure your code follows these formatting rules. (If you are using VSCode, install the eslint extension and ensure any other formatting extension is disabled)
* Ensure Component classes start with a capital letter.
* Each new component should have a dedicated folder. This will contain the main ComponentName.js, ComponentName.module.css, and ComponentName.test.js (if required)

# Label guide

Primary custom labels used throughout the project:
* api - For api related issues
* approved - Used to approve issues
* authentication - For authentication related issues
* backend - Backend related issues
* component - Related to React components
* database - Database related issues
* frontend - Frontend related issues
* frontend-page - Web app page related issues
* initial - For initial set of issues
* search - Search related issues
* testing - Test related issues

Additional labels used
* bug
* documentation
* feature
* set up
* UI/UX