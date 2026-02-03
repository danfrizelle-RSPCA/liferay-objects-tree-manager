import React, { useState } from "react";
import ClayButton from "@clayui/button";

/**
 * Simple content block with optional title, content, image, YouTube, and button
 */
export function ContentBlock({
  id,
  title,
  content,
  img,
  imgAlt,
  youtubeID,
  buttonLabel,
  buttonUrl,
}) {
  return (
    <div id={id}>
      <div className="row d-flex justify-content-between bg-rabbit-white">
        <div className="col-md-7 p-5">
          {title && <h2 className="mt-0">{title}</h2>}
          {content && <div dangerouslySetInnerHTML={{ __html: content }} />}

          <div className="d-flex justify-content-between mt-3">
            <ClayButton displayType="secondary">Back</ClayButton>
            {buttonLabel && (
              <ClayButton
                displayType="primary"
                onClick={() => window.open(buttonUrl, "_blank")}
              >
                {buttonLabel}
              </ClayButton>
            )}
          </div>
        </div>
        <div className="col-md-5 px-0 p-5">
          {img && (
            <img src={img} alt={imgAlt} className="img-fluid aj__img-cover" />
          )}
          {youtubeID && (
            <iframe
              id="ytplayer"
              width="100%"
              height="360"
              src={`https://www.youtube.com/embed/${youtubeID}`}
              frameBorder="0"
              title="YouTube video"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Content block with accordion functionality
 */
export function ContentBlockAccordion({
  id,
  title,
  content,
  img,
  imgAlt,
  youtubeID,
  buttonLabel,
  buttonUrl,
  accordions = [],
}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id={id}>
      <div className="row d-flex justify-content-between bg-rabbit-white">
        <div className="col-md-7 p-5">
          {title && <h2 className="mt-0">{title}</h2>}
          {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
          <div className="accordion-container">
            <ul className="accordion-group">
              {accordions.map((accordion, index) => (
                <li key={index} className={openIndex === index ? "open" : ""}>
                  <button
                    className="heading-toggle aj__heading-toggle"
                    aria-expanded={openIndex === index}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="icon-background">
                      <i className="fa fa-chevron-down"></i>
                    </div>
                    <div>
                      {accordion.title && (
                        <h3 className="accordion-heading display-4 text-rabbit-white mt-0 mb-0">
                          {accordion.title}
                        </h3>
                      )}
                    </div>
                  </button>
                  <div
                    className={`contents aj__contents ${
                      openIndex === index ? "show" : ""
                    }`}
                    role="region"
                  >
                    <div type="rich-text">{accordion.content}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <ClayButton displayType="secondary">Back</ClayButton>
            {buttonLabel && (
              <ClayButton
                displayType="primary"
                onClick={() => window.open(buttonUrl, "_blank")}
              >
                {buttonLabel}
              </ClayButton>
            )}
          </div>
        </div>

        <div className="col-md-5 px-0 p-5">
          {img && (
            <img src={img} alt={imgAlt} className="img-fluid aj__img-cover" />
          )}
          {youtubeID && (
            <iframe
              id="ytplayer"
              width="100%"
              height="360"
              src={`https://www.youtube.com/embed/${youtubeID}`}
              frameBorder="0"
              title="YouTube video"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Radio form component with selectable options and Next/Back buttons
 */
export function RadioForm({
  id,
  title,
  paraOne,
  paraTwo,
  img,
  imgAlt,
  labels = [],
  onNext,
  onBack,
}) {
  const [selectedRadio, setSelectedRadio] = useState(null);

  const handleNext = () => {
    if (selectedRadio === null) {
      alert("Please select an option.");
      return;
    }
    onNext(selectedRadio);
  };

  return (
    <div id={id}>
      <div className="row d-flex flex-column-reverse flex-md-row justify-content-between">
        <div className="p-5 bg-rabbit-white col-md-7 radio-button-set">
          {title && <h2 className="mt-0">{title}</h2>}
          {paraOne && <p>{paraOne}</p>}
          {paraTwo && <p>{paraTwo}</p>}

          <form className="pt-3">
            <div className="row">
              {labels.map((label, index) => (
                <div
                  key={index}
                  className="col-sm radio-card form-check aj__pointer bg-sheep-white p-4 mb-4 mx-sm-2 position-relative"
                >
                  <div className="d-flex align-items-center">
                    <input
                      required
                      className="form-check-input mr-2 aj__radio"
                      type="radio"
                      id={`js-radio${label.id}`}
                      name="nextNode"
                      checked={selectedRadio === label.id}
                      onChange={() => setSelectedRadio(label.id)}
                    />
                    <label
                      className="m-0 pl-4 display-4 col-md-10 align-middle"
                      htmlFor={`js-radio${label.id}`}
                    >
                      {label.name}
                    </label>
                  </div>
                  {label.para && <p>{label.para}</p>}
                </div>
              ))}
            </div>
          </form>

          <div className="d-flex justify-content-between mt-3">
            {onBack && (
              <ClayButton displayType="secondary" onClick={onBack}>
                Back
              </ClayButton>
            )}
            <ClayButton displayType="primary" onClick={handleNext}>
              Next
            </ClayButton>
          </div>
        </div>

        <div className="col-md-5 d-flex align-items-stretch p-0">
          {img && (
            <img src={img} alt={imgAlt} className="img-fluid aj__img-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
