import ApiService from './ApiService';

/* EdgeService: handles CRUD for edge objects and label updates.
Similar to NodeService, fields and relationship names are passed in the constructor so the service can be reused across schemas. */
class EdgeService {

    constructor(baseURL, edgeObjectName, treeObjectName, treeEdgesRelationName, treeEdgesRelationId, sourceRelationId, targetRelationId, edgeLabel) {
        this.baseURL = baseURL;
        this.edgeLabel = edgeLabel;
        this.edgeObjectName = edgeObjectName;
        this.treeObjectName = treeObjectName;
        this.treeEdgesRelationName = treeEdgesRelationName;
        this.treeEdgesRelationId = treeEdgesRelationId;
        this.sourceRelationId = sourceRelationId;
        this.targetRelationId = targetRelationId;
    }

    // getEdges: fetch all edges for a given tree and normalize field names
    getEdges(treeId) {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeEdgesRelationName + "/?pageSize=500&fields=id%2C" + this.edgeLabel + "%2C" + this.targetRelationId + "%2C" + this.sourceRelationId, "GET").then(data => {
            return data.items.map(item => ({
                id: item.id,
                sourceNodeId: item[this.sourceRelationId],
                targetNodeId: item[this.targetRelationId],
                edgeLabel: item[this.edgeLabel]
            }));
        });

    }

    // deleteEdge: remove an edge by id
    deleteEdge(edgeId) {

        return ApiService.makeCall(this.baseURL + this.edgeObjectName + "/" + edgeId, "DELETE")

    }

    // updateEdgeLabel: patch the edge label field
    updateEdgeLabel(edgeId, newLabel) {

        const body = {
            [this.edgeLabel]: newLabel
        };

        return ApiService.makeCall(this.baseURL + this.edgeObjectName + "/" + edgeId, "PATCH", body)

    }

    createEdge(treeId, sourceNodeId, targetNodeId, edgeLabel) {

        const body = {
            [this.treeEdgesRelationId]: treeId,
            [this.edgeLabel]: edgeLabel,
            [this.targetRelationId]: targetNodeId,
            [this.sourceRelationId]: sourceNodeId
        };

        return ApiService.makeCall(this.baseURL + this.edgeObjectName + "/", "POST", body).then(data => {
            return {
                id: data.id,
                edgeLabel: data[this.edgeLabel],
                sourceNodeId: data[this.sourceRelationId],
                targetNodeId: data[this.targetRelationId]
            }
        });

    }

}

export default EdgeService;
