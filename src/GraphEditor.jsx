import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
  useReactFlow,
} from "@xyflow/react";

import ClayButton from "@clayui/button";
import CustomNode from "./flow-customization/CustomNode";
import CustomEdge from "./flow-customization/CustomEdge";
import { useTreeCreation } from "./hooks/useTreeCreation";
import { useTreeDeletion } from "./hooks/useTreeDeletion";
import { useTreeSelection } from "./hooks/useTreeSelection";
import { useNodeCreation } from "./hooks/useNodeCreation";
import { useNodeUpdate } from "./hooks/useNodeUpdate";
import { useEdgeCreation } from "./hooks/useEdgeCreation";
import { useEdgeUpdate } from "./hooks/useEdgeUpdate";
import { useTreeData } from "./hooks/useTreeData";
import { useGraphData } from "./hooks/useGraphData";
import { getLayoutedElements } from "./utils/layoutUtils";
import LoadingModal from "./modals/LoadingModal";
import EdgeCreationModal from "./modals/EdgeCreationModal";
import EdgeEditionModal from "./modals/EdgeEditionModal";
import NodeCreationModal from "./modals/NodeCreationModal";
import NodeUpdateModal from "./modals/NodeUpdateModal";
import TreeSelectionModal from "./modals/TreeSelectionModal";
import TreeDeletionModal from "./modals/TreeDeletionModal";
import TreeCreationModal from "./modals/TreeCreationModal";

/* GraphEditor: main editing UI
- composes many hooks located under `src/hooks/` to handle tree selection, node/edge creation and updates, and tree lifecycle
- delegates API operations to service instances passed in via props (see `src/index.jsx` where services are constructed)
- uses `@xyflow/react` for the canvas; node rendering is provided by `flow-customization/CustomNode.jsx` */

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

