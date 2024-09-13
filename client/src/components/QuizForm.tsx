import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    multipleCorrect: boolean;  // New field to track if multiple correct answers are allowed
  }[];
}

interface Questions {
  question: string;
  options: string[];
  correctAnswers: number[]; // Use array to store multiple correct answers
  multipleCorrect: boolean; // New field for multiple correct answers
}

interface QuizError {
  name: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

const QuizForm = () => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([
    { question: '', options: ['', '', '', ''], correctAnswers: [], multipleCorrect: false },
  ]);

  const [errors, setErrors] = useState<Partial<QuizError>>({
    name: '',
    questions: [],
  });
  const navigate = useNavigate();

  const handleQuestionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);

    const newErrors = { ...errors };
    if (newErrors.questions && newErrors.questions[index]) {
      newErrors.questions[index].question = '';
    }
    setErrors(newErrors);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);

    const newErrors = { ...errors };
    if (newErrors.questions && newErrors.questions[questionIndex]) {
      newErrors.questions[questionIndex].options[optionIndex] = '';
    }
    setErrors(newErrors);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    optionIndex: number
  ) => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[questionIndex];

    if (currentQuestion.multipleCorrect) {
      // For multiple correct answers, toggle selection
      if (currentQuestion.correctAnswers.includes(optionIndex)) {
        currentQuestion.correctAnswers = currentQuestion.correctAnswers.filter(
          (idx) => idx !== optionIndex
        );
      } else {
        currentQuestion.correctAnswers.push(optionIndex);
      }
    } else {
      // For single correct answer, reset to only one selected
      currentQuestion.correctAnswers = [optionIndex];
    }

    setQuestions(newQuestions);
    setErrors({ ...errors });
  };

  const toggleMultipleCorrect = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].multipleCorrect = !newQuestions[index].multipleCorrect;
    // Reset correct answers when toggling
    newQuestions[index].correctAnswers = [];
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswers: [], multipleCorrect: false },
    ]);
    setErrors({
      ...errors,
      questions: [
        ...(errors.questions || []),
        { question: '', options: ['', '', '', ''], correctAnswer: '' },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);

    const newErrors = errors.questions?.filter((_, i) => i !== index);
    setErrors({ ...errors, questions: newErrors });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Partial<QuizError> = { name: '', questions: [] };

    if (!quizName) {
      newErrors.name = 'Quiz Name is required';
      isValid = false;
    }

    questions.forEach((question, index) => {
      const questionErrors = {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      };

      if (!question.question) {
        questionErrors.question = `Question ${index + 1} is required`;
        isValid = false;
      }

      question.options.forEach((option, optIndex) => {
        if (!option) {
          questionErrors.options[optIndex] = `Option ${optIndex + 1} is required`;
          isValid = false;
        }
      });

      if (question.correctAnswers.length === 0) {
        questionErrors.correctAnswer = 'At least one correct answer is required';
        isValid = false;
      }

      newErrors.questions?.push(questionErrors);
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const finalQuiz = {
        id: 1, // Generate or set this ID dynamically if needed
        name: quizName,
        questions: questions.map((q, index) => ({
          id: index + 1,
          question: q.question,
          answers: q.options.map((option, optIndex) => ({
            answer: option,
            isCorrect: q.correctAnswers.includes(optIndex),
          })),
          multipleCorrect: q.multipleCorrect, // Added this field to identify multiple correct questions
        })),
      };

      await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalQuiz),
      });
      navigate('/');
    } else {
      console.log('Form contains errors');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='w-full max-w-3xl p-8 space-y-8 rounded-lg shadow-lg bg-white/40 backdrop-blur-xl'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='text-3xl font-bold text-left'>Create Your Quiz</h2>
        <button
          onClick={handleBack}
          className='px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out transform rounded-lg bg-gradient-to-r from-blue-500 hover:from-blue-600 hover:to-blue-800 to-blue-700 hover:scale-105'
        >
          Home
        </button>
      </div>

      <input
        type='text'
        value={quizName}
        onChange={(e) => {
          setErrors({ ...errors, name: '' });
          setQuizName(e.target.value);
        }}
        placeholder='Enter Quiz Name'
        className={`w-full mb-2 p-3 border ${
          errors.name ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-purple-500`}
      />
      {errors.name && (
        <p className='mb-4 text-sm text-red-500'>{errors.name}</p>
      )}

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} className='pb-6 border-b border-gray-200'>
            <input
              type='text'
              value={question.question}
              placeholder={`Enter Question ${index + 1}`}
              onChange={(e) => handleQuestionChange(index, e)}
              className={`w-full p-3 mb-2 border ${
                errors.questions && errors.questions[index]?.question
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-purple-500`}
            />
            {errors.questions && errors.questions[index]?.question && (
              <p className='mb-2 text-sm text-red-500'>
                {errors.questions[index]?.question}
              </p>
            )}

            <div className='flex items-center justify-between mb-2'>
              <label htmlFor={`multiple-correct-${index}`} className='text-sm'>
                Allow multiple correct answers?
              </label>
              <input
                type='checkbox'
                id={`multiple-correct-${index}`}
                checked={question.multipleCorrect}
                onChange={() => toggleMultipleCorrect(index)}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className='flex items-center'>
                  <input
                    type='text'
                    value={option}
                    placeholder={`Option ${optIndex + 1}`}
                    onChange={(e) => handleOptionChange(index, optIndex, e)}
                    className={`p-3 mb-2 border ${
                      errors.questions &&
                      errors.questions[index]?.options[optIndex]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 w-full`}
                  />
                  {question.multipleCorrect ? (
                    <input
                      type='checkbox'
                      checked={question.correctAnswers.includes(optIndex)}
                      onChange={() => handleCorrectAnswerChange(index, optIndex)}
                      className='ml-4'
                    />
                  ) : (
                    <input
                      type='radio'
                      name={`correct-answer-${index}`}
                      checked={question.correctAnswers[0] === optIndex}
                      onChange={() => handleCorrectAnswerChange(index, optIndex)}
                      className='ml-4'
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type='button'
              onClick={() => removeQuestion(index)}
              className='px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded-lg'
            >
              Remove Question
            </button>
          </div>
        ))}

<div className='sticky bottom-0 pt-4'>
          <button
            type='button'
            onClick={addQuestion}
            className='w-full py-3 mb-2 font-semibold text-white transition rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'
          >
            + Add Another Question
          </button>
          <input
            type='submit'
            value='Submit Quiz'
            className='w-full py-3 font-semibold text-white transition rounded-lg shadow-lg cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
          />
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
