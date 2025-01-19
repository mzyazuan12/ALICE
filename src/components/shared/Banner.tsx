
const Banner = () => {
  return (
    <div className="banner-container overflow-hidden relative bg-dark-2 p-4">
      <div className="banner-text-container animate-scroll-left">
        <a href="https://example.com/hackathons" className="text-primary-500 mr-10">
          Hackathons
        </a>
        <a href="https://example.com/ai-news" className="text-primary-500 mr-10">
          AI News
        </a>
        {/* Add more links as needed */}
      </div>
    </div>
  );
};

export default Banner;