const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const Router = express.Router();

const PORT = 4000;
const URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/mern-app';
const Todo = require('./models/todo');

//BEGIN CONNECT MONGODB
mongoose.connect(URI, { useCreateIndex: true, useNewUrlParser: true });
// .then((db) => console.log('DB is Connected'))
// .catch((err) => console.error(err));
//EMD CONNECT MONGODB

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('Connected Successfully');
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//ROUTES
//GET ALL TODOS
Router.route('/').get((req, res) => {
	Todo.find((err, todos) => {
		if (err) {
			console.log(err);
		} else {
			res.json(todos);
		}
	});
});

//GET ONE TODO
Router.route('/:id').get((req, res) => {
	let id = req.params.id;
	Todo.findById(id, (err, todo) => {
		res.json(todo);
	});
});

//ADD ONE TODO
Router.route('/add').post((req, res) => {
	let todo = new Todo(req.body);
	todo
		.save()
		.then((todo) => {
			res.status(200).json({ todo: 'todo added successfully' });
		})
		.then((err) => {
			res.status(400).send('Adding new todo failed');
		});
});

//UPDATE ONE TODO
Router.route('/update/:id').post((req, res) => {
	Todo.findById(req.params.id, (err, todo) => {
		if (!todo) {
			res.status(404).send('data is not found');
		} else {
			todo.todo_description = req.body.todo_description;
			todo.todo_responsible = req.body.todo_responsible;
			todo.todo_priority = req.body.todo_priority;
			todo.todo_completed = req.body.todo_completed;

			todo
				.save()
				.then((todo) => {
					res.json('Todo updated');
				})
				.catch((err) => {
					res.status(400).send('Updated Not Posible');
				});
		}
	});
});

app.use('/todos', Router);

app.listen(PORT, () => console.log(`Server Run on port: ${PORT}`));
