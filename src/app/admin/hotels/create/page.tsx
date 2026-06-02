import HotelForm from "../HotelForm";

export default function CreateHotelPage() {
  return (
    <section className="mx-auto max-w-7xl p-8">
      <HotelForm mode="create" />
    </section>
  );
}