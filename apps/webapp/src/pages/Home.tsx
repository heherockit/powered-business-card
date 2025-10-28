import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { Prompt } from '../components/molecules/Prompt';
import { TemplateGrid } from '../features/templates/components/TemplateGrid';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-7xl px-6 py-8 space-y-8 text-center">
        <section className="grid grid-cols-1 gap-3 place-items-center">
          <h1 className="m-0 text-2xl font-semibold">Create professional business cards</h1>
          <p className="m-0 text-textSecondary">Design, preview, and browse modern templates.</p>
        </section>

        <div className="baseline-flow">
          <Prompt />
        </div>

        <h2 className="mt-8 mb-3 text-xl font-semibold">Template Store</h2>
        <TemplateGrid />
      </main>
      <Footer />
    </>
  );
}
