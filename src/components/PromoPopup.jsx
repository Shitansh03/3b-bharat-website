import { useEffect, useState } from "react";

const popupImages = [
  {
    image: "/popup1.jpeg",
    link: "https://3dbharat.com/trial-info?category=road",
  },
  {
    image: "/popup2.jpeg",
    link: "",
  },
  {
    image: "/popup3.jpeg",
    link: "",
  },
  {
    image: "/popup4.jpeg",
    link: "",
  },
  {
    image: "/popup5.jpeg",
    link: "",
  },
  {
    image: "/popup6.jpeg",
    link: "",
  },
];

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shuffledImages, setShuffledImages] = useState([]);

  // Shuffle images randomly
  useEffect(() => {
    const shuffled = [...popupImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  // Reset popup on reload
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      sessionStorage.removeItem("home_popup_closed");
    });
  }, []);

  // Open popup once until reload
  useEffect(() => {
    const popupClosed = sessionStorage.getItem("home_popup_closed");

    if (!popupClosed) {
      setIsOpen(true);
    }
  }, []);

  // Auto slide every 5 sec
  useEffect(() => {
    if (!isOpen || shuffledImages.length === 0) return;

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) =>
        (prev + 1) % shuffledImages.length
      );
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [isOpen, shuffledImages]);

  // Show close button after 10 sec
  useEffect(() => {
    if (!isOpen) return;

    const closeTimer = setTimeout(() => {
      setShowClose(true);
    }, 100);

    return () => clearTimeout(closeTimer);
  }, [isOpen]);

  const handleClose = () => {
    sessionStorage.setItem("home_popup_closed", "true");
    setIsOpen(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      (prev + 1) % shuffledImages.length
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0
        ? shuffledImages.length - 1
        : prev - 1
    );
  };

  if (!isOpen || shuffledImages.length === 0) return null;

  const currentItem = shuffledImages[currentSlide];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="relative w-[95%] max-w-[900px] rounded-3xl overflow-hidden shadow-2xl">

        {/* Close Button */}
        {showClose && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold hover:bg-black transition-all duration-300"
          >
            ×
          </button>
        )}

        {/* Clickable Image */}
        {currentItem.link ? (
          <a
            href={currentItem.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={currentItem.image}
              alt="promo"
              className="w-full h-auto object-cover cursor-pointer"
            />
          </a>
        ) : (
          <img
            src={currentItem.image}
            alt="promo"
            className="w-full h-auto object-cover"
          />
        )}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl hover:bg-black transition-all duration-300"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center text-3xl hover:bg-black transition-all duration-300"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {shuffledImages.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white scale-125"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;