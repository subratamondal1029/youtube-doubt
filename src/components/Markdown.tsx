import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

type Props = {
  children: string;
  className?: string;
};

export default function Markdown({ children, className }: Props) {
  return (
    <div
      className={`
        prose prose-invert max-w-none
        prose-p:my-4
        prose-pre:my-4
        prose-li:my-1
        prose-headings:mt-6 prose-headings:mb-3
        ${className ?? ""}
      `}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
