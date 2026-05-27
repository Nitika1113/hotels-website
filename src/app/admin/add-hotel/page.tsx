"use client";

import { useState } from "react";

export default function AddHotelPage() {
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      console.log("UPLOAD RESULT:", result);

      // ✅ FIXED IMAGE URL
      if (result?.secure_url) {
        setImage(result.secure_url);

        console.log(
          "FINAL IMAGE URL:",
          result.secure_url
        );
      } else {
        alert("Image upload failed");
      }

    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // ✅ Prevent submit before image upload
    if (!image) {
      alert("Please upload image first");
      return;
    }

    const form = e.currentTarget;

    const hotelData = {
      name: (form.hotelName as HTMLInputElement).value,

      location: (form.location as HTMLInputElement).value,

      price: Number(
        (form.price as HTMLInputElement).value
      ),

      rating: Number(
        (form.rating as HTMLInputElement).value
      ),

      image: image,
    };

    console.log("HOTEL DATA:", hotelData);

    try {
      const response = await fetch("/api/hotels", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(hotelData),
      });

      const result = await response.json();

      console.log("HOTEL RESPONSE:", result);

      alert("Hotel Added Successfully");

      // ✅ Reset form
      form.reset();

      setImage("");

    } catch (error) {
      console.log("SUBMIT ERROR:", error);

      alert("Failed To Add Hotel");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">
        Add Hotel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-w-xl"
      >
        <input
          name="hotelName"
          placeholder="Hotel Name"
          className="border p-3 w-full"
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="border p-3 w-full"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="border p-3 w-full"
          required
        />

        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          className="border p-3 w-full"
          required
        />

        <input
          type="file"
          onChange={handleUpload}
          required
        />

        {uploading && (
          <p className="text-sm text-gray-500">
            Uploading image...
          </p>
        )}

        {/* ✅ IMAGE PREVIEW */}
        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg"
          />
        )}

        <button
          type="submit"
          disabled={uploading}
          className="
            bg-black
            text-white
            px-6
            py-3
            disabled:opacity-50
          "
        >
          {uploading ? "Uploading..." : "Add Hotel"}
        </button>
      </form>
    </div>
  );
}