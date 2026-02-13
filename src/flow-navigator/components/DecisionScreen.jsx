import React, { useState, useRef } from "react";
import ClayButton from "@clayui/button";

import AccordionGroup from "./accordion/AccordionGroup";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function DecisionScreen({
  node,
  edges = [],
  accordions,
  onSelect,
  onBack,
  baseURL,
  loading = false,
}) {
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [error, setError] = useState("");

  const selectedEdge = selectedEdgeId ? edges.find((edge) => edge.id === selectedEdgeId) : null;

  const decisionScreenRef = useRef(null);
  const scrollToTop = useScrollToTop(decisionScreenRef);

  if (!node && !loading) return null;

  if (loading) {
    return (
      <div className="decision-screen" ref={decisionScreenRef} aria-busy="true">
        <div className="row d-flex justify-content-between bg-rabbit-white">
          <div className="col-md-7 p-5">
            <div className="aj-skeleton aj-skeleton--title" />

            <div className="mt-4">
              <div className="aj-skeleton aj-skeleton--line" />
              <div className="aj-skeleton aj-skeleton--line" />
              <div className="aj-skeleton aj-skeleton--line aj-skeleton--line-short" />
            </div>

            <div className="options-group mt-4">
              <div className="aj-skeleton aj-skeleton--option" />
              <div className="aj-skeleton aj-skeleton--option" />
              <div className="aj-skeleton aj-skeleton--option" />
            </div>

            <div className="d-flex mt-4 justify-content-end">
              <div className="aj-skeleton aj-skeleton--button" />
            </div>
          </div>

          <div className="col-md-5 d-flex align-items-stretch p-0">
            <div className="aj-skeleton aj-skeleton--image" />
          </div>
        </div>
      </div>
    );
  }

  const imageSrc = node.nodeImage?.link?.href
    ? "http://localhost:8080" + node.nodeImage.link.href
    : null;

  const youTubeID = node.nodeYouTubeID
    ? `${node.nodeYouTubeID}`.trim()
    : "";

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const handleNext = () => {
    if (selectedEdgeId === null) {
      scrollToTop();
      setError("Please select an option.");
      return;
    }

    const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
    if (selectedEdge) {
      console.log("Navigating to edge:", selectedEdge.id);
      onSelect(selectedEdge.target);
      setSelectedEdgeId(null);
      setError("");
    }

    scrollToTop();
  };

  return (
    <div className="decision-screen" ref={decisionScreenRef}>
      <div className="row d-flex justify-content-between bg-rabbit-white">
        <div className="col-md-7 p-5">
          {node.nodeTitle && <h2 className="mt-0">{node.nodeTitle}</h2>}

          {error && <div className="alert alert-danger mt-4">{error}</div>}

          {console.log("Edges length:", edges.length)}
          {node.nodeText && (
            <div dangerouslySetInnerHTML={{ __html: node.nodeText }} />
          )}
          {accordions && accordions.length > 0 && (
            <AccordionGroup
              accordionData={accordions
                .map((acc) => ({
                  title: acc.accordionHeading || acc.title || "",
                  content: acc.accordionContent || acc.content || "",
                }))
                .filter((item) => String(item.title).trim().length > 0)}
            />
          )}

          {edges.length > 0 && (
            <form className="options-group mt-4">
              {edges.map((edge) => {
                const isSelected = selectedEdgeId === edge.id;

                return (
                  <div key={edge.id} className="mb-3">
                    <input
                      type="radio"
                      id={`edge-${edge.id}`}
                      className="radio-input"
                      name="nextNode"
                      value={edge.id}
                      checked={isSelected}
                      onClick={() => {
                        console.log("Selected edge:", edge.id);
                        setSelectedEdgeId(edge.id);
                        setError("");
                      }}
                    />

                    <label
                      htmlFor={`edge-${edge.id}`}
                      className="radio-label d-flex align-items-center p-3 bg-sheep-white"
                    >
                      <div
                        className={"custom-radio mr-3 " + (isSelected ? "selected" : "")}
                      >
                        {isSelected && (
                          <i
                            className="fa fa-check"
                            style={{ color: "#fff", fontSize: "13px" }}
                          ></i>
                        )}
                      </div>
                      <span className="m-0 display-4 w-100">{edge.label}</span>
                    </label>
                  </div>
                );
              })}
            </form>
          )}

          <div
            className={`d-flex mt-4 ${onBack ? "justify-content-between" : "justify-content-end"
              }`}
          >
            {onBack && (
              <ClayButton
                id="js-backButton"
                displayType="secondary"
                onClick={handleBack}
                data-analytics-label="back"
                data-analytics-title={selectedEdge?.label ?? node?.nodeTitle ?? ""}
              >
                Back
              </ClayButton>
            )}

            {edges.length > 0 && (
              <ClayButton
                id="js-nextButton"
                displayType="primary"
                onClick={handleNext}
                data-analytics-label={selectedEdge?.label ?? ""}
                data-analytics-title={node?.nodeTitle ?? ""}
              >
                Next
              </ClayButton>
            )}
          </div>
        </div>

        <div className="col-md-5 p-0">
          {youTubeID ? (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${youTubeID}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            imageSrc && (
              <img
                src={imageSrc}
                alt={node.nodeImage?.link?.label ?? ""}
                className="ds-img"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
