import clsx from "clsx";

type FilledRibbonProps = {
  mainText: string;
  additionalChildren?: React.ReactNode;
  ribbonText?: string;
  className?: string;
};

export default function FilledRibbon({
  mainText,
  additionalChildren,
  ribbonText = "New",
  className,
}: FilledRibbonProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]",
        className
      )}
    >
      <span className="absolute -left-9 -top-7 mt-3 flex h-14 w-24 -rotate-45 items-end justify-center bg-brand-500 px-4 py-1.5 text-sm font-medium text-white shadow-theme-xs">
        {ribbonText}
      </span>
      <div className="p-5 pt-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {mainText}
          {additionalChildren && (
            <span className="block mt-2">{additionalChildren}</span>
          )}
        </p>
      </div>
    </div>
  );
}
