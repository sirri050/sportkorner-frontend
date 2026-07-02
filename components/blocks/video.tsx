export default function Video({ block }:{block:any}) {
  if (!block.URL) return null;

  const getYoutubeId = (url:string) => {
    const reg =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

    const match = url.match(reg);

    return match && match[1].length === 11
      ? match[1]
      : null;
  };

  const id = getYoutubeId(block.URL);

  if (!id) return null;

  return (
    <div>
      <iframe
        width="100%"
        height="500"
        src={`https://www.youtube.com/embed/${id}`}
        title={block.caption}
        allowFullScreen
      />

      {block.caption && (
        <p>{block.caption}</p>
      )}
    </div>
  );
}