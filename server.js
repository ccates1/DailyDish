var aync = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cloudinary = require('cloudinary');
var config = require('./config.js');
var cors = require('cors');
var express = require('express');
var fs = require('fs');
var jwt = require('jwt-simple');
var morgan = require('morgan');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var qs = require('querystring');
var request = require('request');

var userSchema = new mongoose.Schema ({
  username: String,
  facebook: String,
  picture: {type: mongoose.Schema.Types.Mixed},
  email: String,
  password: {
    type: String,
    select: false
  },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  answers: [{
    content: String,
    rating: Number,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: String
  }]
});
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};
var User = mongoose.model('User', userSchema);

var articleSchema = new mongoose.Schema ({
  content: String,
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: Number,
    dislikes: Number
  }],
  sports: [String],
  teams: [String],
  picture: {type: mongoose.Schema.Types.Mixed},
  date: String,
  ratings: [Number]
});
var Article = mongoose.model('Article', articleSchema);

var questionSchema = new mongoose.Schema ({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  answers: [{
    content: String,
    rating: Number,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: Number,
    dislikes: Number,
    date: String
  }],
  sport: String,
  date: String
});
var Question = mongoose.model('Question', questionSchema);

/*
|--------------------------------------------------------------------------
| mongoose/MongoDB
|--------------------------------------------------------------------------
*/
mongoose.Promise = global.Promise;
mongoose.connect(config.url);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB.');
});

/*
|--------------------------------------------------------------------------
| express/middleware
|--------------------------------------------------------------------------
*/
var app = express();
app.set('port', process.env.PORT || 3198);
app.use(cors({
  origin: '*',
  withCredentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin' ]
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'web/www')));

/*
|--------------------------------------------------------------------------
| login middleware
|--------------------------------------------------------------------------
*/
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({
      message: 'Please make sure your request has an Authorization header'
    });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({
      message: err.message
    });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({
      message: 'Token has expired'
    });
  }
  req.user = payload.sub;
  next();
}

/*
|--------------------------------------------------------------------------
| generate JSON web token
|--------------------------------------------------------------------------
*/
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
|--------------------------------------------------------------------------
| MongoDB query object parameters
|--------------------------------------------------------------------------
*/
app.param('article', function(req, res, next, id) {
  var query = Article.findById(id);
  query.exec(function(err, article) {
    if(err) {
      return next(err);
    }
    if(!article) {
      return next(new Error('Error - the article requested could not be found.'));
    }
    req.article = article;
    return next();
  });
});

app.param('question', function(req, res, next, id) {
  var query = Question.findById(id);
  query.exec(function(err, question) {
    if(err) {
      return next(err);
    }
    if(!question) {
      return next(new Error('Error - the question requested could not be found.'));
    }
    req.question = question;
    return next();
  });
});


app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user).populate('articles').exec(function(err, user) {
    if(err) {
      return next(err);
    }
    res.send(user);
  });
});

app.post('/auth/signup', function(req, res) {
  User.findOne({
    $or: [{
      email: req.body.email
    }, {
      username: req.body.username
    }]
  }, function(err, user) {
    if (user) {
      if (user.username === req.body.username) {
        return res.status(409).send({
          message: 'Username is already taken'
        });
      } else {
        return res.status(409).send({
          message: 'Email is already taken'
        });
      }
    }
    var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      picture: 'web/www/img/default.png'
      //picture: 'stylesheets/images/profilepic.jpg'--------------------------<<
    });
    console.log(user);
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({
          message: err.message
        });
      }
      res.send({
        token: createJWT(result)
      });
    });
  });
});

app.get('/articles', function(req, res, next) {
  var q = [{ path: 'author', select: 'username' }, { path: 'comments' }];
  Article.find({}, function(err, articles) {
    Article.populate(articles, q)
      .then(function() {
        res.json(articles);
      })
      .catch(function(err) {
        throw(err);
      });
  });
});

app.get('/articles/:article', function(req, res, next) {
  var q = [{ path: 'author', select: 'username' }, { path: 'comments' }];
  Article.findById(req.article, function(err, article) {
    Article.populate(article, q)
      .then(function() {
        res.json(article);
      })
      .catch(function(err) {
        throw(err);
      });
  });
});


