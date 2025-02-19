import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { TiLocationArrow } from 'react-icons/ti';

import Button from './Button';
import VideoPreview from './VideoPreview';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  // Hero section states
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  // We removed unused states like `prompt`, `generating`, etc.

  const totalVideos = 4;
  // Specify the video element type to avoid "possibly null" or "any" issues
  const nextVdRef = useRef<HTMLVideoElement>(null);

  // Increment loaded video count
  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  // When enough videos have loaded, remove the loading overlay
  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos, totalVideos]);

  // Handle mini video click
  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // A "fire-and-forget" function for GSAP's onStart (if you need async)
  // Note: This is optional. If you don't need async, just do a normal function.
  function handleOnStart() {
    // "Fire-and-forget" any async logic so onStart itself returns void
    (async () => {
      // If you have some async code, do it here
      // e.g., await new Promise(res => setTimeout(res, 1000));
      // Then play the video
      nextVdRef.current?.play();
    })();
  }

  // GSAP hook #1
  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set('#next-video', { visibility: 'visible' });
        gsap.to('#next-video', {
          transformOrigin: 'center center',
          scale: 1,
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power1.inOut',
          // Instead of doing `async` here, call our function
          onStart: handleOnStart, // <-- no TS error now
        });
        gsap.from('#current-video', {
          transformOrigin: 'center center',
          scale: 0,
          duration: 1.5,
          ease: 'power1.inOut',
        });
      }
    },
    {
      dependencies: [currentIndex, hasClicked],
      revertOnUpdate: true,
    }
  );

  // GSAP hook #2 - example scroll-trigger effect
  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
      borderRadius: '0% 0% 40% 10%',
    });
    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      borderRadius: '0% 0% 0% 0%',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: 'bottom center',
        scrub: true,
      },
    });
  });

  // Make sure 'index' is typed to avoid implicit 'any' error
  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`;

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative h-dvh w-screen overflow-x-hidden">
        {loading && (
          <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
            <div className="three-body">
              <div className="three-body__dot" />
              <div className="three-body__dot" />
              <div className="three-body__dot" />
            </div>
          </div>
        )}

        <div
          id="video-frame"
          className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
        >
          <div>
            {/* Mini Video Preview */}
            <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
              <VideoPreview>
                <div
                  onClick={handleMiniVdClick}
                  className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
                >
                  <video
                    ref={nextVdRef}
                    src={getVideoSrc((currentIndex % totalVideos) + 1)}
                    loop
                    muted
                    id="current-video"
                    className="size-64 origin-center scale-150 object-cover object-center"
                    onLoadedData={handleVideoLoad}
                  />
                </div>
              </VideoPreview>
            </div>

            {/* Next Video */}
            <video
              ref={nextVdRef}
              src={getVideoSrc(currentIndex)}
              loop
              muted
              id="next-video"
              className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
              onLoadedData={handleVideoLoad}
            />

            {/* Main / Background Video */}
            <video
              src={getVideoSrc(
                currentIndex === totalVideos - 1 ? 1 : currentIndex
              )}
              autoPlay
              loop
              muted
              className="absolute left-0 top-0 size-full object-cover object-center"
              onLoadedData={handleVideoLoad}
            />
          </div>

          {/* Some overlay text and button */}
          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className="special-font hero-heading text-blue-100">
                {/* Hero Title */}
              </h1>
              <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                {/* Hero Subtitle */}
              </p>
              <Button
                id="watch-trailer"
                title="Watch trailer"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
