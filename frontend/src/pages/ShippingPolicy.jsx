import React from "react";

function ShippingPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Shipping Policy</h1>
      <p>
        We are committed to delivering your products quickly and safely. Please
        read our shipping terms below:
      </p>
      <ul className="list-disc ml-6 mt-3 space-y-2">
        <li>Orders are processed within 1–2 business days.</li>
        <li>
          Standard delivery time is 3–7 business days depending on your
          location.
        </li>
        <li>Shipping charges (if applicable) will be displayed at checkout.</li>
        <li>
          We currently ship across all major serviceable locations in India.
        </li>
      </ul>
      <p className="mt-4">
        For questions regarding shipping, contact{" "}
        <strong>admin@onecart.com</strong>.
      </p>
    </div>
  );
}

export default ShippingPolicy;
