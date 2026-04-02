import React from "react";

const SummaryCard = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        flex: 1,
        borderLeft: `8px solid ${color}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        minWidth: "200px",
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#6c757d",
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {title}
      </h4>
      <h2
        style={{
          margin: "10px 0 0 0",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#212529",
        }}
      >
        ${value.toLocaleString()}
      </h2>
    </div>
  );
};

export default SummaryCard;
