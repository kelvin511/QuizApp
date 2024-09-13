const QuizCard = () => {
  return (
    <div className='flex flex-col w-full md:w-4/5 lg:w-3/5 xl:w-2/5 max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-gray-300 p-4 rounded-lg space-y-6'>
      <div className='flex flex-row justify-between space-x-4'>
        <div className='text-xl font-bold text-gray-700'>
          <p>Quiz Question kjasbhdhv</p>
        </div>
        <div className='text-lg font-semibold text-center'>
          <p>Timer</p>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <p className='bg-gray-100 p-2 rounded-md hover:bg-gray-200'>Option 1</p>
        <p className='bg-gray-100 p-2 rounded-md hover:bg-gray-200'>Option 2</p>
        <p className='bg-gray-100 p-2 rounded-md hover:bg-gray-200'>Option 3</p>
        <p className='bg-gray-100 p-2 rounded-md hover:bg-gray-200'>Option 4</p>
      </div>
    </div>
  );
};

export default QuizCard;
