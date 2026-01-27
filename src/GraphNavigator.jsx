import React, { useEffect, useState } from "react";
import ClayButton from "@clayui/button";

import LoadingModal from "./modals/LoadingModal";
import { useBrowseGraphData } from "./hooks/useBrowseGraphData";
import DecisionScreen from "./components/DecisionScreen";
import "./GraphNavigator.css";

function GraphNavigator(props) {
  const [loading, setLoading] = useState(true);
  // console.log(loading ? "Loading..." : "Loaded.");
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [history, setHistory] = useState([]);
  const [dptUrl, setDptUrl] = useState(null);

  const { startNodeId, nodes, edges, loadGraphData } = useBrowseGraphData(
    props.treeService,
    props.nodeService,
    props.edgeService
  );

  // Load graph data whenever treeERC changes
  useEffect(() => {
    loadGraphData(props.treeERC, setLoading);
  }, [props.treeERC]);

  // Update DPT URL whenever currentNodeId changes
  useEffect(() => {
    if (currentNodeId) {
      setDptUrl(props.nodeDptBaseUrl + currentNodeId + "?p_p_state=pop_up");
    }
  }, [currentNodeId]);

  // Initialize currentNodeId when startNodeId changes
  useEffect(() => {
    setHistory([]); // clear history on new tree
    setCurrentNodeId(startNodeId);
  }, [startNodeId, props.treeERC]);

  // Handle selecting a new node
  const handleSelectNode = (targetNodeId) => {
    if (currentNodeId != null) {
      setHistory((prev) => [...prev, currentNodeId]);
    }
    setCurrentNodeId(targetNodeId);
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
        .filter((node) => node.id == currentNodeId)
        .map((node) => (
          <>
            {console.log("Rendering DecisionScreen for node:", node)}
            {console.log("Current Node ID:", currentNodeId)}
            <DecisionScreen
              key={node.id}
              node={node}
              edges={edges.filter((edge) => edge.source == currentNodeId)}
              onSelect={handleSelectNode}
              onBack={history.length > 0 ? handleBack : null} // show back only if history exists
            />
          </>
        ))}
      {loading && <LoadingModal />}
    </div>
  );
}

export default GraphNavigator;
