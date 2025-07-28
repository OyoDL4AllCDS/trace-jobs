import illustrationSvg from "@/components/Layout/images/Illustration.svg";
const CareerTips = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">
    <img
      src={illustrationSvg}
      alt="Coming soon illustration"
      className="w-40 h-40 mb-8 mx-auto"
      style={{ objectFit: 'contain' }}
      draggable="false"
    />
    <h1 className="text-3xl sm:text-4xl font-bold mb-4">Coming Soon</h1>
    <p className="text-muted-foreground text-lg mb-2">We're cooking up something awesome for your career journey!</p>
    <p className="text-primary font-medium">Stay tuned for tips, guides, and a sprinkle of job magic ✨</p>
  </div>
);

export default CareerTips