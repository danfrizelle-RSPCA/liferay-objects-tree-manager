import React, { useState } from 'react';
import Accordion from './Accordion';

export default function AccordionGroup({ accordionData = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="accordion-container">
      <ul className="accordion-group">
        {accordionData.map((item, idx) => (
          <Accordion
            key={idx}
            index={idx}
            title={item.title}
            content={item.content}
            isOpen={openIndex === idx}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </div>
  );
}
