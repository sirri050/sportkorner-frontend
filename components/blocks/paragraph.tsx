import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function Paragraph({ block }:{block:any}) {
  return (
    <BlocksRenderer
      content={block.description}
    />
  );
}