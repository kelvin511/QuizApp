import express from 'express';
import cors from 'cors';
import data from '../quiz.json';
import { writeFileSync } from 'fs'


const app = express();

app.use(cors());
app.use(express.json());

app.get('/:id', (req, res) => {
  const id = req.params.id;

  const quiz = data.find((quiz) => quiz.id === parseInt(id));
  res.send(quiz);
});

app.get('/', (req, res) => {
  res.send(data);
});

app.post('/', (req, res) => {
  const quiz = req.body;
  const newData = [...data, quiz];
  writeFileSync('../quiz.json', JSON.stringify({id: data.length + 1,...newData}));
  res.send(quiz);
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});