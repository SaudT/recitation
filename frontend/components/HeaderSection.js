export default function HeaderSection({ title, description }) {
  return (
    <section className="bg-white py-12 px-4 text-center shadow-sm mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
    </section>
  );
}
