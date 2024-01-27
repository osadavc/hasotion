const NotionDisplay = () => {
  return (
    <div className="text-center py-10 min-h-screen flex justify-center items-center flex-col">
      <img src="/logo.png" alt="Hasotion Logo" className="h-40 mb-5" />

      <h1 className="text-3xl text-gray-600">
        Successfully Updated The Article
      </h1>
      <p className="text-xl italic mt-2">&quot;How to do something&quot;</p>
      <p className="text-xs mt-8">
        * If this isn&apos;t the article you want to update, try again after
        ticking the <span className="font-bold">Ready</span> check box in the
        Notion database
      </p>
    </div>
  );
};

export default NotionDisplay;
