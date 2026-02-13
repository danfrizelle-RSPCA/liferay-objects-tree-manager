import React, { useEffect, useState } from "react";

import { useBrowseGraphData } from "./hooks/useBrowseGraphData";
import { useNodeAccordions } from "./hooks/useNodeAccordions";
import DecisionScreen from "./components/DecisionScreen";
import "./FlowNavigator.css";

function FlowNavigator(props) {
  const [loading, setLoading] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [history, setHistory] = useState([]);

  const { accordionsByNodeId } = useNodeAccordions(
    props.accordionService,
    currentNodeId
  );

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
    <div className="graph-navigator" aria-busy={loading}>
      {loading ? (
        <DecisionScreen
          loading={true}
          node={null}
          edges={[]}
          accordions={[]}
          onSelect={() => {}}
          onBack={null}
          baseURL={props.treeService.baseURL}
        />
      ) : (
        nodes
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
          ))
      )}
    </div>
  );
}

export default FlowNavigator;
