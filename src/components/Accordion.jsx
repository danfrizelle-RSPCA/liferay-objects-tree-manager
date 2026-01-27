import React from 'react';

export default function Accordion({
  title,
  content,
  index,
  isOpen,
  onToggle,
}) {
  return (
    <li className={`bg-primary ${isOpen ? 'open' : ''}`}>
      <button
        id={`accordion-${index}`}
        className="heading-toggle"
        aria-controls={`sect-${index}`}
        aria-expanded={isOpen}
        onClick={() => onToggle(index)}
      >
        <div className="icon-background">
          <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`} />
        </div>

        <div id={`accHeading-${index}`}>
          {title}
        </div>
      </button>

      <div
        id={`sect-${index}`}
        role="region"
        aria-labelledby={`accordion-${index}`}
        className={`contents ${isOpen ? 'show' : ''}`}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div id={`accContent-${index}`} type="rich-text" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </li>
  );
}