import { Star, StarHalf, StarOff } from "lucide-react";

const Ratings = ({ value, text, color }:any ) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <Star key={index} className={`text-${color} ml-1`} />
      ))}

      {halfStars === 1 && <StarHalf className={`text-${color} ml-1`} />}
      {[...Array(emptyStar)].map((_, index) => (
        <StarOff key={index} className={`text-${color} ml-1`} />
      ))}

      <span className={`rating-text ml-{2rem} text-${color}`}>
        {text && text}
      </span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
