
var express = require("express");
var bodyP = require('body-parser');
var mysql   = require("mysql");
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyP.json());
app.use(bodyP.urlencoded({ 
   extended: true
}));


var connection = mysql.createConnection({
  //properties
  host : 'sql8.freemysqlhosting.net',
  user : 'sql8166712',
  password : 'hBjrTLpWxn',
  database : 'sql8166712',
  port: '3306'
});

connection.connect(function(error){
  if(!!error){
    console.log('Error');
  }else{
    console.log('Connected');
  }

});

app.get('/',function(req,res){
  res.send("hi");
});

//code
//get all users
app.get('/users', function(req,res){
  connection.query("Select * from users", function(error,rows,field){
    if(!!error){
      console.log('Error in the query');
    }else{
      console.log('Successful query');
      res.json(rows);
    }
  });
});

//get all event
app.get('/event', function(req,res){
  connection.query("select event.id, event.description, count(preference.datepref) as nbrvote from event, preference where event.id = preference.idevent group by event.id", function(error,rows,field){
    if(!!error){
      console.log('Error in the query');
    }else{
      console.log('Successful query');
      res.json(rows);
    }
  });
});

//get number of vote of an event
app.get('/event/numberVote', function(req,res){
  connection.query("Select nbrvote from event where id=1", function(error,rows,field){
    if(!!error){
      console.log('Error in the query');
    }else{
      console.log('Successful query');
      //res.json(rows);
    }
  });
});

//get number of vote of an event
app.get('/event/maxVote', function(req,res){
  connection.query("Select max(nbrvote) from event", function(error,rows,field){
    if(!!error){
      console.log('Error in the query');
    }else{
      console.log('Successful query');
      res.json(rows);
    }
  });
});

//get event order by max vote date
app.get('/event/OrderByDateVote', function(req,res){
  connection.query("SELECT count(datepref) as nb, datepref FROM preference WHERE idevent = ? group by datepref order by nb DESC",[req.query.idevent]
, function(error,rows,field){
    if(!!error){
      console.log('Error in the query');
    }else{
      console.log('Successful query');
      res.json(rows);
    }
  });
});

//create a user
app.post('/register',function(req,res){
      connection.query("INSERT INTO users VALUES (?,?,?,?,?,?)",[req.body.login,req.body.password,req.body.color,req.body.firstName,req.body.lastName,"user"],function(err,result) {
            res.send(result);
      });
});

//login ws
app.post('/login',function(req,res){
      connection.query("SELECT * from users where login=? and password=? ",[req.body.login,req.body.password],function(err,result) {
          res.json(result);
      });
});

//get preference by event
app.get('/event/preference', function(req,res){
  connection.query("select users.couleur, preference.datepref, users.login from users,preference where preference.idevent=? and users.login=preference.iduser",[req.query.idevent]
, function(error,rows,field){
    if(!!error){
      console.log('Error in the query');
    }else{
      console.log('Successful query !');
      res.json(rows);
    }
  });
});

//add preference
app.post('/addpreference',function(req,res){
      connection.query("INSERT INTO preference VALUES (?,?,?)",[req.body.iduser,req.body.idevent,req.body.datepref],function(err,result) {
            res.send(result);
      });
});

app.listen(process.env.PORT || 1337);
