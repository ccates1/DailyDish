var aync = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var config = require('./config.js');
var cors = require('cors');
var express = require('express');
var jwt = require('jwt-simple');
var morgan = require('morgan');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');

var userSchema = new mongoose.Schema ({
  username: String,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  sports: [String],
  teams: [String]
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
    }
  }]
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
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

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
    if(!article) {
      return next(new Error('Error - the question requested could not be found.'));
    }
    req.question = question;
    return next();
  });
});

app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
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
      password: req.body.password
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

app.get('/questions', function(req, res, next) {
  Question.find({}, function(err, questions) {
    Question.populate(req.question, {
      path: 'author answers'
    }).then(function() {
      res.json(questions);
    });
  });
});

app.get('/articles', function(req, res, next) {
  Article.find({}, function(err, articles) {
    Article.populate(req.article, {
      path: 'author comments'
    }).then(function() {
      res.json(articles);
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

app.post('/articles', function(req, res) {
  var article = new Article(req.body);
  article.save(function(err, article) {
    if(err) {
      return next(err);
    }
    req.article.save(function(err, article) {
      if(err) {
        return next(err);
      }
    });
  });
});
