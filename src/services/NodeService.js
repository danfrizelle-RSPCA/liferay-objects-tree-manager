import ApiService from './ApiService';

/* NodeService: encapsulates CRUD operations for node objects.

Constructor takes a set of field/object names so the same class can be reused for different Liferay object schemas.
Example usage (from `src/index.jsx`):
new NodeService(portalBaseUrl, nodeObjectNamePlural, treeObjectNamePlural, treeNodesRelationshipName, treeNodesRelationshipId, nodeTitle, nodeText, nodeImage,nodeRoot, xPosition, yPosition) */
class NodeService {

    constructor(baseURL, nodeObjectName, treeObjectName, treeNodesRelationName, treeNodesRelationId, nodeTitle, nodeText, nodeImage, nodeRoot, xPosition, yPosition) {
        this.baseURL = baseURL;
        this.nodeObjectName = nodeObjectName;
        this.treeObjectName = treeObjectName;
        this.treeNodesRelationName = treeNodesRelationName;
        this.treeNodesRelationId = treeNodesRelationId;
        this.nodeTitle = nodeTitle;
        this.nodeText = nodeText;
        this.nodeImage = nodeImage;
        this.nodeRoot = nodeRoot;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
    }

    // getStartNode: returns nodes flagged as root (start nodes) for a tree
    getStartNode(treeId) {
       
        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationName + "/?fields=id%2C" + this.nodeRoot, "GET").then(data => {
            return data.items.filter(item => {return item[this.nodeRoot]}).map(item => ({
                id: item.id
            }))
        });

    }

    // getNodes: fetch nodes for a given tree id and map fields into a normalized shape used by the UI (including position fields).
    getNodes(treeId) {

        return ApiService.makeCall(this.baseURL + this.treeObjectName + "/" + treeId + "/" + this.treeNodesRelationName + "/?pageSize=500&fields=id%2C" + this.nodeRoot + "%2C"+ this.nodeTitle + "%2C" + this.nodeText + "%2C" + this.nodeImage + "%2C" + this.xPosition + "%2C" + this.yPosition, "GET").then(data => {
            return data.items.map(item => ({
                id: item.id,
                nodeTitle: item[this.nodeTitle],
                nodeText: item[this.nodeText],
                nodeImage: item[this.nodeImage],
                nodeRoot: item[this.nodeRoot],
                xPosition: item[this.xPosition] ?? 0,
                yPosition: item[this.yPosition] ?? 0
            }));
        });

    }

    createNode(treeId, nodeTitle, nodeText, nodeImage, xPosition, yPosition) {
        
        const body = {
            [this.treeNodesRelationId]: treeId,
            [this.nodeTitle]: nodeTitle,
            [this.nodeText]: nodeText,
            [this.nodeImage]: nodeImage,
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
                xPosition: data[this.xPosition] ?? 0,
                yPosition: data[this.yPosition] ?? 0
            }
        });

    }

    updateNode(nodeId, nodeTitle, nodeText, nodeImage) {

        const body = {
            [this.nodeTitle]: nodeTitle,
            [this.nodeText]: nodeText,
            [this.nodeImage]: nodeImage
        };

        return ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId, "PATCH", body);

    }

    setNodeAsStart(nodeId) {

        ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + nodeId + "?fields=id%2C" + this.treeNodesRelationId, "GET").then(data => {

            this.getNodes(data[this.treeNodesRelationId]).then(nodes => {

                nodes.forEach(node => {
    
                    let body = {
                        [this.nodeRoot]: node.id == nodeId
                    }
                    ApiService.makeCall(this.baseURL + this.nodeObjectName + "/" + node.id, "PATCH", body);
    
                });
    
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