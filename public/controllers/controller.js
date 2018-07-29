var myApp = angular.module('myApp', ["ngRoute"]);

myApp.config(function($routeProvider,$locationProvider) {       // setting the config for the myApp
    $locationProvider.hashPrefix('');
    //$locationProvider.html5Mode(true);
    $routeProvider
    .when("/main", {
        templateUrl : "../html_pages/main.html",
        controller:"main_controller"
    })
    .when("/emp_login",{        // employee login page
        templateUrl : "../html_pages/employee/emp_login.html",
        controller:"emp_login_controller"
    })
    .when("/list_emp",{                 // lists all the employees or users
        templateUrl : "../html_pages/employee/list_emp.html",
        controller:"list_emp_controller"
    })
    .when("/feedback/:email",{              // feedback giving page
        templateUrl : "../html_pages/employee/feedback.html",
        controller:"emp_feedback_controller"
    })
    .when("/view_feedback/:id",{        // where admin can see the feedback given to particular id or email
        templateUrl : "../html_pages/admin/admin_view_feedback.html",
        controller:"admin_view_feedback_ctrl"
    })
    .when("/logout",{                   //  current user will be logged out
        templateUrl : "../html_pages/employee/logout.html",
        controller:"logout_ctrl"
    })
    .when("/admin_logout",{             // current admin will be logged out
        templateUrl : "../html_pages/admin/admin_logout.html",
        controller:"admin_logout_ctrl"
    })
    .when("/admin_login",{              // admin login page
        templateUrl : "../html_pages/admin/admin_login.html",
        controller:"admin_login_controller"
    })
    .when("/admin_view",{               // admin view page where he can edit,delete and update the users
        templateUrl : "../html_pages/admin/admin_view.html",
        controller:"admin_view_controller"
    })

        .otherwise({
            redirectTo: '/emp_login'        // employee login page
        });
        //$locationProvider.html5Mode(true);
})
.controller("admin_view_feedback_ctrl", function ($scope,$http,$window,$routeParams,$location) { // controller for admin_view_feedback page
    $scope.id=$routeParams.id;
    console.log($scope.id);
    $scope.null_Check=false;
    $http.get('/admin_viewing/'+ $scope.id).then(function(response){  //getting the feedback list given by all the users from the emailFrom db
        console.log(response.data);
        $scope.feedback_list=response.data.from;

        if($scope.feedback_list===null)
            $scope.null_check=true;
    });
    
})
.controller("admin_view_controller", function ($scope,$http,$window,$location) {  // controller for admin_view page
    $scope.user={};
     $http.get('/admin_dashboard').then(function(response)     // here the current admin is present in this link
        {   console.log(response);
            if(response.data==null || response.data==="")
                $location.path("/admin_login");
        });
    $http.get('/userlist').then(function(response)          // getting all the userslist from the users db
    {
        console.log("I got the data I requested");
        $scope.userlist=response.data;
    });
    $scope.addUser=function(){                              // adding the user
        $http.get('/admin_dashboard').then(function(response)
        {
            if(response.data===null || response.data==="")      //checking if the admin is logged in or not
                $location.path("/emp_login");
            else
            {
                var name=$scope.user.username; var password=$scope.user.password; var email=$scope.user.email;
                if(name==null || name==="" || password==null || password==="" || email==null || email==="")
                {
                    alert("please enter all the fields to add the user");
                }
                else
                {
                    $http.post('/userlist',$scope.user).then(function(response){
                    console.log("I posted the data");
                    refresh();
                    });
                }
                
            }
        });
        
    };
    $scope.removeUser=function(id){                 // we are removing the user if the admin is logged in else to employee login page
        $http.get('/admin_dashboard').then(function(response)
        {
            if(response.data===null || response.data==="")
                $location.path("/emp_login");
            else
            {
                    console.log(id);
                    $http.delete('/userlist/' + id)
                    .then(function(response){
                        console.log(response);
                        refresh();
                    });
            }
        });
        
    };
    $scope.edit=function(id){                   // editing the details of the user
        $http.get('/admin_dashboard').then(function(response)
        {
            if(response.data===null || response.data==="")
                $location.path("/emp_login");
            else
            {
                    console.log(id);
                    $http.get('/userlist/' + id ).then(function(response){
                        console.log(response);
                        $scope.user=response.data;
                    });
            }
        });
        
    };
    $scope.update=function(){               // updating the details of the user
        $http.get('/admin_dashboard').then(function(response)
        {
            if(response.data===null || response.data==="")
                $location.path("/emp_login");
            else
            {       var name=$scope.user.username; var password=$scope.user.password; var email=$scope.user.email;
                    if(name==null || name==="" || password==null || password==="" || email==null || email==="")
                    {
                        alert("please enter all the fields to update");
                    }
                    else{
                        $http.put('/userlist/'+ $scope.user._id , $scope.user).then(function(response){
                        console.log(response);
                        refresh();
                        });
                    }
                    
            }
        });
        
    };
    var refresh=function(){                 // refreshing all the userslist
        $http.get('/admin_dashboard').then(function(response)
        {
            if(response.data===null || response.data==="")
                $location.path("/emp_login");
            else
            {
                $http.get('/userlist').then(function(response){
                    console.log("I got the data I requested");
                     $scope.userlist=response.data;
                    // $scope.email=response.email;
                    // $scope.number=response.number; 
                    console.log(response);
                    $scope.user={};
                });
            }
        });
        
    };
    refresh();
    $scope.deSelect=function(){
        $scope.user={};
        refresh();
    }

})
.controller("main_controller", function ($scope,$http,$window,$location) {
})
.controller("emp_login_controller", function ($scope,$http,$window,$location) { // controller for emp_login page
    $scope.submit=function(){               
        var em=$scope.email;
        var pass=$scope.password;
        if(em==null || em==="" || pass==null || pass==="")
        {
                alert("please enter all the fields");
        }
        else
        {
            $http.post('/login_check',{email:em,password:pass}).then(function(response){ // checking employee login credentials
                $scope.email="";
                $scope.password="";
                if(response.status===200)
                {
                    $location.path("/list_emp");
                }
                else
                {

                }
            });
        }
        
    }
        
})
.controller("admin_login_controller", function ($scope,$http,$window,$location) {   // controller for admin_login page
    $scope.submit=function(){
        var em=$scope.email;
        var pass=$scope.password;
        if(em==null || em==="" || pass==null || pass==="")
        {
                alert("please enter all the fields");
        }
        else
        {
            $http.post('/admin_login_check',{email:em,password:pass}).then(function(response){ //checking admin login credentials
                $scope.email="";
                $scope.password="";
                if(response.status===200)
                {
                    $location.path("/admin_view");
                }
                else
                {

                }
            });
        }
        
    }
        
})
.controller("logout_ctrl", function ($scope,$http,$window,$location) {  // controller for user logout page
    $http.get('/logout').then(function(response){   //logging out the current user
        
    });
        
})
.controller("admin_logout_ctrl", function ($scope,$http,$window,$location) {    // controller for admin_logout page
    $http.get('/admin_logout').then(function(response){     // logging out the current admin
        
    });
        
})
.controller("list_emp_controller", function ($scope,$http,$window,$location) {  // controller for list_emp page
    $http.get('/dashboard').then(function(response){        
            $scope.currentuser=response.data;       // getting the current user email 
    });
    $http.get('/users').then(function(response){            // getting the list of all the employees or users
            console.log("I got the data I requested from list_emp");
            console.log(response.data);
             $scope.users=response.data;
        });


})
.controller("emp_feedback_controller", function ($scope,$http,$window,$routeParams,$location) { // controller for emp_feedback page
        $scope.contact={};
        $scope.sendEmail=$routeParams.email;
        $scope.fromEmail="";
        $http.get('/dashboard').then(function(response)  // if the current user is logged out we are directing to emp_login page
        {   console.log(response);
            if(response.data==null || response.data==="")
                $location.path("/emp_login");
        });
        //$scope.contact.send=sendEmail;
        //$scope.contact.from=fromEmail;
        $scope.submit=function(){                        // submitting the feedback given by the user
                $http.get('/dashboard').then(function(response)
                {
                    if(response.data===null || response.data==="")  // if the current user is logged out we are directing to emp_login page
                        $location.path("/emp_login");
                    else
                    {
                        $http.post('/giveFeedback/'+$scope.sendEmail,$scope.contact).then(function(response){  // we are posting the submitted feedback details to the mongo db
                            console.log(response);
                            alert("you have successfully given the feed back");
                        });
                    }
                });
                
        }
});
