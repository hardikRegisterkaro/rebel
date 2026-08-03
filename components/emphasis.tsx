import { Fragment } from "react";

/**
 * Renders copy authored with *asterisk emphasis* as real `<em>` elements.
 * Keeps lib/content.ts free of markup while still producing semantic HTML.
 */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((segment, index) =>
        index % 2 ? (
          <em key={index} className="italic">
            {segment}
          </em>
        ) : (
          <Fragment key={index}>{segment}</Fragment>
        ),
      )}
    </>
  );
}
