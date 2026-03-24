import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const Markdown = ({ children, className }: { children: string; className?: string }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className || ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
