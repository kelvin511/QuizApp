import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Answers {
  answer: string;
  isCorrect: boolean;
}

export interface Quiz {
  id?: number;
  name: string;
  questions: {
    question: string;
    answers: Answers[];
  }[];
}

const PlayQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timer, setTimer] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[][]>([]);
  const [showResults, setShowResults] = useState(false);

  const fetchQuiz = async () => {
    fetch(`http://localhost:3000/${id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !quizCompleted) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleNextQuestion();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quiz, timer, quizCompleted]);

  const handleAnswerChange = (index: number) => {
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    // @ts-ignore
    const hasMultipleCorrect = currentQuestion?.answers.filter(a => a.isCorrect).length > 1;

    if (hasMultipleCorrect) {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    } else {
      setSelectedAnswers([index]);
    }
  };

  const handleSubmitAnswer = () => {
    if (quiz) {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      const correctAnswers = currentQuestion.answers
        .map((answer, index) => (answer.isCorrect ? index : -1))
        .filter((index) => index !== -1);

      const correctSelected = selectedAnswers.filter((answer) =>
        correctAnswers.includes(answer)
      ).length;

      const points = correctSelected * 5;

      setUserAnswers((prev) => [...prev, selectedAnswers]);
      setResults((prev) => prev + points);

      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setTimer(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const getResults = () => {
    if (!quiz) return [];
    return quiz.questions.map((question, index) => {
      const correctAnswers = question.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.answer);

      const userAnswerIndices = userAnswers[index];
      const userAnswersText =userAnswerIndices&& userAnswerIndices.map(
        (i) => question.answers[i]?.answer || 'Not Answered'
      );

      const correctSelected = userAnswerIndices.filter(
        (i) => question.answers[i]?.isCorrect
      ).length;
      const totalCorrect = correctAnswers.length;


      const isFullyCorrect = correctSelected === totalCorrect;
      const isPartiallyCorrect = correctSelected > 0 && correctSelected < totalCorrect;

      return {
        question: question.question,
        correctAnswers,
        userAnswers: userAnswersText.join(', '),
        isFullyCorrect,
        isPartiallyCorrect,
      };
    });
  };

  return (
    <div className="w-full max-w-3xl p-8 space-y-8 rounded-lg shadow-lg bg-white/40 backdrop-blur-xl">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-3xl font-bold text-left">
          {quiz ? quiz.name : 'Loading...'}
        </h2>
        {!quizCompleted && (
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-blue-800 to-blue-700 hover:scale-105"
          >
            Home
          </button>
        )}
      </div>

      {quiz && !quizCompleted ? (
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-between w-full sm:flex-row">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-left sm:text-2xl">
                {currentQuestionIndex + 1}.{' '}
                {quiz.questions[currentQuestionIndex].question}
              </h2>
            </div>
            <div className="flex-shrink-0 mt-4 sm:mt-0">
              <div className="text-lg sm:text-xl">Time Left: {timer}s</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {quiz.questions[currentQuestionIndex].answers.map(
                (answer, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-transform duration-300 ease-in-out ${
                      selectedAnswers.includes(index)
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}
                    onClick={() => handleAnswerChange(index)}
                  >
                    <div className="flex items-center">
                      <input
                        type={
                          quiz.questions[currentQuestionIndex].answers.filter(
                            (a) => a.isCorrect
                          ).length > 1
                            ? 'checkbox'
                            : 'radio'
                        }
                        name="answer"
                        checked={selectedAnswers.includes(index)}
                        readOnly
                        className="mr-2"
                      />
                      <label>{answer.answer}</label>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 text-center lg:grid-cols-2">
            <button
              onClick={handleSubmitAnswer}
              className="w-full px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-green-400 hover:from-green-500 hover:to-green-700 to-green-600"
            >
              Submit Answer
            </button>
            <button
              onClick={handleNextQuestion}
              className="w-full px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-yellow-400 hover:from-yellow-500 hover:to-yellow-700 to-yellow-600"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {!showResults ? (
            <>
              <h2 className="mb-4 text-2xl font-bold">Quiz Completed!</h2>
              <p className="text-lg">
                You got {results} points.
              </p>
              <button
                onClick={() => setShowResults(true)}
                className="px-4 py-2 mt-4 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-blue-800 to-blue-700 hover:scale-105"
              >
                View Results
              </button>
            </>
          ) : (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-left">Results</h3>
              <ul className="mt-2 text-left list-inside">
                {getResults().map((result, index) => (
                  <li
                    key={index}
                    className={`py-2 ${
                      result.isFullyCorrect
                        ? 'text-green-800'
                        : result.isPartiallyCorrect
                        ? 'text-blue-900'
                        : 'text-red-800'
                    }`}
                  >
                    <strong>Question:</strong> {result.question} <br />
                    <strong>Correct Answers:</strong>{' '}
                    {result.correctAnswers.join(', ')} <br />
                    <strong>Your Answers:</strong> {result.userAnswers}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayQuiz;
