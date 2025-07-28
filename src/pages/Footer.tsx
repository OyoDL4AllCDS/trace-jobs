import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="container mx-auto px-4 sm-px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/jobtrace_logo.jpeg" 
                  alt="JobTrace Logo" 
                  className="h-8 w-full rounded-lg object-cover"
                />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground w-full">
              Your all-in-one job tracker portal for searching and saving jobs with less hassle. Find your dream job today.
            </p>
          </div>
          
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JobTrace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
  
export default Footer