import React, { useCallback } from "react";

import { Handle, Position } from "@xyflow/react";
import ClayPanel from "@clayui/panel";

function CustomNode({ data, isConnectable }) {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div
        className="custom-node-inner"
        style={{
          border: data.nodeRoot ? "1px solid red" : undefined,
        }}
      >
        <h3 className="font-weight-normal">
          {data.nodeTitle}{data.nodeRoot && <span style={{ color: "red" }}> *</span>}
        </h3>
        {/* {data.nodeText && <p style={{ margin: 0 }}>{data.nodeText}</p>} */}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CustomNode;
