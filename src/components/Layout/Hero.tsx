import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import illustrationSvg from "./images/Illustration.svg";

const suggestions = [
  "Designer",
  "Programming",
  "Digital Marketing",
  "Video",
  "Animation"
];

const Hero = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(keyword, location);
  };

  return (
    <section className="w-full bg-background py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-0">
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-foreground">
            Find a job that suits <br className="hidden sm:block" />
            your interest & skills.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl">
            Search thousands of jobs across Nigeria and beyond. Find your next opportunity by title, skill, or location.
          </p>
          {/* Search Bar */}
          <form className="w-full max-w-xl mb-3" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-md overflow-hidden border border-border">
              <div className="flex items-center px-4 py-3 flex-1">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <Input
                  type="text"
                  placeholder="Job title, Keyword..."
                  className="border-0 outline-none shadow-none px-0 py-0 text-base flex-1 bg-transparent focus:ring-0 focus-visible:ring-0"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
              <div className="flex items-center px-4 py-3 flex-1 border-t sm:border-t-0 sm:border-l border-border">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                <Input
                  type="text"
                  placeholder="Your Location"
                  className="border-0 outline-none shadow-none px-0 py-0 text-base flex-1 bg-transparent focus:ring-0 focus-visible:ring-0"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-none sm:rounded-r-xl h-auto px-8 py-3 text-base font-semibold bg-primary text-primary-foreground">
                Find Job
              </Button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center mb-10 lg:mb-0">

          <img
            src={illustrationSvg}
            alt="Job search illustration"
            className="max-w-xs sm:max-w-md md:max-w-lg w-full h-auto"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;