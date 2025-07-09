import clsx from "clsx";

import { type ImageProps } from "./Images.types";

export default function ResponsiveImage({ src, alt, className }: ImageProps) {
  return (
    <div className={clsx("relative", { className })}>
      <div className="overflow-hidden">
        <img
          src={src}
          alt={alt ?? "Responsive Image"}
          className="w-full border border-gray-200 rounded-xl dark:border-gray-800"
        />
      </div>
    </div>
  );
}
