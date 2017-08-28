import mongoose from 'mongoose';
import Review from './review';


let Schema = mongoose.Schema; //blueprint to the datamodel that you're gonna use

let FoodTruckSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    foodType: {
        type: String, 
        required: true
    },
    avgCost: Number,
    geometry: { //coordinates
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);