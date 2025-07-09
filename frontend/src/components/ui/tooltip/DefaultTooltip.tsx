import clsx from "clsx";

type TooltipProps = {
  container: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
};

const DefaultTooltip: React.FC<TooltipProps> = ({
  container,
  content,
  position = "top",
}) => {
  return (
    <div className="relative inline-block group">
      {container}
      <div
        className={clsx({
          "invisible absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100":
            position === "top",
          "invisible absolute left-full top-1/2 z-30 ml-2.5 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100":
            position === "right",
          "invisible absolute right-full top-1/2 mr-2.5 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100":
            position === "left",
          "invisible absolute left-1/2 top-full mt-2.5 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100":
            position === "bottom",
        })}
      >
        <div className="relative">
          <div className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 drop-shadow-4xl dark:bg-[#1E2634] dark:text-white">
            {content}
          </div>
          <div
            className={clsx({
              "absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#1E2634]":
                position === "top",
              "absolute -left-1.5 top-1/2 h-3 w-4 -translate-y-1/2 rotate-45 bg-white dark:bg-[#1E2634]":
                position === "right",
              "absolute -right-1.5 top-1/2 h-3 w-4 -translate-y-1/2 rotate-45 bg-white dark:bg-[#1E2634]":
                position === "left",
              "absolute -top-1 left-1/2 h-3 w-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#1E2634]":
                position === "bottom",
            })}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DefaultTooltip;
