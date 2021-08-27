export default function PostTitle({ children }) {
  return (
    <h1 className="mb-12 text-3xl font-bold leading-tight tracking-tighter text-gray-900 md:text-5xl lg:text-7xl md:leading-none">
      {children}
    </h1>
  );
}
