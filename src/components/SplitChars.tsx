/**
 * Splits text into per-character spans for reveal animations.
 * Characters are grouped per word (no mid-word wrapping) and masked with an oversized clip-path
 * so ascenders, descenders and italics are never sliced.
 */
export default function SplitChars({ text, attr = 'data-char' }: { text: string; attr?: string }) {
  const words = text.split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split('').map((c, i) => (
            <span key={i} className="mask">
              <span {...{ [attr]: '' }} className="inline-block origin-bottom">
                {c}
              </span>
            </span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      </span>
    </>
  );
}
