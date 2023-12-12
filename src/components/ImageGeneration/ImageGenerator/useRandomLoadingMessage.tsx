import { useEffect, useState } from "react";

const quotes = [
  "Gathering stardust to sprinkle on your image creation...",
  "AI Painter is mixing an imaginative palette!",
  "Your pixels are playing hide and seek; seeking them out!",
  "We're teaching the robots about your kind of beautiful...",
  "Mixing a potion of pixels and creativity, just for you!",
  "Your image is currently stretching on the digital yoga mat...",
  "Chasing the dream pixels through the cyber meadow...",
  "Whispering to the circuits to craft your vision...",
  "The pixel fairies are hard at work on your masterpiece...",
  "Assembling the team of artistic bots for your service!",
  "Beep-bop! Your image is getting a robot's touch of whimsy...",
  "Channeling the digital muse and her electronic paintbrush...",
  "Your image is taking a short trip through the AI wonderland...",
  "Cooking up a graphic feast with a side of AI sauce...",
  "Orchestrating a symphony of pixels just for you...",
  "We're rolling out the red carpet for your AI-crafted image...",
  "Image in progress: currently teaching AI about your awesomeness!",
  "The AI is currently daydreaming of your image... almost there!",
  "Knitting your request with threads of virtual creativity...",
  "Crafting a masterpiece from the ether of imagination... Hold tight!",
  "Deploying digital elves to paint your vision...",
  "Catching creative sparks to light up your image...",
  "Summoning the pixel specters to their canvas posts...",
  "Embarking on a pixel quest to bring your image to life...",
  "Your pixels are currently swinging on a rainbow, coming soon!",
  "Launching a squad of doodle drones to sketch your request...",
  "Brace yourself for a symphony of AI artistry in the making...",
  "Fishing for inspiration in the stream of consciousness...",
  "Instructing our AI genie to grant your image wish...",
  "Spinning the color wheel: your image is just a twirl away!",
  "Creating with a dash of code and a sprinkle of pixel dust...",
  "Sneaking into the vault of visions to retrieve your image...",
  "Winding up the creative cogs for a masterpiece in the making...",
  "Cue the digital dance of the illustrative imps!",
  "Performing a high-res hocus pocus with an artistic twist...",
  "Taking your idea on a joyride through the pixel playground...",
  "Unlocking the vault of virtual creativity for your image...",
  "Revving up the render engines with artistic fuel...",
  "Setting the stage for your image's grand entrance...",
  "Tapping into the motherboard's muse for your visual feast...",
];

export const useRandomLoadingMessage = () => {
  const [quote, setQuote] = useState("Loading...");
  const setRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };
  useEffect(() => {
    setRandomQuote();
    const interval = setInterval(() => {
      setRandomQuote();
    }, 5000);
    return () => clearInterval(interval);
  });
  return quote;
};
