import React, { useCallback, useEffect, useState } from "react";
import ClayButton from "@clayui/button";

import LoadingModal from "./modals/LoadingModal";

import { useBrowseGraphData } from "./hooks/useBrowseGraphData";

function GraphNavigator(props) {
  const [loading, setLoading] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [dptUrl, setDptUrl] = useState(null);

  const { startNodeId, nodes, edges, loadGraphData } = useBrowseGraphData(
    props.treeService,
    props.nodeService,
    props.edgeService
  );

  useEffect(() => {
    loadGraphData(props.treeERC, setLoading);
  }, [props]);

  useEffect(() => {
    setDptUrl(props.nodeDptBaseUrl + currentNodeId + "?p_p_state=pop_up");
  }, [currentNodeId]);

  useEffect(() => {
    setCurrentNodeId(startNodeId);
  }, [startNodeId]);

  return (
    <div>
      {nodes
        .filter((node) => {
          return node.id == currentNodeId;
        })
        .map((node) => (
          <>
            {/* Hardcoded the layout for each node */}
            {node.nodeImage?.link?.href && (
              <img
                src={'http://localhost:8080' + node.nodeImage.link.href}
                alt={node.nodeImage?.link?.label ?? ""}
              />
            )}
            <h2>{node.nodeTitle}</h2>
            <p>Text: {node.nodeText}</p>
            
            <ClayButton.Group spaced>

              {edges.filter(edge => {return edge.source == currentNodeId}).map(edge =>
                (
                  <ClayButton 
                    displayType="secondary"
                    onClick={() => {setCurrentNodeId(edge.target)}}
                  >
                    {edge.label}
                  </ClayButton>

                )
              )}

            </ClayButton.Group> 

            {/* Allow editors to create a display page template a configure in Liferay */}
            {/* {dptUrl != null && (
              <iframe
                src={dptUrl}
                width="800"
                height="600"
                style={{ border: "none" }}
                loading="lazy"
              ></iframe>
            )} */}
          </>
        ))}
      <LoadingModal open={loading} />
    </div>
  );
}

export default GraphNavigator;
