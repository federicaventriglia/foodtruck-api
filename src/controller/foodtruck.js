import mongoose from 'mongoose'; 
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import { authenticate } from '../middleware/authMiddleware';

export default({ config, db}) => {
    let api = Router();
    
    //in a REST API you have several operations (CRUD)
    
    // 'v1/foodtruck/add' - Create 
    // by adding authenticate we added an account to all the middleware
    api.get('/', authenticate, (req, res) => {
        FoodTruck.find({} , (err, foodtrucks) => {
            if (err) {
                res.send(err);
            }
            res.json(foodtrucks);
        });    
    });
    
    api.post('/add' , (req, res) => {
        let newFoodTruck = new FoodTruck(); //created new instance 
        newFoodTruck.name = req.body.name; // assigned a name to the new object
        newFoodTruck.foodType = req.body.foodType;
        newFoodTruck.avgCost = req.body.avgCost;
        newFoodTruck.geometry.coordinates = req.body.geometry.coordinates; 
        
        newFoodTruck.save( err => {
            if(err) {
                res.send(err);
            }
            res.json({ message: 'Foodtruck saved successfully!'});
        });
    }); // we're adding the '/add' bit to the 'v1/foodtruck/add'

    
    // 'v1/foodtruck/' - Read 
    api.get('/' ,(req, res) => {
        FoodTruck.find({}, (err, foodtrucks) => {
                 if (err) {
                res.send(err);
            }
            res.json(foodtrucks);
        });
    });

    // 'v1/foodtruck/:id' - Read 1 
    api.get('/:id' , (req, res) => {
        FoodTruck.findById(req.params.id, (err, foodtruck) => {
            if (err){
                res.send(err);
            }
            res.json(foodtruck);
        });
    });
    
    // 'v1/foodtruck/:id' - Update
    api.put('/:id' , (req, res) => {
        FoodTruck.findById(req.params.id, (err, foodtruck) => {
            if (err) {
                res.send(err);
            }
            //here we change and then save
            foodtruck.name = req.body.name; 
            foodtruck.foodType = req.body.foodType;
            foodtruck.avgCost = req.body.avgCost; 
            foodtruck.geometry.coordinates = req.body.geometry.coordinates; 
            
            foodtruck.save( err => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "FoodTruck info updated"});
            });
        });
    });
    
    // 'v1/foodtruck/:id' - Delete
    api.delete('/:id' , (req, res) => {
            FoodTruck.remove({
                _id: req.params.id
            }, (err, foodtruck) => {
                if (err){
                    res.send(err);
                }
                res.json({ message: "FoodTruck Deleted"});
            });
    });
    
    // add review for a specific foodtruck
    // 'v1/foodtruck/reviews/add/:id' - Add
    api.post('/reviews/add/:id' , (req, res) => {
        FoodTruck.findById(req.params.id, (err, foodtruck) => {
            if (err) {
                res.send(err);
            }
            let newReview = new Review();
            newReview.title = req.body.title;
            newReview.text = req.body.text; 
            newReview.foodTruck = foodtruck._id;
            newReview.save((err, review) => {
                if (err) {
                    res.send(err);
                }
                // we need to push the review to the array of the many reviews
                foodtruck.reviews.push(newReview);
                foodtruck.save(err => {
                    if(err){
                        res.send(err);
                    }
                    res.json({ message: 'Food truck review saved'});
                });
            });
        });
    });
    
    // get review for a specific food truck id
    // 'v1/foodtruck/reviews/:id'
   api.get('/reviews/:id' , (req, res) => {
    Review.find({foodtruck: req.params.id }, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });
    
    // get foodtrucks by foodtype 
    // 'v1/foodtruck/:foodType
    api.get('/foodtype/:foodType' , (req, res) => {
        FoodTruck.find({foodType: req.params.foodType }, (err, foodtrucks) => {
            if (err) {
                res.send(err);
            }
            res.json(foodtrucks);
        }); 
    });
    
    return api; 
}