import { Fragment } from "react";

/**
 * An answer's blocks, rejoined with the artboard's hard breaks.
 *
 * Both artboards set every answer as one `<p>` containing `<br><br>` rather
 * than as sibling paragraphs. Reproducing that literally is not pedantry: a
 * real `<p>` would pick up a margin and change the vertical rhythm inside the
 * open panel, which is exactly what the visual diff measures.
 */
export function AnswerText({ blocks }: { blocks: readonly string[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={block}>
          {index > 0 ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          {block}
        </Fragment>
      ))}
    </>
  );
}
