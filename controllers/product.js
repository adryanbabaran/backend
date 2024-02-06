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

//[SECTION] Get all products
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

//[SECTION] Get all active products
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

// Controller action to search for product name
module.exports.searchProduct = async (req, res) => {
  try {

    console.log(req.body);

    const { productName } = req.body;

    // Use a regular expression to perform a case-insensitive search
    const products = await Product.find({
      name: { $regex: productName, $options: 'i' }
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//[SECTION] Update a Product
module.exports.updateProduct = (req, res)=>{

    const productId = req.params.productId;

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(productId, updatedProduct, {new: true})
    .then(product => {
        console.log(product);
        if (product) {

            return res.status(200).send({ 
                    message: 'Product updated successfully', 
                    updatedProduct: product 
                });
        } else {

             return res.status(404).send({ error: 'Product not found' });
            }
    })

    .catch(err => {

        console.error("Error in updating a product: ", err);

        return res.status(500).send({ error: 'Error in updating a product.' });
    })
};

//[SECTION] Archive a product
module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }
    
    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, {new: true})
    .then(archiveProduct => {
        if (!archiveProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        return res.status(200).send({ 
            message: 'Product archived successfully', 
            archiveProduct: archiveProduct 
        });
    })
    .catch(err => {
        console.error("Error in archiving product: ", err)
        return res.status(500).send({ error: 'Failed to archive product' })
    });

};

//[SECTION] Activate a course
module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, {new: true})
    .then(activateProduct => {
        if (!activateProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        return res.status(200).send({ 
            message: 'Product activated successfully', 
            activateProduct: activateProduct
        });
    })
    .catch(err => {
        console.error("Error in activating a product: ", err)
        return res.status(500).send({ error: 'Failed to activating a product' })
    });
};
