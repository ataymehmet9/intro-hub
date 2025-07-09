import clsx from "clsx";

import { type MultiImageProps } from "./Images.types";

export default function ThreeColumnImageGrid({
  src,
  alt,
  className,
}: MultiImageProps) {
  return (
    <div
      className={clsx("grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3", {
        className,
      })}
    >
      {src.map((imageSrc, index) => (
        <div key={index}>
          <img
            src={imageSrc}
            alt={alt ? alt[index] : `grid image ${index + 1}`}
            className="border border-gray-200 rounded-xl dark:border-gray-800"
          />
        </div>
      ))}
    </div>
  );
}
