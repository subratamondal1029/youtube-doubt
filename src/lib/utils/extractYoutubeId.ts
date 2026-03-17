const extractYouTubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return url.match(regex)?.[1] ?? null;
};

export default extractYouTubeId;
