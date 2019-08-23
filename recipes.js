const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const data = require('./data.js');

mongoose
  .connect('mongodb://localhost/recipeApp')
  .then(() => {
    console.log('Connected to Mongo!');
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const recipeSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    level: {
      type: String,
      enum: ['Easy Peasy', 'Amateur Chef', 'UltraPro Chef']
    },
    ingredients: { type: Array },
    cuisine: { type: String, required: true },
    dishType: {
      type: String,
      enum: ['Breakfast', 'Dish', 'Snack', 'Drink', 'Dessert', 'Other']
    },
    image: {
      type: String,
      default: 'https://images.media-allrecipes.com/images/75131.jpg'
    },
    duration: { type: Number, min: 0 },
    creator: { type: String },
    created: { type: Date, default: Date.now() }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
// module.exports = Recipe; No hace falta exportar

Recipe.create({
  title: 'Macarrones',
  level: 'Amateur Chef',
  ingredients: ['de todo'],
  cuisine: 'Spanien',
  dishType: ['Dish'],
  image: 'https://images.media-allrecipes.com/userphotos/720x405/815964.jpg',
  duration: 30,
  creator: 'Chef XGZ'
})
  .then(recipe => {
    console.log('The recipe is saved and its:', recipe);
    return Recipe.insertMany(data);
  })
  .then(recipes => {
    recipes.forEach(recipe => console.log(`Recipes inserted ${recipe.title}`));
    Recipe.updateOne({ title: 'Rigatoni alla Genovese' }, { duration: 100 });
  })
  .then(() => {
    console.log('Updated ok!!!');
    // Recipe.findByIdAndRemove({ title: 'Carrot Cake' }); -> Logico!!! findbyId y no le paso una id... sin comentarios, en que estaría pensando!!!
    Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(() => {
    console.log('Carrot Cake deleted');
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('An error happened:', err);
  });
