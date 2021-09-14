export default function PostTitle({ children }) {
  return (
    <h1 className="mt-2 mb-10 text-3xl font-semibold leading-tight tracking-tighter text-gray-800 md:text-5xl lg:text-6xl md:leading-none">
      {children}
    </h1>
  );
}
