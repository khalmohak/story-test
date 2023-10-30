import React, {useEffect, useState} from 'react';
import {VideoPool} from "./media-pool";
import {CLASS_MEDIA_POOL_ELEMENT} from "./media-pool/constants";

const videos = [
    "https://cdn.homeworkapp.ai/sets-gamify-assets/dev/home-explore/document/1697268325377",
    "https://cdn.homeworkapp.ai/sets-gamify-assets/dev/home-explore/document/1697268376947",
    "https://cdn.homeworkapp.ai/sets-gamify-assets/dev/home-explore/document/1697268401321",
    "https://cdn.homeworkapp.ai/sets-gamify-assets/dev/home-explore/document/1697268418300",
    "https://cdn.homeworkapp.ai/sets-gamify-assets/dev/home-explore/document/1697268439239"
]

const videoPool = new VideoPool()

function App() {
    const [currentStory, setCurrentStory] = useState<number>(0);
    // const [isPlayed, setIsPlayed] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {

        videos.map((video, index)=>{
            let div = document.getElementById("abc");
            // @ts-ignore
             videoPool.initializeNode(div, [
                {
                    url: video,
                    mime: "video/mp4",
                },
            ]);
        })

    }, []);

    useEffect(() => {
        console.log("Current Story Changing the useEffect", currentStory)
        // setIsPlayed(false);

        let media: any;
        console.log("Unavailable ", videoPool.unavailable)
        media = videoPool.unavailable[0];
        console.log("Media", media)
        videoPool.setCurrent(media);

        videoPool.unmute()
        videoPool.play(media);

        if (media) {
            media.addEventListener("ended", () => {
                console.log(`Video ${currentStory} ended`)
                // setIsPlayed(true)
                setIsPlaying(false)
                videoPool.release(media);
                setCurrentStory(currentStory+1)

            });

            media.addEventListener("waiting", () => {
                console.log(`Video ${currentStory} waiting`)
                setIsLoading(true);
            });

            media.addEventListener("play", () => {
                setIsLoading(false);
                console.log(`Video ${currentStory} play`)
            });

            media.addEventListener("playing", () => {
                setIsLoading(false);
                setIsPlaying(true)
                console.log(`Video ${currentStory} playing`)

            });
        }

        return () => {
            setIsLoading(false);
            videoPool.release(media);
            // @ts-ignore
            videoPool.setCurrent();
        };
    }, [currentStory]);

    useEffect(() => {
        // if (!isPlayed) {
            let mediaList = document.getElementsByClassName(
                CLASS_MEDIA_POOL_ELEMENT,
            );
            console.log("Media List", mediaList)
            if (mediaList && mediaList[0]) {
                let media = mediaList[0];
                try {
                    if (isPlaying) {
                        //@ts-ignore
                        media?.play();
                    } else {
                        //@ts-ignore
                        media?.pause();
                    }
                } catch (err) {
                    console.log("error here", err)
                }
            }
        // }
    }, [isPlaying]);

    return (
        <div>
            <div>
                Current Story {currentStory}
                <br/>
                Playing {isPlaying ? "yes":"no"}
            </div>
            <div id="abc"/>

            {isLoading && <h2>
                Loading Wait
            </h2>}
            <button
                onClick={()=>{
                    if (currentStory>0){
                        setCurrentStory(currentStory-1)
                    }
                }}
            >
                Prev Story
            </button>
            <button
                onClick={()=>{
                    setIsPlaying(!isPlaying)
                }}
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
            <button
                onClick={()=>{
                    if (currentStory<videos.length-1){
                        setCurrentStory(currentStory+1)
                    }
                }}
            >
                Next Story
            </button>
        </div>
    );
}

export default App;
