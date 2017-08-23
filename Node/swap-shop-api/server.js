var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swap-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(request, response){
    
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct){
        if (err) {
            response.status(500).send({err: "Could not save product"});
        } else {
            response.send(savedProduct); 
        }
    })
});

app.get('/product', function(request, response) {
    
    
    Product.find({}, function(err, products) {
        if (err) {
           response.status(500).send({error: "cound not fetch products"}); 
        } else {
            response.send(products);
        }
    });
    
});

app.post('/wishlist', function(request, response) {
    var wishList = new WishList();
    wishList.title = request.body.title;
    wishList.save(function(err, newWishList) {
       if(err) {
            response.status(500).send({err: "Could not create Wishlist"});
        } else {
            response.send(newWishList); 
        }
    });
});

app.put('/wishlist/product/add', function(request, response) {
    Product.findOne({_id: request.body.productId}, function(err, product) {
        if(err) {
            response.status(500).send({err: "Could not add item in Wishlist"});
        } else {
            WishList.update({_id: request.body.wishListId},{$addToSet:{products:product._id}},function(err, wishList) {
                if(err) {
                    response.status(500).send({err: "Could not add item in Wishlist"});
                } else {
                    response.send("successfully added into the WishList"); 
                }
            });
        }
    })
})


//app.get('/wishlist', function(request, response) {
//    WishList.find({}, function(err, wishlists) {
//        if (err) {
//           response.status(500).send({error: "cound not fetch WishList"}); 
//        } else {
//            response.send(wishlists);
//        }
//    });
//});

app.get('/wishlist', function(request, response) {
    WishList.find({}).populate({path: 'products', model : 'Product'}).exec(function (err, wishLists) {
        if (err) {
           response.status(500).send({error: "cound not fetch WishList"}); 
        } else {
            response.send(wishLists);
        }
    });
});



app.listen(3004, function(){
   console.log("swag shop API is running"); 
});

