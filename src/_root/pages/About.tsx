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
  
  // Video generation states
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState('');
  const [progress, setProgress] = useState(0);

  const totalVideos = 4;
  const nextVdRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

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
          onStart: () => nextVdRef.current.play(),
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
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

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

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  const generateVideo = async () => {
    const apiKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY;
    
    if (!apiKey) {
      setError('API key is not configured. Please set NEXT_PUBLIC_REPLICATE_API_KEY in your environment.');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      setProgress(0);
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "4735ea0656ad16d05c71d79c638b6e40d1f3f61fd47e46058c155b52da853ebf",
          input: {
            prompt: prompt,
            num_frames: 14,
            fps: 7
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const { id: resultId } = await response.json();
      let result;
      let pollCount = 0;
      const maxPolls = 30;

      while (!result?.output && pollCount < maxPolls) {
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${resultId}`, {
          headers: {
            'Authorization': `Token ${apiKey}`,
          }
        });
        
        if (!pollResponse.ok) {
          throw new Error(`Polling failed with status: ${pollResponse.status}`);
        }
        
        result = await pollResponse.json();
        pollCount++;
        
        if (result.status === 'succeeded') {
          setGeneratedVideo(result.output);
          setProgress(100);
          break;
        } else if (result.status === 'failed') {
          throw new Error(result.error || 'Video generation failed');
        } else if (result.status === 'processing') {
          setProgress(Math.min((pollCount / maxPolls) * 100, 90));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (pollCount >= maxPolls) {
        throw new Error('Generation timed out. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate video. Please try again.');
      console.error('Video generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative h-dvh w-screen overflow-x-hidden">
        {loading && (
          <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}

        <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
          <div>
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

            <video
              ref={nextVdRef}
              src={getVideoSrc(currentIndex)}
              loop
              muted
              id="next-video"
              className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
              onLoadedData={handleVideoLoad}
            />
            <video
              src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
              autoPlay
              loop
              muted
              className="absolute left-0 top-0 size-full object-cover object-center"
              onLoadedData={handleVideoLoad}
            />
          </div>

          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className="special-font hero-heading text-blue-100">
                
              </h1>
              <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              
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