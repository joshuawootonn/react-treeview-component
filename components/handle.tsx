import classNames from "classnames";
import {
  ComponentPropsWithRef,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
} from "react";

type HandleProps = {
  className?: string;
} & ComponentPropsWithRef<"button">;

export const Handle = forwardRef<HTMLButtonElement, HandleProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames("cursor-grab", className)}
        onKeyDown={function (event: KeyboardEvent<HTMLButtonElement>) {
          event.preventDefault();
          //   event.stopPropagation();
          console.log({ inHandle: "yes" });
          props.onKeyDown?.(event);
        }}
        onClick={function (event: MouseEvent<HTMLButtonElement>) {
          //   event.stopPropagation();
          props.onClick?.(event);
        }}
      >
        <svg viewBox="0 0 20 20" width="12">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
        </svg>
      </button>
    );
  }
);
