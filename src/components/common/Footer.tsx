import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <h2 className="text-2xl font-bold">
            Dream Stay
          </h2>

          <p className="text-sm text-gray-400">
            © 2026 Dream Stay. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}