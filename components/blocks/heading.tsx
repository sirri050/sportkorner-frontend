export default function Heading({ block }:{block:any}) {
  const Tag = block.level || "h2";

  return <Tag>{block.title}</Tag>;
}