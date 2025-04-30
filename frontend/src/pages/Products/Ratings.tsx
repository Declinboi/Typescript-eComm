import { Star, StarHalf } from "lucide-react";

const Ratings = ({ value, text, color }: any) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={index}
          className={`fill-yellow-500 stroke-yellow-500 ml-1`}
        />
      ))}

      {halfStars === 1 && (
        <StarHalf className={`fill-yellow-500 stroke-yellow-500 ml-1`} />
      )}
      {[...Array(emptyStar)].map((_, index) => (
        <Star key={index} className={`text-${color} ml-1`} />
      ))}

      {text && (
        <span className="ml-2 text-sm font-medium text-gray-700">{text}</span>
      )}
    </div>
  );
};

Ratings.defaultProps = {
  color: "#EAB308",
};

export default Ratings;
