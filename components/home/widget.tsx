import { ReactNode } from "react";


export default function Widget({
  title,
  large,
  children,
}: {
  title?: string;
  large?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative col-span-1 p-8 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      {
        typeof title === 'string' && (
          <div className="mx-auto mb-8 max-w-md text-center">
            <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent">
              {title}
            </h2>
          </div>
        )
      }
      <div className="flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
