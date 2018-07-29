var express = require('express');
var app = express();		// for robust routing 
var cors=require('cors');
var path=require('path');
var mongojs=require("mongojs");  // connecting to the mongo db
var bodyParser=require('body-parser');	// to get the requested body in a understanded format
var ObjectId=require('mongodb').ObjectId;
var session=require('express-session');	// to create sessions
var db=mongojs('contactlist',['contactlist']);	// connecting to the contactlist database of mongo db

app.use(cors());		// to put a connection between different api s

var fromEmail="";		// current user email
app.use(express.static(__dirname + "/public"));   //html or javascript css files
 app.use(bodyParser.json());
 //app.use(cookieParser());
 app.use(session({secret:"askdjfl;aksjdfj;als",resave:false,saveUninitialized:true})); 	// setting the session 
 app.get('/admin_viewing/:id',function(req,res)		// api for getting the requested email
 {
 	var req_email=req.params.id;
 	console.log(req_email);
 	db.emailFrom.findOne({email:req_email},function(err,user)
 	{
 		if(err)
 		{
 				console.log(err);
 		}
 		else
 		{
 			res.json(user);
 		}
 	});
 });
app.post("/postuser",function(req,res)
	{		fromEmail=req.body.email;
		 //fromEmail=response.data;
	});
app.get('/dashboard',function(req,res){			// api for sending the current user email
	fromEmail=req.session.user;
	 res.send(req.session.user);
})
app.get('/logout',function(req,res){			// where the current user will be logged out by making the req.session.user as null
	req.session.user=null;
	 res.send(req.session.user);
})
app.get('/users',function(req,res){     // for displaying the users
	db.users.find(function(err,docs){
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log(docs);
			res.json(docs);
		}
	});
});
app.get('/userlist',function(req,res){		
	//console.log(req.body);    // body parser should be which type of data it is ..now our server can parse the body of the input
	db.users.find(function(err,docs){
			if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log(docs);
			res.json(docs);
		}
	});

});
app.post('/userlist',function(req,res){		// api for adding the user
	console.log(req.body);    // body parser should be which type of data it is ..now our server can parse the body of the input
	db.users.findOne({email:req.body.email},function(err,docs){
		if(err)
		{

		}
		else if(docs===null)
		{
			db.users.insert(req.body,function(err,docs){   // inserting into users database
			res.json(docs);
			});
		}
		else
		{
			res.send("cant be added");
		}
	});
	

});
app.post('/giveFeedback/:id',function(req,res){		// api for inserting the given feedback 
	var sendEmail=req.params.id;
	console.log(sendEmail);
	db.emailTo.findOne({email:fromEmail},function(err,docs) 	// if the email exists  we are inserting the data into emailTo database
	{	if(err)
		{
			console.log(err);
		}
		else
		{	
			if(docs===null)
			{
					db.emailTo.insert({email:fromEmail,from:[{email:sendEmail,feedback:req.body}]},function(err,docs){
						if(err)
						{
							console.log(err);
						}
					});
			}
			else
			{
					db.emailTo.findAndModify({query:{email:fromEmail},
				update:{$push:{from:{email:sendEmail,feedback:req.body}}},
				new:true},function(err,docs){
						//res.json(docs);
				});
			}
			
			
		}
	});
	db.emailFrom.findOne({email:sendEmail},function(err,docs)  		// inserting the data into emailFrom database
	{	if(err)
		{
			console.log(err);
		}
		else
		{	
			if(docs===null)
			{
					db.emailFrom.insert({email:sendEmail,from:[{email:fromEmail,feedback:req.body}]},function(err,docs){
						if(err)
						{
							console.log(err);
						}
						else
							res.json(docs);
					});
			}
			else
			{
					db.emailFrom.findAndModify({query:{email:sendEmail},
				update:{$push:{from:{email:fromEmail,feedback:req.body}}},
				new:true},function(err,docs){
						res.json(docs);
				});
			}
			
			
		}
	});
});
app.delete('/userlist/:id',function(req,res){    // api for deleting the user
	var id=req.params.id;
	console.log(id);
	db.users.remove({_id: ObjectId(id)},function(err,docs){
		res.json(docs);
	});
});
app.get('/userlist/:id',function(req,res){  //api for getting the particular user
	var id=req.params.id;
	console.log(id);
	db.users.findOne({_id:ObjectId(id)},function(err,docs){
			res.json(docs);
	});
});
app.put('/userlist/:id',function(req,res){     //api for updating the user
	var id=req.params.id;
	console.log(req.body.username);
	db.users.findAndModify({query:{_id:ObjectId(id)},
		update:{$set:{username: req.body.username, email: req.body.email,password: req.body.password}},
		new:true},function(err,docs){
				res.json(docs);
		});
});
app.get('/admin_logout',function(req,res){		// current admin's session will be closed
	req.session.admin=null;
	return res.send(req.session.admin);
});
app.get('/admin_dashboard',function(req,res)   // where the current admin email is present
{	console.log(req.session);
	return res.send(req.session.admin);
});
app.post('/admin_login_check',function(req,res){  // api for checking the admin credentials 
	db.admin.findOne(req.body,function(err,admin)
	{
			if(err)
		{
			console.log(err);
			return res.status(500).send();
		}
		if(!admin)
		{
			//console.log(docs);
			return res.status(404).send();
		}
		req.session.admin=admin.email;
		req.session.iding=admin._id;
		return res.status(200).send();
	});
});

app.post('/login_check',function(req,res){			//api for checking the user credentials
	db.users.findOne(req.body,function(err,user)
	{
			if(err)
		{
			console.log(err);
			return res.status(500).send();
		}
		if(!user)
		{
			//console.log(docs);
			return res.status(404).send();
		}
		req.session.user=user.email;
		req.session.iding=user._id;
		return res.status(200).send();
	});
});

app.listen(3000);
console.log("Server running on port 3000");