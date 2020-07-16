const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  if (req.query.msg === 'fail') {
    res.locals.msg = `Sorry, this username and password combination does not exist`;
  } else {
    res.locals.msg = '';
  }
  next();
});

app.get('/', (req, res, next) => {
  res.send('Sanity check');
});

app.get('/login', (req, res, next) => {
  //console.log(req.query);
  res.render('login');
});

app.post('/process_login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (password === 'x') {
    //res/cookie takes 2 args:
    //1. name of the cookie
    //2. value to set it to
    res.cookie('username', username);
    //res.redirect takes 1 arg:
    //1. Where to send a browser
    res.redirect('/welcome');
  } else {
    res.redirect('/login?msg=fail&test=hello');
  }
  //res.json(req.body);
});

app.get('/welcome', (req, res, next) => {
  res.render('welcome', {
    username: req.cookies.username,
  });
});

//app.param() takes 2 args:
//1. pram to look for in the route
// the callback to run (with the usuals)

app.param('id', (req, res, next, id) => {
  console.log('Params called: ', id);
  next();
});

//in a route, anytime something has a : i  front of itis is a wildcard
//wildcard will match everything with that slot
app.get('/story/:id', (req, res, next) => {
  //the req.params object always exists
  //it will have a property for each wildcard in the route
  res.send(`<h1>Story ${req.params.id}</h1>`);
});

app.get('/story/:storyId/:link', (req, res, next) => {
  //the req.params object always exists
  //it will have a property for each wildcard in the route
  console.log(req.query);
  res.send(`<h1>Story ${req.params.storyId} - ${req.params.link}</h1>`);
});

app.get('/statement', (req, res, next) => {
  //This will render the statement IN the browser
  //res.sendFile(
  //  path.join(__dirname, 'userStatements/BankStatementChequing.png')
  //);

  //app has a download method. It takes 2 args:
  //1. filename
  //2. optionally, what you want the filename to wownload as.
  //3. callback which comes with the error
  //download is setting the headers!
  // 1. content-disposition to attachment, with a filename of the 2nd args
  res.download(
    path.join(__dirname, 'userStatements/BankStatementChequing.png', (err) => {
      //if there is an error in sending the file, headers may already be sent
      if (error) {
        if (!res.headersSent) {
          res.redirect('/download/error');
        }
      }
    }),
    'JimsStatement.png'
  );

  // attachment ONLY sets the headers for content-disposition to attachment
  //if you provide a file, it will also set the filename
  // res.attachment(
  //    path.join(__dirname, 'userStatements/BankStatementChequing.png'),
  //    'JimsStatement.png'
  //   );

  //res.set('Content-Disposition', 'attachment');
  //res.sendFile
});

app.get('/logout', (req, res, next) => {
  //res.clearCookie takes 1 arg:
  // 1. Cookie to clear (by name)
  res.clearCookie('username');
  res.redirect('/login');
});

app.listen(3000);
console.log('Server is listening on port 3000');
