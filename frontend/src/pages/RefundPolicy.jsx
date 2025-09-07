import React from "react";

function RefundPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Cancellation & Refund Policy</h1>
      <p>
        At OneCart, we aim to provide the best shopping experience. If you are
        not satisfied with your purchase, you may request a cancellation or
        refund subject to the following conditions:
      </p>
      <ul className="list-disc ml-6 mt-3 space-y-2">
        <li>Orders can be cancelled within 24 hours of placement.</li>
        <li>Refunds will be processed within 7–10 business days.</li>
        <li>
          Returns are accepted within 7 days of delivery under our Easy Return
          Policy.
        </li>
        <li>
          Exchange requests are quick, simple, and processed through our support
          team.
        </li>
      </ul>
      <p className="mt-4">
        For any queries, please reach out to <strong>admin@onecart.com</strong>.
      </p>
    </div>
  );
}

export default RefundPolicy;
