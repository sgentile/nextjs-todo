export default function PostsLoading() {
  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loading todos...</h2>
        <span className="text-sm text-gray-600">Please wait...</span>
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded border p-3 bg-gray-100 animate-pulse"
          >
            <div className="w-4 h-4 bg-gray-300 rounded mt-1"></div>
            <div className="h-4 bg-gray-300 rounded flex-1"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-600">Loading pagination...</div>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-8 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
