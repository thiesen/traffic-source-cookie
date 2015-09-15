[![Build Status](https://travis-ci.org/thiesen/traffic-source-cookie.svg)](https://travis-ci.org/thiesen/traffic-source-cookie)

## Install

In order to prepare your machine to work on Lead Tracking you must run:

`npm install`

Now all the dependencies to Grunt plugins have been installed and you can start to play with them.

## Grunt JS

Grunt is a JavaScript task runner which here is used to:

Lint,
Minify,
Test,
Deploy.
If you want to create a new automated task you may check where the whole magic happens: /gruntfile.js. See Grunt documentation and it's plugins for developing.

## Travis CI

Everytime you push anything to Github, Travis CI will run the tasks defined in /.travis.yml.

## Amazon Cloudfront deploy

Gruntfile has a task deploy for deploying app/traffic-source-cookie.js file into Amazon Cloudfront. In case you need to upload any other file to Amazon, you should add it to the grunt deploy task.

When deploying, you have to set the environment you intend to deploy. Follow this:

```
grunt deploy:beta
```

```
grunt deploy:stable
```

You may have noticed that the script wasn’t deployed after it has passed the tests. We made this choice due to security reasons: The grunt deploy task needs the Amazon credentials. Since the repository is public, it's not safe to reveal company credentials in it. To avoid test errors, you will find at project files a .json with generic credentials for amazon: /.aws_config.json.example.

To make deploy task works, remove .example and fill with your Amazon S3 credentials.
