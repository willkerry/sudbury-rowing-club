export default function PostBody({ content }) {
  return (
    <div className="mx-auto max-w-prose">
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