app.get('/questions', function(req, res, next) {
  var q = [{ path: 'author', select: 'username picture' }, { path: 'answers' }];
  Question.find({}, function(err, questions) {
    Question.populate(questions, q)
      .then(function() {
        res.json(questions);
      })
      .catch(function(err) {
        throw(err);
      });
  });
});

app.get('/questions/:question', function(req, res, next) {
  var q = [{ path: 'author', select: 'username picture' }, { path: 'answers.author', select: 'username picture'}];
  Question.findById(req.question, function(err, question) {
    Question.populate(question, q)
      .then(function() {
        res.json(question);
      })
      .catch(function(err) {
        throw(err);
      });
  });
});

app.post('/auth/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({
        message: 'Invalid username and/or password'
      });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({
          message: 'Invalid username and/or password'
        });
      }
      res.send({
        token: createJWT(user)
      });
    });
  });
});

app.post('/articles', function(req, res, next) {
  var article = new Article(req.body);
  User.findById(article.author, function(err, user) {
    if(err) {
      return next(err);
    }
    user.articles.push(article);
    user.save(function(err, user) {
      if(err) {
        return next(err);
      }
    });
  });
  article.save(function(err, article) {
    if(err) {
      return next(err);
    }
    res.send(article);
  });
});

app.put('/questions/:question', function(req, res, next) {
  var answer = req.body;
  User.findById(req.body.author, function(err, user) {
    user.answers.push(answer);
    user.save(function(err) {
      if(err) {
        return next(err);
      }
    });
  });
  req.question.answers.push(answer);
  req.question.save(function(err, question) {
    if(err) {
      return next(err);
    }
    res.send(question);
  });
});

app.post('/questions', function(req, res, next) {
  var question = new Question(req.body);
  User.findById(question.author, function(err, user) {
    if(err) {
      return next(err);
    }
    user.questions.push(question);
    user.save(function(err, user) {
      if(err) {
        return next(err);
      }
    });
  });
  question.save(function(err, question) {
    if(err) {
      return nest(err);
    }
    res.send(question);
  });
});

app.post('/auth/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true
  }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({
        message: accessToken.error.message
      });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({
      url: graphApiUrl,
      qs: accessToken,
      json: true
    }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({
          message: profile.error.message
        });
      }
      if (req.header('Authorization')) {
        User.findOne({
          facebook: profile.id
        }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({
              message: 'There is already a Facebook account that belongs to you.'
            });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({
                message: 'User not found'
              });
            }
            user.facebook = profile.id;
            user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            //user.username = user.username || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({
                token: token
              });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({
          facebook: profile.id
        }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({
              token: token
            });
          } else {
            return res.status(500).send({
              message: "You need to create an account before linking a social profile!"
            });
          }
        });
      }
    });
  });
});

/*
|--------------------------------------------------------------------------
| Login with Twitter
|--------------------------------------------------------------------------
*/
app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({
      url: requestTokenUrl,
      oauth: requestTokenOauth
    }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({
      url: accessTokenUrl,
      oauth: accessTokenOauth
    }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {

        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({
            twitter: profile.id
          }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({
                message: 'There is already a Twitter account that belongs to you.'
              });
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);

            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({
                  message: 'User not found'
                });
              }
              user.twitter = profile.id;
              user.username = user.username || profile.name;
              user.picture = profile.profile_image_url.replace('_normal', '');
              user.save(function(err) {
                res.send({
                  token: createJWT(user)
                });
              });
            });
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({
            twitter: profile.id
          }, function(err, existingUser) {
            if (existingUser) {
              return res.send({
                token: createJWT(existingUser)
              });
            } else {
              return res.status(500).send({
                message: "You need to create an account before linking a social profile!"
              });
            }
          });
        }
      });
    });
  }
});

/*
|--------------------------------------------------------------------------
| Unlink Provider
|--------------------------------------------------------------------------
*/
app.post('/auth/unlink', ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'twitter'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({
      message: 'Unknown OAuth Provider'
    });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({
        message: 'User Not Found'
      });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
