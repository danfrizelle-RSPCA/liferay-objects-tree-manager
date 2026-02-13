import ApiService from './ApiService';

/* NodeService: encapsulates CRUD operations for node objects.

Constructor takes a set of field/object names so the same class can be reused for different Liferay object schemas.
Example usage (from `src/flow-editor-index.jsx` / `src/flow-navigator-index.jsx`):
new NodeService(portalBaseUrl, nodeObjectNamePlural, treeObjectNamePlural, treeNodesRelationshipName, treeNodesRelationshipId, nodeTitle, nodeText, nodeImage, nodeYouTubeID, nodeRoot, xPosition, yPosition) */
class NodeService {

    constructor(baseURL, nodeObjectName, treeObjectName, treeNodesRelationshipName, treeNodesRelationshipId, nodeTitle, nodeText, nodeImage, nodeYouTubeID, nodeRoot, xPosition, yPosition) {
        this.baseURL = baseURL;
        this.nodeObjectName = nodeObjectName;
        this.treeObjectName = treeObjectName;
        this.treeNodesRelationshipName = treeNodesRelationshipName;
        this.treeNodesRelationshipId = treeNodesRelationshipId;
        this.nodeTitle = nodeTitle;
        this.nodeText = nodeText;
        this.nodeImage = nodeImage;
        this.nodeYouTubeID = nodeYouTubeID;
        this.nodeRoot = nodeRoot;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    // getStartNode: returns nodes flagged as root (start nodes) for a tree
    getStartNode(treeId) {
       
        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationshipName + "/?fields=id%2C" + this.nodeRoot, "GET").then(data => {
            return data.items.filter(item => {return item[this.nodeRoot]}).map(item => ({
                id: item.id
            }))
        });

    }

    // getNodes: fetch nodes for a given tree id and map fields into a normalized shape used by the UI (including position fields).
    getNodes(treeId) {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationshipName + "/?pageSize=500&fields=id%2C" + this.nodeRoot + "%2C"+ this.nodeTitle + "%2C" + this.nodeText + "%2C" + this.nodeImage + "%2C" + this.nodeYouTubeID + "%2C" + this.xPosition + "%2C" + this.yPosition, "GET").then(data => {
            console.log(`Dans test: ` + this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationshipName + "/?pageSize=500&fields=id%2C" + this.nodeRoot + "%2C"+ this.nodeTitle + "%2C" + this.nodeText + "%2C" + this.nodeImage + "%2C" + this.nodeYouTubeID + "%2C" + this.xPosition + "%2C" + this.yPosition);
            return data.items.map(item => ({
                id: item.id,
                nodeTitle: item[this.nodeTitle],
                nodeText: item[this.nodeText],
                nodeImage: item[this.nodeImage],
                nodeYouTubeID: item[this.nodeYouTubeID],
                nodeRoot: item[this.nodeRoot],
                xPosition: item[this.xPosition] ?? 0,
                yPosition: item[this.yPosition] ?? 0
            }));
        });

    }

    createNode(treeId, nodeTitle, nodeText, nodeImage, nodeYouTubeID, xPosition, yPosition) {
        
        const body = {
            [this.treeNodesRelationshipId]: treeId,
            [this.nodeTitle]: nodeTitle,
            [this.nodeText]: nodeText,
            [this.nodeImage]: nodeImage,
            [this.nodeYouTubeID]: nodeYouTubeID,
            [this.nodeRoot]: false,
            [this.xPosition]: xPosition,
            [this.yPosition]: yPosition
        };
        return ApiService.makeCall(this.baseURL + this.nodeObjectName, "POST", body).then(data => {
            return {
                id: data.id,
                nodeTitle: data[this.nodeTitle],
                nodeText: data[this.nodeText],
                nodeImage: data[this.nodeImage],
                nodeYouTubeID: data[this.nodeYouTubeID],
                xPosition: data[this.xPosition] ?? 0,
                yPosition: data[this.yPosition] ?? 0
            }
        });

    }

    updateNode(nodeId, nodeTitle, nodeText, nodeImage, nodeYouTubeID) {

        const body = {
            [this.nodeTitle]: nodeTitle,
            [this.nodeText]: nodeText,
            [this.nodeImage]: nodeImage,
            [this.nodeYouTubeID]: nodeYouTubeID
        };

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "PATCH", body);

    }

    setNodeAsStart(nodeId) {

        return ApiService.makeCall(
            this.baseURL + this.nodeObjectName + "/" + nodeId + "?fields=id%2C" + this.treeNodesRelationshipId,
            "GET"
        ).then(data => {
            return this.getNodes(data[this.treeNodesRelationshipId]).then(nodes => {
                return Promise.all(
                    nodes.map(node => {
                        const body = {
                            [this.nodeRoot]: node.id == nodeId
                        };
                        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + node.id, "PATCH", body);
                    })
                );
            });
        });

    }

    updateNodePosition(nodeId, xPosition, yPosition) {

        const body = {
            [this.xPosition]: xPosition,
            [this.yPosition]: yPosition
        };

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "PATCH", body);

    }

    deleteNode(nodeId) {

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "DELETE");

    }

}

export default NodeService;