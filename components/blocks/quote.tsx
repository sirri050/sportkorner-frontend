import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function Quote({ block }: {block:any}) {
  return (
    <blockquote>
      <BlocksRenderer content={block.quote} />

      {block.author && (
        <footer>{block.author}</footer>
      )}
    </blockquote>
  );
}