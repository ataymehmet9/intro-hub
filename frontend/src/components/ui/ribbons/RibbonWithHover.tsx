import clsx from "clsx";

type RibbonWithHoverProps = {
  mainText: string;
  ribbonIcon: React.ReactNode;
  additionalChildren?: React.ReactNode;
  ribbonText?: string;
  className?: string;
};

export default function RibbonWithHover({
  mainText,
  ribbonIcon,
  additionalChildren,
  ribbonText = "Popular",
  className,
}: RibbonWithHoverProps) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]",
        className
      )}
    >
      <span className="after:bottom-0-0 group absolute -left-px mt-3 flex -translate-x-[55px] items-center gap-1 bg-brand-500 px-4 py-1.5 text-sm font-medium text-white transition-transform duration-500 ease-in-out before:absolute before:-right-4 before:top-0 before:border-[16px] before:border-transparent before:border-l-brand-500 before:border-t-brand-500 before:content-[''] after:absolute after:-right-4 after:border-[16px] after:border-transparent after:border-b-brand-500 after:border-l-brand-500 after:content-[''] group-hover:translate-x-0">
        <span className="transition-opacity duration-300 ease-linear opacity-0 group-hover:opacity-100">
          {ribbonText}
        </span>
        {ribbonIcon}
      </span>
      <div className="p-5 pt-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">{mainText}</p>
        {additionalChildren && (
          <span className="block mt-2">{additionalChildren}</span>
        )}
      </div>
    </div>
  );
}