function GraphEditor(props) {
  const { fitView } = useReactFlow();
  const [loading, setLoading] = useState(false);
  const [treeId, setTreeId] = useState();
  const { trees, loadTreeData } = useTreeData(props.treeService, setTreeId);
  const hasTrees = trees && trees.length > 0;
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    loadGraphData,
    wipeGraphData,
  } = useGraphData(props.nodeService, props.edgeService, fitView);
  const {
    onConnect,
    handleEdgeCreationModalClose,
    handleEdgeCreation,
    edgeCreationModalOpen,
  } = useEdgeCreation(props.edgeService, setEdges, treeId);
  const {
    onConnectEnd,
    handleNodeCreationModalClose,
    handleNodeCreation,
    nodeCreationModalOpen,
    openNodeCreationModal,
  } = useNodeCreation(
    props.nodeService,
    props.edgeService,
    setNodes,
    setEdges,
    treeId
  );
  const {
    onNodeClick,
    onNodeDragStop,
    handleNodeUpdateModalClose,
    handleNodeUpdate,
    handleNodeDelete,
    handleNodeSetAsStart,
    nodeUpdateModalOpen,
    currentNode,
  } = useNodeUpdate(props.nodeService, nodes, setNodes);
  const {
    onEdgeClick,
    handleEdgeEditionModalClose,
    handleEdgeLabelChange,
    handleEdgeDelete,
    edgeEditionModalOpen,
    currentEdge,
  } = useEdgeUpdate(props.edgeService, edges, setEdges);
  const {
    onSelectTree,
    handleTreeSelectionModalClose,
    handleTreeSelection,
    treeSelectionModalOpen,
  } = useTreeSelection(setTreeId);
  const {
    onCreateTree,
    handleTreeCreationModalClose,
    handleTreeCreation,
    treeCreationModalOpen,
  } = useTreeCreation(
    props.treeService,
    props.nodeService,
    loadTreeData,
    loadGraphData,
    setLoading
  );
  const {
    onDeleteTree,
    handleTreeDeletionModalClose,
    handleTreeDeletion,
    treeDeletionModalOpen,
  } = useTreeDeletion(props.treeService, loadTreeData);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(
        nodes,
        edges,
        { direction },
        props.nodeService
      );

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  useEffect(() => {
    loadTreeData();
    if (props.treeId != null) {
      setTreeId(props.treeId);
    }
  }, [props]);

  useEffect(() => {
    if (treeId != null) {
      loadGraphData(treeId, setLoading);
    } else {
      wipeGraphData();
    }
  }, [treeId]);

  const smoothEdges = edges.map((edge) => ({
    ...edge,
    type: "custom", // Options: bezier || smoothstep || straight || step || custom
    style: { stroke: "#004AD7", strokeWidth: 2 },
    markerEnd: {
      type: "arrowclosed",
      color: "#004AD7", // Arrow color
    },
  }));

  return (
    <>
      <div style={{ width: "100%", height: "100dvh" }}>
        <ReactFlow
          style={{ background: "#E7E7ED" }}
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={smoothEdges}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          onNodeDragStop={onNodeDragStop}
          onEdgeClick={onEdgeClick}
          nodesDraggable={true}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          minZoom={0.2}
          maxZoom={4}
        >
          <Controls />
          <MiniMap zoomable pannable />
          <Background variant="dots" gap={12} size={1} />
          {treeId != null ? (
            <Panel position="top-right">
              <div className="d-flex flex-wrap c-gap-2 flex-column bg-dark p-2">
                <ClayButton
                  displayType="primary"
                  onClick={() => openNodeCreationModal()}
                >
                  Add node
                </ClayButton>
                <ClayButton displayType="secondary" onClick={onCreateTree}>
                  Create a flow
                </ClayButton>
                <ClayButton displayType="secondary" onClick={onSelectTree}>
                  Change flow
                </ClayButton>
                <ClayButton
                  displayType="secondary"
                  onClick={() => {
                    if (treeId != null) {
                      loadGraphData(treeId, setLoading);
                    }
                  }}
                >
                  Refresh data
                </ClayButton>
                <ClayButton
                  displayType="warning"
                  onClick={() => onLayout("TB")}
                >
                  Auto layout
                </ClayButton>

                <ClayButton displayType="danger" onClick={onDeleteTree}>
                  Delete flow
                </ClayButton>
              </div>
            </Panel>
          ) : (
            <Panel position="" className="center-panel">
              <h1>
                {trees != null && treeId != null
                  ? trees.find((tree) => tree.id == treeId).treeLabel
                  : "Start building your decision tree"}
              </h1>
              <p>Add questions, answer and connect them to create a flow</p>
              <div className="d-flex flex-wrap c-gap-2 flex-column">
                <ClayButton displayType="primary" onClick={onCreateTree}>
                  Create a new flow
                </ClayButton>
                <ClayButton
                  displayType="secondary"
                  onClick={onSelectTree}
                  disabled={!hasTrees}
                >
                  {!hasTrees ? "Loading…" : "Select saved flow"}
                </ClayButton>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      <LoadingModal open={loading} />
      <TreeSelectionModal
        open={treeSelectionModalOpen && !loading}
        trees={trees}
        treeId={treeId}
        onClose={handleTreeSelectionModalClose}
        onTreeSelection={handleTreeSelection}
      />
      <TreeCreationModal
        open={treeCreationModalOpen && !loading}
        onClose={handleTreeCreationModalClose}
        onTreeCreation={handleTreeCreation}
      />
      <TreeDeletionModal
        open={treeDeletionModalOpen && !loading}
        onClose={handleTreeDeletionModalClose}
        treeId={treeId}
        treeLabel={
          trees != null && treeId != null
            ? trees.find((tree) => tree.id == treeId).treeLabel
            : ""
        }
        onTreeDeletion={handleTreeDeletion}
      />
      <EdgeCreationModal
        open={edgeCreationModalOpen && !loading}
        onClose={handleEdgeCreationModalClose}
        onEdgeCreation={handleEdgeCreation}
      />
      <EdgeEditionModal
        edgeDptBaseUrl={props.edgeDptBaseUrl}
        open={edgeEditionModalOpen && !loading}
        label={currentEdge ? currentEdge.label : ""}
        currentEdge={currentEdge}
        loadGraphData={loadGraphData}
        onClose={handleEdgeEditionModalClose}
        onEdgeDeletion={handleEdgeDelete}
        onLabelChange={handleEdgeLabelChange}
      />
      <NodeCreationModal
        open={nodeCreationModalOpen && !loading}
        onClose={handleNodeCreationModalClose}
        onNodeCreation={handleNodeCreation}
      />
      <NodeUpdateModal
        nodeDptBaseUrl={props.nodeDptBaseUrl}
        open={nodeUpdateModalOpen && !loading}
        currentNode={currentNode}
        loadGraphData={loadGraphData}
        nodeRoot={currentNode ? currentNode.data.nodeRoot : false}
        nodeTitle={currentNode ? currentNode.data.nodeTitle : ""}
        nodeText={currentNode ? currentNode.data.nodeText : ""}
        nodeImage={currentNode ? currentNode.data.nodeImage : ""}
        onClose={handleNodeUpdateModalClose}
        onNodeSetAsStart={handleNodeSetAsStart}
        onNodeDeletion={handleNodeDelete}
        onNodeUpdate={handleNodeUpdate}
      />
    </>
  );
}

export default GraphEditor;
