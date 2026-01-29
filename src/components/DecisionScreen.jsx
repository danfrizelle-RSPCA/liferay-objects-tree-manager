import React, { useState, useRef } from "react";
import ClayButton from "@clayui/button";

import AccordionGroup from "./AccordionGroup";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useNodeAccordions } from "../hooks/useNodeAccordions";

export default function DecisionScreen({ node, edges = [], onSelect, onBack, baseURL }) {
  const [selectedEdgeId, setSelectedEdgeId] = useState(null); // track selected option
  const [error, setError] = useState(""); // inline error message

  const decisionScreenRef = useRef(null);
  const scrollToTop = useScrollToTop(decisionScreenRef);
  
  // Load accordions for this node
  const { accordions } = useNodeAccordions(baseURL, node?.id);

  if (!node) return null;

  const imageSrc = node.nodeImage?.link?.href
    ? "http://localhost:8080" + node.nodeImage.link.href
    : null;

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
      setSelectedEdgeId(null); // reset selection for next node
      setError(""); // clear error
    }

    scrollToTop();
  };

  return (
    <div className="decision-screen" ref={decisionScreenRef}>
      <div className="row d-flex justify-content-between bg-rabbit-white">

        {/* LEFT COLUMN */}
        <div className="col-md-7 p-5">
          {node.nodeTitle && <h2 className="mt-0">{node.nodeTitle}</h2>}

          {/* Inline error under the title */}
          {error && <div className="alert alert-danger mt-4">{error}</div>}

          {/* Node text and accordion on final screen with no edges/answers*/}
          {console.log("Edges length:", edges.length)}
          {edges.length === 0 && (
            <>
              {node.nodeText && (
                <div dangerouslySetInnerHTML={{ __html: node.nodeText }} />
              )}
              {accordions && accordions.length > 0 && (
                <AccordionGroup accordionData={accordions} />
              )}
            </>
          )}

          {/* RADIO OPTIONS */}
          {edges.length > 0 && (
            <form className="options-group mt-4">
              {edges.map((edge) => {
                const isSelected = selectedEdgeId === edge.id;

                return (
                  <div key={edge.id} className="mb-3">
                    <input
                      type="radio"
                      id={`edge-${edge.id}`}
                      name="nextNode"
                      value={edge.id}
                      checked={isSelected}
                      onClick={() => {
                      console.log("Selected edge:", edge.id);
                      setSelectedEdgeId(edge.id);
                      setError(""); // clear error
                    }}
                      style={{
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        padding: 0,
                        margin: "-1px",
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        border: 0,
                      }}
                    />

                    <label
                      htmlFor={`edge-${edge.id}`}
                      className="radio-card-label d-flex align-items-center p-3 bg-sheep-white"
                      style={{ cursor: "pointer", borderRadius: "8px" }}
                    >
                      <div
                        className="aj__custom-radio mr-3"
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid var(--rspca-blue, #2622F7)",
                          borderRadius: "50%",
                          backgroundColor: isSelected ? "var(--rspca-blue, #2622F7)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && (
                          <i className="fa fa-check" style={{ color: "#fff", fontSize: "13px" }}></i>
                        )}
                      </div>
                      <span className="m-0 display-4 w-100">{edge.label}</span>
                    </label>
                  </div>
                );
              })}
            </form>

          )}

          {/* BACK & NEXT BUTTONS */}
          <div className={`d-flex mt-4 ${onBack ? "justify-content-between" : "justify-content-end"}`}>
            {onBack && (
              <ClayButton displayType="secondary" onClick={handleBack}>
                Back
              </ClayButton>
            )}

            {edges.length > 0 && (
              <ClayButton displayType="primary" onClick={handleNext}>
                Next
              </ClayButton>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-5 d-flex align-items-stretch p-0">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={node.nodeImage?.link?.label ?? ""}
              className="img-fluid aj__img-cover"
            />
          )}
        </div>

      </div>
    </div>
  );
}