import React, { useEffect, useRef, useState } from "react";

import LoadingModal from "../shared/modals/LoadingModal";
import { useBrowseGraphData } from "./hooks/useBrowseGraphData";
import DecisionScreen from "./components/DecisionScreen";
import "./GraphNavigator.css";

function GraphNavigator(props) {
  const [loading, setLoading] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [history, setHistory] = useState([]);

  // Accordion cache: nodeId -> normalized accordion array
  const [accordionsByNodeId, setAccordionsByNodeId] = useState({});
  const accordionRequestIdRef = useRef(0);

  const { startNodeId, nodes, edges, loadGraphData } = useBrowseGraphData(
    props.treeService,
    props.nodeService,
    props.accordionService,
    props.edgeService
  );

  // Load graph data whenever treeERC changes
  useEffect(() => {
    loadGraphData(props.treeERC, setLoading);
  }, [props.treeERC, loadGraphData]);

  // Initialize currentNodeId when startNodeId changes
  useEffect(() => {
    setHistory([]); // clear history on new tree
    setCurrentNodeId(startNodeId != null ? "" + startNodeId : null);
  }, [startNodeId, props.treeERC]);

  // Fetch accordions for the current node on navigation (do not block navigator render)
  useEffect(() => {
    if (!currentNodeId) return;
    if (accordionsByNodeId[currentNodeId] !== undefined) return;

    const requestId = ++accordionRequestIdRef.current;

    props.accordionService
      .getAccordions(currentNodeId)
      .then((accordions) => {
        if (accordionRequestIdRef.current !== requestId) return;
        setAccordionsByNodeId((prev) => ({
          ...prev,
          [currentNodeId]: accordions,
        }));
      })
      .catch((error) => {
        if (accordionRequestIdRef.current !== requestId) return;
        console.log(
          `No accordions found for node ${currentNodeId}:`,
          error?.message
        );
        setAccordionsByNodeId((prev) => ({
          ...prev,
          [currentNodeId]: [],
        }));
      });
  }, [currentNodeId, accordionsByNodeId, props.accordionService]);

  // Handle selecting a new node
  const handleSelectNode = (targetNodeId) => {
    if (currentNodeId != null) {
      setHistory((prev) => [...prev, currentNodeId]);
    }
    setCurrentNodeId(targetNodeId != null ? "" + targetNodeId : null);
  };

  // Handle going back
  const handleBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;

      const newHistory = [...prev];

      const previousNodeId = newHistory.pop();
      setCurrentNodeId(previousNodeId);
      return newHistory;
    });
  };

  return (
    <div>
      {nodes
        .filter((node) => node.id === currentNodeId)
        .map((node) => (
          <>
            {console.log("Rendering DecisionScreen for node:", node)}
            {console.log("Current Node ID:", currentNodeId)}
            <DecisionScreen
              key={node.id}
              node={node}
              baseURL={props.treeService.baseURL}
              accordions={accordionsByNodeId[currentNodeId]}
              edges={edges.filter((edge) => edge.source === currentNodeId)}
              onSelect={handleSelectNode}
              onBack={history.length > 0 ? handleBack : null}
            />
          </>
        ))}
      {loading && <LoadingModal />}
    </div>
  );
}

export default GraphNavigator;
