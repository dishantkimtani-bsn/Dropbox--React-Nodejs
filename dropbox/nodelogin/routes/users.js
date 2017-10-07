var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var crypto = require('crypto');
var fs = require('fs');




/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
    return passwordData;
}

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.post('/', function (req, res) {

    var reqEmail = req.body.email;

    var reqPassword = saltHashPassword(req.body.password);

    // check user already exists
    var getUser="select * from users where email='"+reqEmail+"' and password='" + reqPassword +"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                req.session.email = reqEmail;
                console.log("valid Login");
                res.status(201).json({message: "Login successful"});
            }
            else {

                console.log("Invalid Login");
                res.status(401).json({message: "Login failed"});
            }
        }
    },getUser);

});


router.post('/signup', function (req, res) {


    var reqPassword = saltHashPassword(req.body.password);
    var reqfirstname = req.body.firstName;
    var reqlastname = req.body.lastName;
    var reqemail = req.body.email;
    var reqcontact = req.body.contactNo;


    var insertUser="insert into users (firstname, lastname, password, email, phno) values ( '"+reqfirstname
        +"' ,'" + reqlastname +"','" +
        reqPassword+ "','" + reqemail+ "','" + reqcontact+"')";

    console.log("Query is:"+insertUser);

    mysql.insertData(function(err){
        if(err){
            res.status(401).json({message: "SignUp failed"});
        }
        else
        {
            var fs = require('fs');
            var dir = './public/uploads/'+reqemail;

            if (!fs.existsSync(dir)){

                fs.mkdirSync(dir);
            }
            res.status(201).json({message: "User Details Saved successfully"});

        }
    },insertUser);


});


//Logout the user - invalidate the session
router.post('/logout', function (req, res) {

    req.session.destroy();
    console.log('Session destroyed');

});

module.exports = router;