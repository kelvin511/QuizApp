import PlayQuiz from './PlayQuiz'
import QuizForm from './QuizForm'
import QuizList from './QuizList'


const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-10 p-4 text-center'>
        <div className='w-full max-w-sm p-6 mx-auto space-y-10 rounded-lg shadow-lg bg-white/40 backdrop-blur-md sm:p-8 lg:p-10 sm:max-w-md lg:max-w-lg'>
          <h1 className='mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl '>
            Welcome to Quiz App
          </h1>
          <p className='mb-6 text-base sm:text-lg lg:text-xl '>
            Add a new quiz or just play the existing one
          </p>
        </div>
        <QuizList/>
      </div>
  )
}

export default Home