import Gallery from "./blocks/gallery";
import Heading from "./blocks/heading";
import ImageBlock from "./blocks/imageBlock";
import Paragraph from "./blocks/paragraph";
import Quote from "./blocks/quote";
import Video from "./blocks/video";


export default function DynamicZoneRenderer({ blocks }:{blocks:unknown[]}) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block:any) => {
        switch (block.__component) {
          case "heading.heading":
            return <Heading key={`${block.__component}-${block.id}`} block={block} />;

          case "paragraph.paragraph":
            return <Paragraph key={`${block.__component}-${block.id}`} block={block} />;

          case "image.image":
            return <ImageBlock key={`${block.__component}-${block.id}`} block={block} />;

          case "gallery.gallery":
            return <Gallery key={`${block.__component}-${block.id}`} block={block} />;

          case "quote.quote":
            return <Quote key={`${block.__component}-${block.id}`} block={block} />;

          case "video.video":
            return <Video key={`${block.__component}-${block.id}`} block={block} />;

          default:
            return null;
        }
      })}
    </>
  );
}