// [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');

const Product = require("../models/Product");
const auth = require("../auth");

//[SECTION] Create Product 
module.exports.createProduct = (req,res) => {

		let newProduct = new Product({
            category: req.body.category,
			name : req.body.name,
			description : req.body.description,
			price : req.body.price
		});

		return newProduct.save()
				.then((product) => res.status(201).send({ message: "Registered Successfully" }))
				.catch(err => {
					console.error("Error in saving: ", err)
					return res.status(500).send({ error: "Error in save"})
				})
};

module.exports.getAllProducts = (req, res) => {

    return Product.find({})
    .then(products => {

        if(products.length > 0){
            return res.status(200).send({ products });
        }
        else{
            // 200 is a result of a successful request, even if the response returned no record/content
            return res.status(200).send({ message: 'No product found.' });
        }

    })
    .catch(err => {

        console.error("Error in finding all products", err);

        return res.status(500).send({ error: "Error finding products"});

    });

};

module.exports.getAllActive = (req, res) => {

    Product.find({ isActive: true })
    .then(products => {
       
        if (products.length > 0){
            return res.status(200).send({ products });
        }
        
        else {
            return res.status(200).send({message: "There are no products at the moment."})
        }
    })
    .catch(err => {

        console.error("Error in finding active products: ", err);
        return res.status(500).send({ error: "Error in finding active products"})

    });

};