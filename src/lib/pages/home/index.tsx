"use client";

const figmaReference =
  "https://www.figma.com/api/mcp/asset/8588ada7-1820-4ff2-ad23-576bef501c2f.png";

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#081d45]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(31,110,255,0.88),rgba(9,43,104,0.96)_28%,rgba(5,19,46,1)_100%)]" />
      <img
        src={figmaReference}
        alt="C.C.House reference design"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  );
};

export default Home;
