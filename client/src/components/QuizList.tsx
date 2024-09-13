import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from './QuizForm';

const QuizList = () => {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null); // State to store selected quiz
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle quiz card selection
  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  // Handle "Play Quiz" button click
  const handlePlayQuiz = () => {
    if (selectedQuiz) {
      navigate(`/quiz/${selectedQuiz.id}`); // Navigate to the quiz page
    } else {
      alert('Please select a quiz first!');
    }
  };

  const handleAddQuiz = () => {
    navigate('/create');
  };

  // Handle clicks outside of quiz cards to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedQuiz(null); // Deselect if clicked outside the quiz cards
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Add click event listener

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up event listener
    };
  }, []);

  const getAllQuiz= async() => {
   fetch('http://localhost:3000/').then((res)=>res.json()).then((data)=>setQuizList(data))
  }
  useEffect(() => {
    getAllQuiz();
  }, []);

  return (
    <div
      ref={containerRef}
      className='w-full max-w-4xl p-4 mx-auto space-y-8 rounded-lg shadow-lg sm:p-6 lg:p-8 bg-white/40 backdrop-blur-xl'
    >
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-2xl font-bold text-center sm:text-3xl lg:text-4xl'>
          Available Quizzes
        </h1>
        <button
          onClick={handleAddQuiz}
          className='px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-blue-800 to-blue-700 hover:scale-105'
        >
          Add Quiz
        </button>
      </div>

      <h2 className='text-lg font-medium text-left'>
        Select a quiz and hit Play Quiz
      </h2>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {quizList.map((quiz: Quiz) => (
          <button
            key={quiz?.id}
            onClick={() => handleQuizSelect(quiz)}
            className={`max-w-lg w-full flex flex-col items-center justify-center p-4 rounded-lg shadow-md cursor-pointer transition-all transform bg-white/40  ${
              selectedQuiz?.id === quiz?.id ? 'bg-blue-200 shadow-lg scale-105' : ''
            } hover:scale-105`}
          >
            <p className='text-lg font-semibold'>{quiz?.name}</p>
            <p className='text-gray-600 text-md'>
              No of questions: {quiz?.questions?.length}
            </p>
          </button>
        ))}
      </div>

      <div className='flex justify-center mt-6'>
        <button
          onClick={handlePlayQuiz}
          className='px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-blue-800 to-blue-700 hover:scale-105'
        >
          Play Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizList;
