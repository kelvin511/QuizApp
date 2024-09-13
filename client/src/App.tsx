import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import QuizForm from './components/QuizForm'
import PlayQuiz from './components/PlayQuiz'

function App() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-10 p-4 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 sm:p-6 lg:p-8'>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<QuizForm />} />
         <Route path="/quiz/:id" element={<PlayQuiz />} />
      {/*  <Route path="/result/:id" element={<Result />} /> */}
      </Routes>
    </Router>
    </div>

  );
}

export default App;
